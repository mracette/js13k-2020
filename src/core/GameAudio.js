import { boundedSin } from '../utils/math';
import { RAND, F32 } from '../utils/functions';

export class GameAudio {
  constructor() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const bps = 65 / 60;

    const props = {
      audioStartTime: null,
      state: 'stopped',
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
      reverbTime: 2,
      premasterFilterFreq: boundedSin(32 * bps, 350, 6500, 8 * bps),
      premaster: audioCtx.createGain(),
      premasterFilter: audioCtx.createBiquadFilter(),
      envFilter: audioCtx.createBiquadFilter(),
      envFilterMin: 90,
      envFilterMax: 900,
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

    this.renderReverbTail((buffer) => {
      this.reverb.buffer = buffer;
      this.reverb.connect(this.premaster);
    });

    this.envFilter.type = 'lowpass';
    this.envFilter.Q.value = 2.7;
    this.envFilter.connect(this.reverb);

    // square setup
    this.square.type = 'square';
    this.squareEnv.gain.value = 0;
    this.square.connect(this.squareEnv);
    this.squareEnv.connect(this.envFilter);

    // sine setup
    this.sine.type = 'sine';
    this.sineEnv.gain.value = 0;
    this.sine.connect(this.sineEnv);
    this.sineEnv.connect(this.premaster);
  }

  setParam(audioParam, value) {
    audioParam.setValueAtTime(value, this.audioCtx.currentTime);
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

  generateNoise() {
    const samples = this.reverbTime * this.audioCtx.sampleRate;
    const lBuffer = F32(samples);
    const rBuffer = F32(samples);
    for (let i = 0; i < samples; i++) {
      lBuffer[i] = 1 - 2 * RAND();
      rBuffer[i] = 1 - 2 * RAND();
    }
    const buffer = this.audioCtx.createBuffer(
      2,
      samples,
      this.audioCtx.sampleRate
    );
    buffer.getChannelData(0).set(lBuffer);
    buffer.getChannelData(1).set(rBuffer);
    return buffer;
  }

  renderReverbTail(callback) {
    const offline = new (window.OfflineAudioContext ||
      window.webkitOfflineAudioContext)(
      2,
      this.sampleRate * this.reverbTime,
      this.sampleRate
    );

    const envelope = offline.createGain();
    envelope.connect(offline.destination);
    envelope.gain.setValueAtTime(1, 0);
    envelope.gain.linearRampToValueAtTime(0, this.reverbTime);

    const tailLPFilter = this.createFilter(offline, 'lowpass', 5000, envelope);
    const tailHPFilter = this.createFilter(
      offline,
      'highpass',
      500,
      tailLPFilter
    );

    const noiseSource = offline.createBufferSource();
    noiseSource.buffer = this.generateNoise();
    noiseSource.connect(tailHPFilter);
    noiseSource.start();
    offline.startRendering();

    offline.oncomplete = (buffer) => {
      console.log(buffer.renderedBuffer);
      callback(buffer.renderedBuffer);
    };
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
    const note = this.intervalToHz(interval);
    const time = this.audioCtx.currentTime;
    switch (type) {
      case 'square':
        this.setParam(this.square.frequency, note);
        this.applyEnvelop(time, this.squareEnv, 'gain', 0, 0.8, 0.25);
        this.applyEnvelop(
          time,
          this.envFilter,
          'frequency',
          this.envFilterMin,
          this.envFilterMax
        );
        break;
      case 'sine':
        this.setParam(this.sine.frequency, note);
        this.applyEnvelop(time, this.sineEnv, 'gain', 0, opts.vol || 1, 32);
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
        this.setParam(wet.gain, 0.2 * opts.vol || 1);
        this.setParam(dry.gain, 0.6 * opts.vol || 1);
        this.setParam(source.playbackRate, opts.speed || 1);
        source.start(0, 0, opts.duration);
        break;
      }
    }
  }

  update(gameTime) {
    if (this.state === 'started') {
      const gameSeconds = gameTime / 1000;
      this.audioStartTime === null && (this.audioStartTime = gameSeconds);
      const elapsed = gameSeconds - this.audioStartTime;
      this.setParam(
        this.premasterFilter.frequency,
        this.premasterFilterFreq(elapsed)
      );
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
          this.trigger(null, 'noise', {
            speed: 0.5,
            vol: 0.01
            // duration: 3
          });
        this.previousQuarter = divisions.q;
      }
      if (this.previousTriplet !== divisions.t) {
        // "hats"
        this.trigger(null, 'noise', {
          speed: 3,
          vol: 0.2,
          duration: 0.01
        });
        this.previousTriplet = divisions.t;
      }
      // play bass every half note
      if (this.previousHalf !== divisions.h) {
        const modeIndex = this.measures[divisions.twoMeasures % 8];
        const mode = this.modes[modeIndex];
        this.trigger(mode[0] - 24, 'sine', { vol: 0.3 }); // expected to always be the bass note
        this.trigger(mode[0] - 12, 'square', { vol: 0.3 }); // expected to always be the bass note
        this.previousHalf = divisions.h;
      }
      // change note types every bar
      if (divisions.measure !== this.previousMeasure) {
        this.noteRand = RAND();
        this.previousMeasure = divisions.measure;
      }
      // trigger square on every division
      let squareNote;
      if (this.noteRand < 0.5) {
        squareNote = divisions.q;
      } else {
        squareNote = divisions.e;
      }
      if (squareNote && this.previousNote !== squareNote) {
        const modeIndex = this.measures[divisions.twoMeasures % 8];
        const mode = this.modes[modeIndex];
        this.trigger(mode[Math.floor(RAND() * mode.length)], 'square');
        this.previousNote = squareNote;
      }
    }
  }
}
