import { Envelope } from "./Envelope.js"
import { Filter } from "./Filter2.js"
import { Oscillator } from "./Oscillator.js"

/*
Each note must have its own filter node since each note needs its own filter envelope :(
*/
export class Signal {
    private context: AudioContext
    private baseFrequency: number
    private oscillatorA: Oscillator
    private oscillatorB: Oscillator
    private signalGain: GainNode
    private filterA: Filter
    private filterB: Filter
    //offsetA: number
    //offsetB: number
    //detuneA: number
    //detuneB: number

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

        this.oscillatorA.setAmplitude(1)
        this.oscillatorA.setWaveform("sawtooth")


        this.filterA.connect(this.signalGain)
        this.filterB.connect(this.signalGain)

        this.context = context


        //this.oscillator.type = 'sawtooth'
        //this.baseFrequency = baseFrequency
        //this.oscillator.frequency.value = this.baseFrequency

        //this.gain.gain.value = 0
        //this.filter.type = 'lowpass'

        //this.oscillator.start()
    }

    getOscillatorA(): Oscillator {
        return this.oscillatorA
    }

    getOscillatorB(): Oscillator {
        return this.oscillatorA
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

    init() {
        //this.oscillator.start()
    }

    //baseFrequency, amp envelope, filter envelope
    start(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        this.baseFrequency = baseFrequency

        const startTime: number = this.context.currentTime
        if(this.oscillatorA.getAmplitude() > 0) { //Oscillator A is on
            this.oscillatorA.setFrequency(baseFrequency)
            let gainParam = this.oscillatorA.getGainParam()
            gainParam.cancelScheduledValues(startTime)
            gainParam.setValueAtTime(this.oscillatorA.getGain(), startTime)
            gainParam.linearRampToValueAtTime(this.oscillatorA.getAmplitude(), startTime + ampEnvelope.attack)
            gainParam.linearRampToValueAtTime(ampEnvelope.sustain * this.oscillatorA.getAmplitude(), startTime + ampEnvelope.attack + ampEnvelope.decay)

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

        if(this.oscillatorB.getAmplitude() > 0) { //Oscillator B is on

        }
    }

    move(baseFrequency: number) {
        this.baseFrequency = baseFrequency

        const startTime: number = this.context.currentTime

        if(this.oscillatorA.getAmplitude() > 0) {
            let frequencyParam = this.oscillatorA.getFrequencyParam()
            frequencyParam.cancelScheduledValues(startTime)
            frequencyParam.setValueAtTime(baseFrequency, startTime)
        }
    }

    stop(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        this.baseFrequency = 0
        let gainParam = this.oscillatorA.getGainParam()
        let frequencyParam = this.filterA.getFrequencyParam()
        const startTime: number = this.context.currentTime
        gainParam.cancelScheduledValues(startTime)
        gainParam.setValueAtTime(this.oscillatorA.getGain(), startTime)
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



    destroy() {
        //this.oscillator.stop()
        //this.oscillator.disconnect()
        //this.gain.disconnect()
        //this.filter.disconnect()
    }

    toString() {
        return this.baseFrequency
    }
}