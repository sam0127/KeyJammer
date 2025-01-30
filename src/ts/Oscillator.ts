import { AudioNodeWrapper } from "./AudioNodeWrapper.js"
import { Envelope } from "./Envelope.js"

export class Oscillator extends AudioNodeWrapper {
    private sourceNode: OscillatorNode
    private gainNode: GainNode
    private waveform: string
    private amplitude: number
    private detune: number
    private offset: number
    private on: boolean

    private ampEnvelope: Envelope

    constructor(context: AudioContext) {
        super([context.createOscillator(),context.createGain()])
        this.sourceNode = <OscillatorNode>this.first()
        this.gainNode = <GainNode>this.last()
        this.offset = 0
        this.detune = 0
        this.gainNode.gain.value = 0
        this.sourceNode.start()
    }

    setWaveform(waveform: OscillatorType) {
        this.waveform = waveform
        this.sourceNode.type = waveform
    }

    getAmplitude(): number {
        return this.amplitude
    }

    setAmplitude(amplitude: number) {
        this.amplitude = amplitude
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

    setOffset(offset: number) {
        this.offset = offset
        this.sourceNode.frequency.value = this.sourceNode.frequency.value * 2^(offset)
    }

    setDetune(detune: number) {
        this.detune = detune
        this.sourceNode.detune.value = detune
    }
}