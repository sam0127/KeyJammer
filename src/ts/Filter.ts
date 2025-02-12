import { NodeChain } from "./NodeChain.js"

export class Filter extends NodeChain {
    private node: BiquadFilterNode
    private type: string
    private frequency: number
    private envFrequency: number
    private q: number
    private gain: number

    constructor(context: AudioContext) {
        super([context.createBiquadFilter()])
        this.node = <BiquadFilterNode>this.first()
        this.frequency = 1
        this.node.frequency.value = 1
        this.envFrequency = 1
    }

    destroy() {
        this.node.disconnect()
        this.node = null
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
        if(this.node.type.includes('shelf')) {
            this.gain = q - 10
            this.node.gain.value = q - 10
        } else {
            this.q = q
            this.node.Q.value = q
        }
    }

    getGain() {
        return this.gain
    }
}