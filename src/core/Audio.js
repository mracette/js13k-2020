const generateNoise = (audioCtx) => {
  const length = 5;
  const samples = length * audioCtx.sampleRate;
  const lBuffer = new Float32Array(samples);
  const rBuffer = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    lBuffer[i] = 1 - 2 * Math.random();
    rBuffer[i] = 1 - 2 * Math.random();
  }
  const buffer = audioCtx.createBuffer(2, samples, audioCtx.sampleRate);
  buffer.copyToChannel(lBuffer, 0);
  buffer.copyToChannel(rBuffer, 1);
  return buffer;
};

export class Audio {
  constructor() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const props = {
      audioCtx,
      sampleRate: audioCtx.sampleRate,
      baseNote: 220,
      intervals: [0, 3, 5, 7, 10, 12],
      attack: 0.15,
      sustain: 0.03,
      release: 0.08,
      filterMin: 120,
      filterMax: 2200,
      premaster: audioCtx.createGain(),
      gain: audioCtx.createGain(),
      filter: audioCtx.createBiquadFilter(),
      square: audioCtx.createOscillator(),
      sine: audioCtx.createOscillator(),
      reverb: audioCtx.createConvolver()
    };

    Object.assign(this, props);

    this.premaster.connect(audioCtx.destination);
    this.premaster.gain.value = 0.5;

    // gain setup
    // this.gain.connect(audioCtx.destination);
    this.gain.connect(this.reverb);

    // reverb
    // this.reverb.connect(this.gain);
    this.reverb.connect(this.premaster);
    this.reverb.normalize = true;

    // filter setup
    this.filter.type = 'lowpass';
    this.filter.Q.value = 1;
    this.filter.connect(this.reverb);
    // this.filter.connect(convolver);

    // square setup
    this.square.type = 'square';
    this.square.connect(this.filter);

    // sine setup
    this.sine.type = 'sine';
    this.sine.connect(this.gain);

    this.renderReverb(5);
  }

  renderReverb(length) {
    const offline = new OfflineAudioContext(
      2,
      this.sampleRate * length,
      this.sampleRate
    );

    const gain = offline.createGain();
    gain.gain.value = 1;
    gain.gain.exponentialRampToValueAtTime(0.00001, length);
    gain.connect(offline.destination);

    const tailLPFilter = offline.createBiquadFilter();
    tailLPFilter.type = 'lowpass';
    tailLPFilter.frequency.value = 5000;
    tailLPFilter.connect(gain);

    const tailHPFilter = offline.createBiquadFilter();
    tailHPFilter.type = 'highpass';
    tailHPFilter.frequency.value = 500;
    tailHPFilter.connect(tailLPFilter);

    const noise = generateNoise(this.audioCtx);
    const noiseSource = offline.createBufferSource();
    noiseSource.buffer = noise;
    noiseSource.connect(tailHPFilter);
    noiseSource.start();

    offline.startRendering().then((buffer) => {
      this.reverb.buffer = buffer;
      //   const tail = this.audioCtx.createBufferSource();
      //   tail.buffer = buffer;
      //   tail.loop = false;
      //   this.audioCtx.state === 'suspended' && this.audioCtx.resume();
      //   tail.connect(this.audioCtx.destination);
      //   tail.start();
    });
  }

  intervalToHz(baseNote = this.baseNote, halfSteps) {
    let baseExp;
    halfSteps > 0 ? (baseExp = 2) : (baseExp = 0.5);
    return this.baseNote * Math.pow(Math.pow(baseExp, 1 / 12), halfSteps);
  }

  start() {
    this.audioCtx.state === 'suspended' && this.audioCtx.resume();
    const time = this.audioCtx.currentTime;
    const rand = Math.floor(Math.random() * this.intervals.length);
    const note = this.intervalToHz(null, this.intervals[rand]);
    this.square.frequency.value = note;
    this.sine.frequency.value = note / 4;
    let noteTime = time;
    try {
      this.square.start();
      this.sine.start();
    } catch {}
    this.gain.gain.value = 0;
    this.filter.frequency.value = this.filterMin;
    this.gain.gain.linearRampToValueAtTime(1, (noteTime += this.attack));
    this.filter.frequency.linearRampToValueAtTime(this.filterMax, noteTime);
    this.gain.gain.linearRampToValueAtTime(0.75, (noteTime += this.sustain));
    this.filter.frequency.linearRampToValueAtTime(
      this.filterMin + 0.75 * (this.filterMax - this.filterMin),
      noteTime
    );
    this.gain.gain.linearRampToValueAtTime(0, (noteTime += this.release));
    this.filter.frequency.linearRampToValueAtTime(this.filterMin, noteTime);
    this.gain.gain.setValueAtTime(0, noteTime);
  }
}
