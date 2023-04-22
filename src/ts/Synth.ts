import { Envelope } from './Envelope.js'
import { Filter } from './Filter.js'
import { Note } from './Note.js'
import { NodeChain } from './NodeChain.js'

/*
Synth class

The primary class for this project, has:

A context type AudioContext, the root of all audio functionality,
a notes Map, to hold all possible notes playable by the synth,
an Amplitude Envelope, which describes how a note's amplitude behaves over time,
a Filter Envelope, which describes how a note's filter's cutoff behaves over time,
a Filter, a class which contains basic synth filter properties like cutoff, envelope cutoff, and resonance,
a global NodeChain, a chain of AudioNodes that all signals are connected to,
a tuningSystem, a map of MIDI note names to frequencies, as of now, the set of equal temperament frequencies,
an octaveOffset number, an integer which represents how many octaves the keyboard is offset by,
and
an array of waveTypes, containing all the possible wave types. TODO Custom waveType,
an array of filterTypes, containing all the possible filter types. TODO highpass and more
*/
export class Synth {
    context: AudioContext
    notes: Map<string, Note>
    ampEnvelope: Envelope
    filterEnvelope: Envelope
    filter: Filter
    globalChain: NodeChain
    tuningSystem: Map<string, number>
    octaveOffset: number = 0

    readonly waveTypes: Array<string> = [
        'sine',
        'square',
        'sawtooth',
        'triangle',
        'custom'
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
        this.filter = new Filter('lowpass', 0.75, 3, 6)
        this.globalChain = new NodeChain([
            this.context.createGain(),
            this.context.createAnalyser(),
            this.context.createGain()
        ])
        this.tuningSystem = tuningSystem

        this.globalChain.last().connect(this.context.destination)
        const mainGain = <GainNode>this.globalChain.first()
        const volumeGain = <GainNode>this.globalChain.last()
        mainGain.gain.value = 0.25
        volumeGain.gain.value = 0.5
        this.notes = new Map<string, Note>()
    }

    //init sub-method - create one playable note, assign to it a keyboard Key
    private createNote(value: number, key: string) {
        const note = new Note(this.context, value)
        note.connect(this.globalChain.first())
        note.init()
        this.notes.set(key, note)
    }


    //Debug method - return sum of base and output latencies
    get latency(): number {
        return this.context.baseLatency + this.context.outputLatency
    }

    //init method - create each playable note
    init() {
        this.tuningSystem.forEach((value, key) => {
            this.createNote(value, key)
        })
    }

    //Start playing a note - if the note is playable, start attack -> decay -> release sequence
    triggerNoteStart(name: string) {
        name = name.substring(0,name.length-1) + (parseInt(name[name.length-1]) + this.octaveOffset)
        let note: Note = this.notes.has(name) ? this.notes.get(name) : null

        if(note !== null) {
            const startTime: number = this.context.currentTime
            note.gain.gain.cancelScheduledValues(startTime)
            note.gain.gain.setValueAtTime(note.gain.gain.value, startTime)
            note.gain.gain.linearRampToValueAtTime(1.0, startTime + this.ampEnvelope.attack)
            note.gain.gain.linearRampToValueAtTime(this.ampEnvelope.sustain, startTime + this.ampEnvelope.attack + this.ampEnvelope.decay)
    
            note.filter.Q.value = this.filter.resonance
            note.filter.frequency.cancelScheduledValues(startTime)
            note.filter.frequency.setValueAtTime(this.filter.cutoff * note.frequency, startTime)
    
            note.filter.frequency.linearRampToValueAtTime(
                (this.filter.cutoff + this.filter.envCutoff) * note.frequency,
                startTime + this.filterEnvelope.attack
                )
            note.filter.frequency.linearRampToValueAtTime(
                (this.filter.cutoff + this.filterEnvelope.sustain * this.filter.envCutoff) * note.frequency,
                startTime + this.filterEnvelope.attack + this.filterEnvelope.decay)
        }
    }

    //Stop playing a note - if the note is playable, start sustain -> release -> stop sequence
    triggerNoteStop(name: string) {
        name = name.substring(0,name.length-1) + (parseInt(name[name.length-1]) + this.octaveOffset)
        let note: Note = this.notes.has(name) ? this.notes.get(name) : null

        if(note != null) {
            const startTime: number = this.context.currentTime
            note.gain.gain.cancelScheduledValues(startTime)
            note.gain.gain.setValueAtTime(note.gain.gain.value, startTime)
            note.gain.gain.linearRampToValueAtTime(0, startTime + this.ampEnvelope.release)
    
            note.filter.frequency.cancelScheduledValues(startTime)
            note.filter.frequency.setValueAtTime(note.filter.frequency.value, startTime)
            note.filter.frequency.linearRampToValueAtTime(this.filter.cutoff * note.frequency, startTime + this.filterEnvelope.release)
        }
    }

    //Update all notes to a wave type
    setWaveType(type: number) {
        if(this.waveTypes[type] !== 'custom') {
            this.notes.forEach((value: Note, key: string) => {
                value.oscillator.type = <OscillatorType>this.waveTypes[type]
            })
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
        this.filter.cutoff = factor
        this.notes.forEach((value: Note, key: string) => {
            value.filter.frequency.setValueAtTime(value.frequency * this.filter.cutoff, this.context.currentTime)
        })
    }

    //Sets synth filter envelope cutoff
    setFilterEnvCutoff(factor: number) {
        this.filter.envCutoff = factor
    }

    //Sets synth filter resonance
    setFilterResonance(value: number) {
        this.filter.resonance = value
        this.notes.forEach((val: Note, key: string) => {
            val.filter.Q.value = this.filter.resonance
        })
    }

    //Sets synth octave offset
    setOctaveOffset(offset: number) {
        this.octaveOffset = offset
    }
}