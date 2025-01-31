import { Envelope } from './Envelope.js'
import { FilterSettings } from './FilterSettings.js'
import { Note } from './Note.js'
import { NodeChain } from './NodeChain.js'
import { SignalCollection } from './SignalCollection.js'
import { Signal } from './Signal.js'
import { LinkedStack } from './LinkedStack.js'

export class InputController {
    context: AudioContext
    notes: Map<string, Note>
    ampEnvelope: Envelope
    filterEnvelope: Envelope
    filter: FilterSettings
    globalChain: NodeChain
    tuningSystem: Map<string, number>
    octaveOffset: number = 0
    isMonophonic: boolean = false
    activeSignals: SignalCollection
    availableSignals: LinkedStack<Signal>
    heldInputs: LinkedStack<number>

    signalCapacity: number

    readonly waveTypes: Array<string> = [
        'sine',
        'square',
        'sawtooth',
        'triangle'
    ]

    //if you add more filters, be sure to update document listener and preset logic for filters
    readonly filterTypes: Array<string> = [
        'lowpass',
        'highpass'
    ]

    constructor(tuningSystem: Map<string, number>) {
        this.context = new AudioContext()
        this.context.suspend()
        this.ampEnvelope = new Envelope(1, 1, 1, 0.05)
        this.filterEnvelope = new Envelope(1, 1, 1, 0.05)
        this.filter = new FilterSettings('lowpass', 0.75, 3, 6)
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
        //this.notes = new Map<string, Note>()

        //NEW
        this.signalCapacity = 8
        this.createSignals()

        this.heldInputs = new LinkedStack<number>()

        ///
    }

    //NEW

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

            //console.log("AVAILABLE SIGNALS: " + this.availableSignals.toString())
            
            //console.log("ACTIVE SIGNALS: " + this.activeSignals.toString())
            //console.log("HELD INPUTS: " + this.heldInputs.toString())
            //console.log("================================================================")
        }
    }

    stopSignal(name: string) {
        if(this.tuningSystem.has(name)) {
            let freq = this.tuningSystem.get(name)
            this.heldInputs.remove(freq)
            if(!this.activeSignals.isEmpty()) {
                let signal = this.activeSignals.remove(freq)

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
                        //signal.baseFrequency = 0
                        signal.stop(freq, this.ampEnvelope, this.filterEnvelope)
                        this.availableSignals.push(signal)
                    }
                }
            }


            //console.log("ACTIVE SIGNALS: " + this.activeSignals.toString())
            //console.log("HELD INPUTS: " + this.heldInputs.toString())
            //console.log("================================================================")
        }
    }


    /*
    //init sub-method - create one playable note, assign to it a keyboard Key
    private createNote(value: number, key: string) {
        const note = new Note(this.context, value)
        note.connect(this.globalChain.first())
        note.init()
        this.notes.set(key, note)
    }
        */


    //Debug method - return sum of base and output latencies
    get latency(): number {
        return this.context.baseLatency + this.context.outputLatency
    }

    /*
    //init method - create each playable note
    init() {
        
        if(this.isMonophonic) {
            this.createNote(0, "M")
        } else {
            this.tuningSystem.forEach((value, key) => {
                this.createNote(value, key)
            })
        }
            
    }
    */

    createSignals() {
        this.activeSignals = new SignalCollection(this.signalCapacity)
        this.availableSignals = new LinkedStack<Signal>()

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

    //Update all notes to a wave type
    setWaveType(type: number) {
        /*
        this.notes.forEach((value: Note, key: string) => {
            value.oscillator.type = <OscillatorType>this.waveTypes[type]
        })
            */

        this.activeSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setWaveform(<OscillatorType>this.waveTypes[type])
            signal.getOscillatorB().setWaveform(<OscillatorType>this.waveTypes[type])
        })

        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setWaveform(<OscillatorType>this.waveTypes[type])
            signal.getOscillatorB().setWaveform(<OscillatorType>this.waveTypes[type])
        })
    }

    setSignalCapacity(capacity: number) {
        this.clearAllSignals()
        this.signalCapacity = capacity
        this.createSignals()
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
                this.ampEnvelope.decay = value / 100.0
                break
            case "amp-sustain-input":
                this.ampEnvelope.sustain = value / 100.0
                break
            case "amp-release-input":
                this.ampEnvelope.release = value / 100.0
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
                this.filterEnvelope.decay = value / 100.0
                break
            case "filter-sustain-input":
                this.filterEnvelope.sustain = value / 100.0
                break
            case "filter-release-input":
                this.filterEnvelope.release = value / 100.0
                break
        }
    }

    //Sets filter type
    setFilterType(value: number) {
        this.filter.type = this.filterTypes[value]
    }

    //Updates synth filter cutoff and all notes' filter cutoffs
    setFilterCutoff(factor: number) {
        /*
        this.filter.cutoff = factor
        this.notes.forEach((value: Note, key: string) => {
            value.filter.frequency.setValueAtTime(value.frequency * this.filter.cutoff, this.context.currentTime)
        })

        this.activeSignals.forEach((signal: Signal) => {
            signal.getFilterA().getFrequencyParam.setValue
        })

        this.availableSignals.forEach((signal: Signal) => {
            signal.getOscillatorA().setWaveform(<OscillatorType>this.waveTypes[type])
        })
            */
    }

    //Sets synth filter envelope cutoff
    setFilterEnvCutoff(factor: number) {
        this.filter.envFrequency = factor
    }

    //Sets synth filter resonance
    setFilterResonance(value: number) {
        /*
        this.filter.resonance = value
        this.notes.forEach((val: Note, key: string) => {
            val.filter.Q.value = this.filter.resonance
        })
            */
    }

    //Sets synth octave offset
    setOctaveOffset(offset: number) {
        this.octaveOffset = offset
    }

    destroyNotes() {
        this.notes.forEach((value: Note, key: String) => {
            value.destroy()
        })
        this.notes.clear()
    }

    /*
    setMonophonic() {
        this.destroyNotes()
        this.createNote(0, "M")
        this.isMonophonic = true
    }

    setPolyphonic() {
        this.destroyNotes()
        this.tuningSystem.forEach((value, key) => {
            this.createNote(value, key)
        })
        this.isMonophonic = false
    }
        */
}