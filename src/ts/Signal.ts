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
        //this.oscillatorA.setWaveform("sine")

        this.oscillatorB.setAmplitude(1)
        //this.oscillatorB.setWaveform("sine")
        //this.oscillatorB.setOffset(1)
        this.oscillatorB.setDetune(1200)


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
            gainParam.exponentialRampToValueAtTime(ampEnvelope.sustain * this.oscillatorA.getAmplitude() + 0.01, startTime + ampEnvelope.attack + ampEnvelope.decay)
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
            this.oscillatorB.setFrequency(baseFrequency)
            let gainParam = this.oscillatorB.getGainParam()
            gainParam.cancelScheduledValues(startTime)
            gainParam.setValueAtTime(this.oscillatorB.getGain(), startTime)
            gainParam.linearRampToValueAtTime(this.oscillatorB.getAmplitude(), startTime + ampEnvelope.attack)
            gainParam.exponentialRampToValueAtTime(ampEnvelope.sustain * this.oscillatorA.getAmplitude() + 0.01, startTime + ampEnvelope.attack + ampEnvelope.decay)
            gainParam.linearRampToValueAtTime(ampEnvelope.sustain * this.oscillatorA.getAmplitude(), startTime + ampEnvelope.attack + ampEnvelope.decay)
        }
    }

    move(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        this.baseFrequency = baseFrequency

        const startTime: number = this.context.currentTime

        if(this.oscillatorA.getAmplitude() > 0) {
            let gainParam = this.oscillatorA.getGainParam()
            let frequencyParam = this.oscillatorA.getFrequencyParam()

            frequencyParam.cancelScheduledValues(startTime)
            frequencyParam.setValueAtTime(baseFrequency, startTime)
            if(ampEnvelope.sustain == 0) {
                gainParam.cancelScheduledValues(startTime)
                gainParam.setValueAtTime(this.oscillatorA.getGain(), startTime)
                gainParam.linearRampToValueAtTime(this.oscillatorA.getAmplitude(), startTime + ampEnvelope.attack)
                gainParam.linearRampToValueAtTime(ampEnvelope.sustain * this.oscillatorA.getAmplitude(), startTime + ampEnvelope.attack + ampEnvelope.decay)
            } else {

            }
        }

        if(this.oscillatorB.getAmplitude() > 0) {
            let gainParam = this.oscillatorB.getGainParam()
            let frequencyParam = this.oscillatorB.getFrequencyParam()

            frequencyParam.cancelScheduledValues(startTime)
            frequencyParam.setValueAtTime(baseFrequency, startTime)
            if(ampEnvelope.sustain == 0) {
                gainParam.cancelScheduledValues(startTime)
                gainParam.setValueAtTime(this.oscillatorB.getGain(), startTime)
                gainParam.linearRampToValueAtTime(this.oscillatorB.getAmplitude(), startTime + ampEnvelope.attack)
                gainParam.linearRampToValueAtTime(ampEnvelope.sustain * this.oscillatorB.getAmplitude(), startTime + ampEnvelope.attack + ampEnvelope.decay)
            } else {

            }
        }
    }

    stop(baseFrequency: number, ampEnvelope: Envelope, filterEnvelope: Envelope) {
        this.baseFrequency = 0
        let gainParamA = this.oscillatorA.getGainParam()
        let frequencyParamA = this.filterA.getFrequencyParam()
        let gainParamB = this.oscillatorB.getGainParam()
        let frequencyParamB = this.filterB.getFrequencyParam()
        const startTime: number = this.context.currentTime
        gainParamA.cancelScheduledValues(startTime)
        gainParamA.setValueAtTime(this.oscillatorA.getGain(), startTime)
        //gainParamA.linearRampToValueAtTime(0, startTime + ampEnvelope.release)
        gainParamA.exponentialRampToValueAtTime(0.01, startTime + ampEnvelope.release)
        gainParamA.linearRampToValueAtTime(0, startTime + ampEnvelope.release)

        /*
        frequencyParam.cancelScheduledValues(startTime)
        frequencyParam.setValueAtTime(frequencyParam.value, startTime)
        frequencyParam.linearRampToValueAtTime(this.filterA.getFrequency() * baseFrequency, startTime + filterEnvelope.release)
        */

        gainParamB.cancelScheduledValues(startTime)
        gainParamB.setValueAtTime(this.oscillatorB.getGain(), startTime)
        //gainParamB.linearRampToValueAtTime(0, startTime + ampEnvelope.release)
        gainParamB.exponentialRampToValueAtTime(0.01, startTime + ampEnvelope.release)
        gainParamB.linearRampToValueAtTime(0, startTime + ampEnvelope.release)
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