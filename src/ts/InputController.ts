import { Envelope } from './Envelope.js'
import { NodeChain } from './NodeChain.js'
import { SignalQueue } from './SignalQueue.js'
import { Signal } from './Signal.js'
import { LinkedQueue } from './LinkedQueue.js'

export class InputController {
    context: AudioContext
    ampEnvelope: Envelope
    filterEnvelope: Envelope
    globalChain: NodeChain
    tuningSystem: Map<string, number>
    octaveOffset: number = 0
    isMonophonic: boolean = false
    activeSignals: SignalQueue
    availableSignals: LinkedQueue<Signal>
    heldInputs: LinkedQueue<number>

    signalCapacity: number

    constructor(tuningSystem: Map<string, number>) {
        this.context = new AudioContext()
        this.context.suspend()
        this.ampEnvelope = new Envelope(1, 1, 1, 0.05)
        this.filterEnvelope = new Envelope(1, 1, 1, 0.05)
        this.globalChain = new NodeChain([
            this.context.createGain(),
            this.context.createAnalyser(),
            this.context.createGain(),
            this.context.createGain()
        ])
        this.tuningSystem = tuningSystem

        this.globalChain.last().connect(this.context.destination)
        const analyzerGain = <GainNode>this.globalChain.first()
        const gateGain = <GainNode>this.globalChain.get(2)
        const volumeGain = <GainNode>this.globalChain.last()
        analyzerGain.gain.value = 0.2
        gateGain.gain.value = 0.2
        volumeGain.gain.value = 0.5

        this.signalCapacity = 8
        this.createSignals()

        this.heldInputs = new LinkedQueue<number>()
    }

    startSignal(name: string) {
        if(this.tuningSystem.has(name)) {
            let freq = this.tuningSystem.get(name)
            this.heldInputs.push(freq)
            if(!this.availableSignals.isEmpty()) {
                let signal = this.availableSignals.pop()
                signal.start(freq, this.ampEnvelope, this.filterEnvelope)
                this.activeSignals.push(signal)
            } else {
                let signal = this.activeSignals.pop()
                signal.move(freq, this.ampEnvelope, this.filterEnvelope)
                this.activeSignals.push(signal)
            }
        }
    }

    stopSignal(name: string) {
        if(this.tuningSystem.has(name)) {
            let freq = this.tuningSystem.get(name)
            this.heldInputs.remove(freq)
            if(!this.activeSignals.isEmpty()) {
                let signal = this.activeSignals.removeFrequency(freq)
                if(signal) {
                    if(this.heldInputs.getSize() > this.activeSignals.getSize()) {
                        let found = false
                        this.heldInputs.forEach((item: number) => {
                            if(!this.activeSignals.has(item) && !found) {
                                signal.move(item, this.ampEnvelope, this.filterEnvelope)
                                this.activeSignals.push(signal)
                                found = true
                            }
                        })
                    } else {
                        signal.stop(this.ampEnvelope, this.filterEnvelope)
                        this.availableSignals.push(signal)
                    }
                }
            }
        }
    }

    //Debug method - return sum of base and output latencies
    get latency(): number {
        return this.context.baseLatency + this.context.outputLatency
    }

    createSignals() {
        this.activeSignals = new SignalQueue(this.signalCapacity)
        this.availableSignals = new LinkedQueue<Signal>()

        for(let i = 0; i < this.signalCapacity; i++) {
            let signal = new Signal(this.context)
            signal.connect(this.globalChain.first())
            this.availableSignals.push(signal)
        }
    }

    clearAllSignals() {
        this.activeSignals.forEach((signal: Signal) => {
            signal.destroy()
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.destroy()
        })

        this.activeSignals = null
        this.availableSignals = null
    }

    //Oscillator methods
    setWaveTypeA(type: string) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setWaveform(<OscillatorType>type)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setWaveform(<OscillatorType>type)
        })
    }

    setWaveTypeB(type: string) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorB().setWaveform(<OscillatorType>type)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorB().setWaveform(<OscillatorType>type)
        })
    }

    setAmplitudeA(value: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setGain(value)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setGain(value)
        })
    }

    setAmplitudeB(value: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorB().setGain(value)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorB().setGain(value)
        })
    }

    setDetuneA(value: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setDetune(value)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setDetune(value)
        })
    }

    setDetuneB(value: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorB().setDetune(value)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorB().setDetune(value)
        })
    }

    //Filter methods
    setFilterTypeA(type: string) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterA().setType(<BiquadFilterType>type)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterA().setType(<BiquadFilterType>type)
        })
    }

    setFilterFrequencyA(freq: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterA().setFrequency(freq)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterA().setFrequency(freq)
        })
    }

    setFilterEnvFrequencyA(freq: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterA().setEnvFrequency(freq)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterA().setEnvFrequency(freq)
        })
    }

    setFilterQA(q: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterA().setQ(q)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterA().setQ(q)
        })
    }

    setFilterTypeB(type: string) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterB().setType(<BiquadFilterType>type)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterB().setType(<BiquadFilterType>type)
        })
    }

    setFilterFrequencyB(freq: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterB().setFrequency(freq)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterB().setFrequency(freq)
        })
    }

    setFilterEnvFrequencyB(freq: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterB().setEnvFrequency(freq)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterB().setEnvFrequency(freq)
        })
    }

    setFilterQB(q: number) {
        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterB().setQ(q)
        })
        this.availableSignals.forEach((signal: Signal) => {
            signal.getFilterB().setQ(q)
        })
    }

    setSignalCapacity(capacity: number) {
        if(this.signalCapacity != capacity) {
            this.clearAllSignals()
            this.signalCapacity = capacity
            this.createSignals()
        }
    }
    
    //Sets the master volume of the synth
    setMasterVolume(value: number) {
        const mainGain = <GainNode>this.globalChain.last()
        mainGain.gain.value = value / 100.0
    }

    //Sets amplitude envelope parameters
    setAmpEnvelope(name: string, value: number) {
        switch(name) {
            case "amp-attack-input":
                this.ampEnvelope.attack = value / 100.0
                break
            case "amp-decay-input":
                this.ampEnvelope.decay = value / 25.0
                break
            case "amp-sustain-input":
                this.ampEnvelope.sustain = value / 100.0
                break
            case "amp-release-input":
                this.ampEnvelope.release = value / 25.0
                break
        }
    }

    //Sets filter envelope parameters
    setFilterEnvelope(name: string, value: number) {
        switch(name) {
            case "filter-attack-input":
                this.filterEnvelope.attack = value / 100.0
                break
            case "filter-decay-input":
                this.filterEnvelope.decay = value / 25.0
                break
            case "filter-sustain-input":
                this.filterEnvelope.sustain = value / 100.0
                break
            case "filter-release-input":
                this.filterEnvelope.release = value / 25.0
                break
        }
    }
}