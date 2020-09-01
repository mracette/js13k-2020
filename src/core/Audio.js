export class Audio {
  constructor() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    this.baseNote = 220;
    this.intervals = [0, 3, 5, 7, 10, 12];

    const asdr = {
      attack: 0.15,
      sustain: 0.03,
      release: 0.08
    };

    const filterParams = {
      filterMin: 120,
      filterMax: 2200
    };

    // make gain
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);

    // reverb
    // const convolver = audioCtx.createConvolver();
    // convolver.connect(gain);

    // make filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 1;
    // filter.connect(convolver);
    filter.connect(gain);

    // make square
    const square = audioCtx.createOscillator();
    square.type = 'square';
    square.connect(filter);

    // make sine
    const sine = audioCtx.createOscillator();
    sine.type = 'sine';
    sine.connect(gain);

    Object.assign(this, {
      ...asdr,
      ...filterParams,
      filter,
      gain,
      audioCtx,
      square,
      sine
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
  }
}
