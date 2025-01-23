/*
Each note must have its own filter node since filter nodes only have one input :(
*/
export class Note {
    oscillator: OscillatorNode
    gain: GainNode
    filter: BiquadFilterNode
    frequency: number

    constructor(context: AudioContext, frequency: number)
    {
        this.oscillator = context.createOscillator()
        this.gain = context.createGain()
        this.filter = context.createBiquadFilter()

        this.oscillator.connect(this.gain)
        this.gain.connect(this.filter)

        //this.oscillator.type = 'sawtooth'
        this.frequency = frequency
        this.oscillator.frequency.value = this.frequency

        this.gain.gain.value = 0
        this.filter.type = 'lowpass'
    }

    connect(destination: AudioNode) {
        this.filter.connect(destination)
    }

    init() {
        this.oscillator.start()
    }

    destroy() {
        this.oscillator.stop()
        this.oscillator.disconnect()
        this.gain.disconnect()
        this.filter.disconnect()
    }
}