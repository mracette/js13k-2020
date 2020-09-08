import { boundedSin, RAND } from '../utils/math';

const generateNoise = (audioCtx) => {
  const samples = 5 * audioCtx.sampleRate;
  const lBuffer = new Float32Array(samples);
  const rBuffer = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    lBuffer[i] = 1 - 2 * RAND();
    rBuffer[i] = 1 - 2 * RAND();
  }
  const buffer = audioCtx.createBuffer(2, samples, audioCtx.sampleRate);
  buffer.copyToChannel(lBuffer, 0);
  buffer.copyToChannel(rBuffer, 1);
  return buffer;
};

export class GameAudio {
  constructor() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const bps = 65 / 60;

    const props = {
      audioStartTime: null,
      state: 'stopped',
      noteTypes: ['q', 'e'],
      noteType: 1,
      previousNote: null,
      audioCtx,
      sampleRate: audioCtx.sampleRate,
      bps,
      baseNote: 392 / 2, // G4
      modes: [
        [0, 3, 5, 7, 10], // I7-
        [-4, -2, 0, 3, 7], // VImaj7
        [-9, -7, -5, -2, 2, 3], // IVmaj7
        [-7, -3, 0, 3, 5, 7] // V7
      ],
      measures: [0, 1, 0, 1, 0, 1, 2, 3],
      attack: 0.15,
      sustain: 0.03,
      sustainAmount: 0.75,
      release: 0.08,
      filterMin: 90,
      filterMax: 900,
      reverbTime: 3.5,
      premasterFilterFreq: boundedSin(32 * bps, 350, 6500, 8 * bps),
      premaster: audioCtx.createGain(),
      premasterFilter: audioCtx.createBiquadFilter(),
      filter: audioCtx.createBiquadFilter(),
      square: audioCtx.createOscillator(),
      squareEnv: audioCtx.createGain(),
      sine: audioCtx.createOscillator(),
      sineEnv: audioCtx.createGain(),
      reverb: audioCtx.createConvolver()
    };

    Object.assign(this, props);

    this.premasterFilter.type = 'lowpass';
    this.premasterFilter.Q.value = 1;
    this.premasterFilter.connect(audioCtx.destination);

    this.premaster.connect(this.premasterFilter);
    this.premaster.gain.value = 0.5;

    this.reverb.normalize = true;
    this.renderReverbTail(5).then((buffer) => (this.reverb.buffer = buffer));
    this.reverb.connect(this.premaster);

    this.filter.type = 'lowpass';
    this.filter.Q.value = 2.7;
    this.filter.connect(this.reverb);

    // square setup
    this.square.type = 'square';
    this.squareEnv.gain.value = 0;
    this.square.connect(this.squareEnv);
    this.squareEnv.connect(this.filter);

