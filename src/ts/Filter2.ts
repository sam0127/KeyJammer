import { AudioNodeWrapper } from "./AudioNodeWrapper.js"

export class Filter extends AudioNodeWrapper {
    private node: BiquadFilterNode
    private type: string
    private frequency: number
    private envFrequency: number
    private q: number

    constructor(context: AudioContext) {
        super([context.createBiquadFilter()])
        this.node = <BiquadFilterNode>this.first()
    }

    getType() {
        return this.type
    }

    setType(type: BiquadFilterType) {
        this.type = type
        this.node.type = type
    }

    getFrequency() {
        return this.frequency
    }

    getFrequencyParam(): AudioParam {
        return this.node.frequency
    }

    setFrequency(freq: number) {
        this.frequency = freq
        this.node.frequency.value = freq
    }

    getEnvFrequency() {
        return this.envFrequency
    }

    setEnvFrequency(freq: number) {
        this.envFrequency = freq
    }

    getQ() {
        return this.q
    }

    setQ(q: number) {
        this.q = q
        this.node.Q.value = q
    }
}