import { NodeChain } from "./NodeChain.js"
import { Envelope } from "./Envelope.js"

export class Oscillator extends NodeChain {
    private sourceNode: OscillatorNode
    private gainNode: GainNode
    private waveform: string
    private amplitude: number
    private detune: number
    private on: boolean

    private ampEnvelope: Envelope

    constructor(context: AudioContext) {
        super([context.createOscillator(),context.createGain()])
        this.sourceNode = <OscillatorNode>this.nodes[0]
        this.gainNode = <GainNode>this.nodes[1]
        this.detune = 0
        this.gainNode.gain.value = 1
        this.sourceNode.start()
    }

    destroy() {
        this.sourceNode.stop()
        this.sourceNode.disconnect()
        this.gainNode.disconnect()
        this.gainNode = null
        this.sourceNode = null
    }

    first() {
        return this.sourceNode
    }

    last() {
        return this.gainNode
    }

    setWaveform(waveform: OscillatorType) {
        this.waveform = waveform
        this.sourceNode.type = waveform
    }

    getGain(): number {
        return this.gainNode.gain.value
    }

    getGainParam(): AudioParam {
        return this.gainNode.gain
    }

    getFrequencyParam(): AudioParam {
        return this.sourceNode.frequency
    }

    setGain(gain: number) {
        this.gainNode.gain.value = gain
    }

    setFrequency(freq: number) {
        this.sourceNode.frequency.value = freq
    }

    setDetune(detune: number) {
        this.detune = detune
        this.sourceNode.detune.value = detune
    }
}