    // sine setup
    this.sine.type = 'sine';
    this.sineEnv.gain.value = 0;
    this.sine.connect(this.sineEnv);
    this.sineEnv.connect(this.premaster);
  }

  start() {
    this.audioCtx.state === 'suspended' && this.audioCtx.resume();
    try {
      this.square.start();
      this.sine.start();
      this.state = 'started';
    } catch {
      this.state = 'started';
    }
  }

  createFilter(audioCtx, type, frequency, destination) {
    const node = audioCtx.createBiquadFilter();
    node.frequency.value = frequency;
    node.type = type;
    destination && node.connect(destination);
    return node;
  }

  renderReverbTail() {
    const offline = new OfflineAudioContext(
      2,
      this.sampleRate * this.reverbTime,
      this.sampleRate
    );

    const envelope = offline.createGain();
    envelope.gain.exponentialRampToValueAtTime(0.00001, this.reverbTime);
    envelope.connect(offline.destination);

    const tailLPFilter = this.createFilter(offline, 'lowpass', 5000, envelope);
    const tailHPFilter = this.createFilter(
      offline,
      'highpass',
      500,
      tailLPFilter
    );

    const noise = generateNoise(this.audioCtx);
    const noiseSource = offline.createBufferSource();
    noiseSource.buffer = noise;
    noiseSource.connect(tailHPFilter);
    noiseSource.start();

    return offline.startRendering();
  }

  intervalToHz(interval) {
    let baseExp;
    interval > 0 ? (baseExp = 2) : (baseExp = 0.5);
    return (
      this.baseNote * Math.pow(Math.pow(baseExp, 1 / 12), Math.abs(interval))
    );
  }

  applyEnvelop(time, node, prop, min, max, sustain = 1) {
    let noteTime = time;
    node[prop].setValueAtTime(min, noteTime);
    node[prop].linearRampToValueAtTime(max, (noteTime += this.attack));
    node[prop].linearRampToValueAtTime(
      min + this.sustainAmount * (max - min),
      (noteTime += this.sustain * sustain)
    );
    node[prop].linearRampToValueAtTime(min, (noteTime += this.release));
  }

  trigger(interval, type, opts) {
    const note = interval ? this.intervalToHz(interval) : null;
    const time = this.audioCtx.currentTime;
    switch (type) {
      case 'square':
        this.square.frequency.value = note;
        this.applyEnvelop(
          time,
          this.squareEnv,
          'gain',
          0,
          1 - RAND() / 4,
          0.25 + RAND() / 2
        );
        this.applyEnvelop(
          time,
          this.filter,
          'frequency',
          this.filterMin,
          this.filterMax
        );
        break;
      case 'sine':
        this.sine.frequency.value = note;
        this.applyEnvelop(time, this.sineEnv, 'gain', 0, 1, 32);
        break;
      case 'noise': {
        const source = this.audioCtx.createBufferSource();
        const wet = this.audioCtx.createGain();
        const dry = this.audioCtx.createGain();
        source.buffer = this.reverb.buffer;
        source.connect(dry);
        source.connect(wet);
        dry.connect(this.premaster);
        wet.connect(this.reverb);
        wet.gain.value = 0.2 * opts.gain || 1;
        dry.gain.value = 0.6 * opts.gain || 1;
        source.detune.value = opts.detune || 0;
        source.start(0, 0, opts.duration || 2.75);
        break;
      }
    }
  }

  update(gameTime) {
    if (this.state === 'started') {
      const gameSeconds = gameTime / 1000;
      this.audioStartTime === null && (this.audioStartTime = gameSeconds);
      const elapsed = gameSeconds - this.audioStartTime;
      this.premasterFilter.frequency.value = this.premasterFilterFreq(elapsed);
      const divisions = {
        e: ~~(elapsed * this.bps * 2),
        t: ~~((elapsed * this.bps * 3) / 2),
        q: ~~(elapsed * this.bps),
        h: ~~((elapsed * this.bps) / 2),
        measure: ~~((elapsed * this.bps) / 4),
        twoMeasures: ~~((elapsed * this.bps) / 8)
      };
      if (this.previousQuarter !== divisions.q) {
        // "snare"
        divisions.q % 2 === 1 &&
          this.trigger(null, 'noise', { detune: -1200, gain: 0.15 });
        this.previousQuarter = divisions.q;
      }
      if (this.previousTriplet !== divisions.t) {
        // "hats"
        this.trigger(null, 'noise', {
          detune: 2400,
          gain: 0.2,
          duration: 0.01
        });
        this.previousTriplet = divisions.t;
      }
      // play bass every half note
      if (this.previousHalf !== divisions.h) {
        const modeIndex = this.measures[divisions.twoMeasures % 8];
        const mode = this.modes[modeIndex];
        this.trigger(mode[0] - 12, 'sine'); // expected to always be the bass note
        this.previousHalf = divisions.h;
      }
      // change note types every bar
      if (divisions.measure !== this.previousMeasure) {
        this.noteType = this.noteTypes[
          Math.floor(RAND() * this.noteTypes.length)
        ];
        this.previousMeasure = divisions.measure;
      }
      // trigger square on every noteType division
      const noteIndex = divisions[this.noteType];
      if (this.previousNote !== noteIndex) {
        const modeIndex = this.measures[divisions.twoMeasures % 8];
        const mode = this.modes[modeIndex];
        this.trigger(mode[Math.floor(RAND() * mode.length)], 'square');
        this.previousNote = noteIndex;
      }
    }
  }
}
