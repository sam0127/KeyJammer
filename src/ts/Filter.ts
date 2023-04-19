export class Filter {
    type: string
    cutoff: number
    envCutoff: number
    resonance: number

    constructor(_t: string, _c: number, _e: number, _r: number) {
        this.type = _t
        this.cutoff = _c
        this.envCutoff = _e
        this.resonance = _r
    }
}