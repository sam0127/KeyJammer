export class FilterSettings {
    type: string
    frequency: number
    q: number
    envFrequency: number

    constructor(type: string, frequency: number, envFrequency: number, q: number) {
        this.type = type
        this.frequency = frequency
        this.envFrequency = frequency
        this.q = q
    }
}