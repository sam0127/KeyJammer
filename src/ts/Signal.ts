import { Envelope } from "./Envelope.js"
import { Filter } from "./Filter.js"
import { Oscillator } from "./Oscillator.js"

export class Signal {
    private context: AudioContext
    private baseFrequency: number
    private oscillatorA: Oscillator
    private oscillatorB: Oscillator
    private signalGain: GainNode
    private filterA: Filter
    private filterB: Filter

    constructor(context: AudioContext)
    {
        this.baseFrequency = 0
        this.oscillatorA = new Oscillator(context)
        this.oscillatorB = new Oscillator(context)

        this.filterA = new Filter(context)
        this.filterB = new Filter(context)

        this.signalGain = context.createGain()

        this.oscillatorA.connect(this.filterA.first())
        this.oscillatorB.connect(this.filterB.first())

        this.oscillatorA.setGain(1)
        this.oscillatorB.setGain(1)

        this.filterA.connect(this.signalGain)
        this.filterB.connect(this.signalGain)

        this.context = context

        this.signalGain.gain.value = 0
    }

    
    destroy() {
        this.oscillatorA.destroy()
        this.oscillatorB.destroy()
        this.filterA.destroy()
        this.filterB.destroy()
        this.signalGain.disconnect()
        this.signalGain = null
    }

    getOscillatorA(): Oscillator {
        return this.oscillatorA
    }

    getOscillatorB(): Oscillator {
        return this.oscillatorB
    }

    getFilterA(): Filter {
        return this.filterA
    }

    getFilterB(): Filter {
        return this.filterB
    }

    getFrequency(): number {
        return this.baseFrequency
    }

    //baseFrequency, amp envelope, filter envelope
    start(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        this.baseFrequency = baseFrequency

        const startTime: number = this.context.currentTime
        this.oscillatorA.setFrequency(baseFrequency)
        this.oscillatorB.setFrequency(baseFrequency)
        let gainParam = this.signalGain.gain
        gainParam.cancelScheduledValues(startTime)
        gainParam.setValueAtTime(gainParam.value, startTime)
        gainParam.linearRampToValueAtTime(1, startTime + ampEnvelope.attack)
        gainParam.exponentialRampToValueAtTime(ampEnvelope.sustain * 1 + 0.01, startTime + ampEnvelope.attack + ampEnvelope.decay)
        gainParam.linearRampToValueAtTime(ampEnvelope.sustain * 1, startTime + ampEnvelope.attack + ampEnvelope.decay)

        /*
        let frequencyParam = this.filterA.getFrequencyParam()
        frequencyParam.cancelScheduledValues(startTime)
        frequencyParam.setValueAtTime(this.filterA.getFrequency() * baseFrequency, startTime)
        frequencyParam.linearRampToValueAtTime(
            (this.filterA.getFrequency() + this.filterA.getEnvFrequency()) * baseFrequency,
            startTime + filterEnvelope.attack
        )
        frequencyParam.linearRampToValueAtTime(
            (this.filterA.getFrequency() + filterEnvelope.sustain * this.filterA.getEnvFrequency()) * baseFrequency,
            startTime + filterEnvelope.attack + filterEnvelope.decay
        )
        */
    }

    move(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        this.baseFrequency = baseFrequency

        const startTime: number = this.context.currentTime

        let gainParam = this.signalGain.gain
        let frequencyParamA = this.oscillatorA.getFrequencyParam()
        let frequencyParamB = this.oscillatorB.getFrequencyParam()
        frequencyParamA.cancelScheduledValues(startTime)
        frequencyParamA.setValueAtTime(baseFrequency, startTime)
        frequencyParamB.cancelScheduledValues(startTime)
        frequencyParamB.setValueAtTime(baseFrequency, startTime)
        if(ampEnvelope.sustain == 0) {
            gainParam.cancelScheduledValues(startTime)
            gainParam.setValueAtTime(gainParam.value, startTime)
            gainParam.linearRampToValueAtTime(1, startTime + ampEnvelope.attack)
            gainParam.exponentialRampToValueAtTime(ampEnvelope.sustain * 1 + 0.01, startTime + ampEnvelope.attack + ampEnvelope.decay)
            gainParam.linearRampToValueAtTime(ampEnvelope.sustain * 1, startTime + ampEnvelope.attack + ampEnvelope.decay)
        }
    }

    stop(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        //this.baseFrequency = 0

        let gainParam = this.signalGain.gain
        const startTime: number = this.context.currentTime
        gainParam.cancelScheduledValues(startTime)
        gainParam.setValueAtTime(gainParam.value, startTime)
        gainParam.exponentialRampToValueAtTime(0.01, startTime + ampEnvelope.release)
        gainParam.linearRampToValueAtTime(0, startTime + ampEnvelope.release)


        /*
        frequencyParam.cancelScheduledValues(startTime)
        frequencyParam.setValueAtTime(frequencyParam.value, startTime)
        frequencyParam.linearRampToValueAtTime(this.filterA.getFrequency() * baseFrequency, startTime + filterEnvelope.release)
        */
    }

    setFilterA(filter: Filter) { // could replace Filter with Object?
        
    }

    setFilterB(filter: Filter) { // could replace Filter with Object?
        
    }

    connect(destination: AudioNode) {
        this.signalGain.connect(destination)
    }




    toString() {
        return this.baseFrequency
    }
}