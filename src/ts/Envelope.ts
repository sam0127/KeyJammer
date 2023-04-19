export class Envelope {
    attack: number
    decay: number
    sustain: number
    release: number

    constructor(_a: number, _d: number, _s: number, _r: number) {
        this.attack = _a
        this.decay = _d
        this.sustain = _s
        this.release = _r
    }
}