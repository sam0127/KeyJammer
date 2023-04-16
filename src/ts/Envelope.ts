export class Envelope {
    attack: Number
    decay: Number
    sustain: Number
    release: Number

    constructor(_a: Number, _d: Number, _s: Number, _r: number) {
        this.attack = _a
        this.decay = _d
        this.sustain = _s
        this.release = _r
    }
}