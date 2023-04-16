import { Envelope } from './Envelope.js'
import { Note } from './Note.js'
import { NodeChain } from './NodeChain.js'

export class Synth {
    context: AudioContext
    notes: Map<string, Note>
    ampEnvelope: Envelope
    filterEnvelope: Envelope
    globalChain: NodeChain
    tuningSystem: Map<string, number>

    constructor(tuningSystem: Map<string, number>) {
        this.context = new AudioContext()
        this.ampEnvelope = new Envelope(0,0,0,0)
        this.filterEnvelope = new Envelope(0,0,0,0)
        this.globalChain = new NodeChain([
            this.context.createGain()
        ])
        this.tuningSystem = tuningSystem

        this.globalChain.last().connect(this.context.destination)
        const mainGain = <GainNode>this.globalChain.last()
        mainGain.gain.value = 0.125
        this.notes = new Map<string, Note>()
    }

    private createNote(value: number, key: string, map: Map<string, number>) {
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
            const note = new Note(this.context, value)
            note.connect(this.globalChain.first())
            note.init()
            this.notes.set(key, note)
        })
    }

    triggerNoteStart(name: string) {
        this.notes.get(name).gain.gain.value = 1
    }

    triggerNoteStop(name: string) {
        this.notes.get(name).gain.gain.value = 0;
    }


}