export class Note {
    constructor(context, frequency) {
        this.oscillator = context.createOscillator();
        this.gain = context.createGain();
        this.filter = context.createBiquadFilter();
        this.oscillator.connect(this.gain);
        this.gain.connect(this.filter);
        //this.oscillator.type = 'sawtooth'
        this.frequency = frequency;
        this.oscillator.frequency.value = this.frequency;
        this.gain.gain.value = 0;
        this.filter.type = 'lowpass';
    }
    connect(destination) {
        this.filter.connect(destination);
    }
    init() {
        this.oscillator.start();
    }
}
