export class Note {
    oscillator: OscillatorNode
    gain: GainNode
    filter: BiquadFilterNode

    constructor(context: AudioContext, frequency: number)
    {
        this.oscillator = context.createOscillator()
        this.gain = context.createGain()
        this.filter = context.createBiquadFilter()

        this.oscillator.connect(this.gain)
        this.gain.connect(this.filter)

        this.oscillator.type = 'square'
        this.oscillator.frequency.value = frequency

        this.gain.gain.value = 0
    }

    connect(destination: AudioNode) {
        this.filter.connect(destination)
    }

    init() {
        this.oscillator.start()
    }
}