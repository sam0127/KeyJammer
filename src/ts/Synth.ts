import { Envelope } from './Envelope.js'
import { Filter } from './Filter.js'
import { Note } from './Note.js'
import { NodeChain } from './NodeChain.js'

export class Synth {
    context: AudioContext
    notes: Map<string, Note>
    ampEnvelope: Envelope
    filterEnvelope: Envelope
    filter: Filter
    globalChain: NodeChain
    tuningSystem: Map<string, number>
    waveType: string
    readonly waveTypes: Array<string> = [
        'sine',
        'square',
        'sawtooth',
        'triangle',
        'custom'
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

        this.waveType = "sine"
    }

    private createNote(value: number, key: string) {
        const note = new Note(this.context, value)
        note.connect(this.globalChain.first())
        note.init()
        this.notes.set(key, note)
    }

    get latency(): number {
        return this.context.baseLatency + this.context.outputLatency
    }

    init() {
        this.tuningSystem.forEach((value, key) => {
            this.createNote(value, key)
        })
    }

    triggerNoteStart(name: string) {
        let note: Note = this.notes.get(name)
        const startTime: number = this.context.currentTime
        note.gain.gain.cancelScheduledValues(startTime)
        note.gain.gain.setValueAtTime(0, startTime)
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

    triggerNoteStop(name: string) {
        let note: Note = this.notes.get(name)
        const startTime: number = this.context.currentTime
        note.gain.gain.cancelScheduledValues(startTime)
        note.gain.gain.setValueAtTime(note.gain.gain.value, startTime)
        note.gain.gain.linearRampToValueAtTime(0, startTime + this.ampEnvelope.release)

        note.filter.frequency.cancelScheduledValues(startTime)
        note.filter.frequency.setValueAtTime(note.filter.frequency.value, startTime)
        note.filter.frequency.linearRampToValueAtTime(this.filter.cutoff * note.frequency, startTime + this.filterEnvelope.release)
    }

    updateWaveType(type: number) {
        if(this.waveTypes[type] !== 'custom') {
            this.notes.forEach((value: Note, key: string) => {
                value.oscillator.type = <OscillatorType>this.waveTypes[type]
            })
        }
    }

    updateMasterVolume(value: number) {
        const mainGain = <GainNode>this.globalChain.last()
        mainGain.gain.value = value / 100.0
    }

    updateAmpEnvelope(name: string, value: number) {
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

    updateFilterEnvelope(name: string, value: number) {
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

    updateFilterType(type: string) {
        this.filter.type = type
    }

    updateFilterCutoff(factor: number) {
        this.filter.cutoff = factor
        this.notes.forEach((value: Note, key: string) => {
            value.filter.frequency.setValueAtTime(value.frequency * this.filter.cutoff, this.context.currentTime)
        })
    }

    updateFilterEnvCutoff(factor: number) {
        this.filter.envCutoff = factor
    }

    updateFilterResonance(value: number) {
        this.filter.resonance = value
        this.notes.forEach((val: Note, key: string) => {
            val.filter.Q.value = this.filter.resonance
        })
    }
}