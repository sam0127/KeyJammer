import { Envelope } from './Envelope.js'
import { Note } from './Note.js'
import { NodeChain } from './NodeChain.js'

export class Synth {
    context: AudioContext
    notes: Map<string, Note>
    ampEnvelope: Envelope
    filterEnvelope: Envelope
    globalChain: NodeChain

    constructor() {
        this.context = new AudioContext()
        this.ampEnvelope = new Envelope(0,0,0,0)
        this.filterEnvelope = new Envelope(0,0,0,0)
        this.globalChain = new NodeChain([
            this.context.createGain()
        ])

        this.globalChain.last().connect(this.context.destination)
        const mainGain = <GainNode>this.globalChain.last()
        mainGain.gain.value = 0.1
        this.notes = new Map<string, Note>()
    }

    get latency(): Number {
        return this.context.baseLatency + this.context.outputLatency
    }

    initNotes() {
        const note = new Note(this.context, 440)
        note.connect(this.globalChain.first())
        note.init()
        this.notes.set('A4', note)
    }

    playNote() {
        this.notes.get('A4').gain.gain.value = 1
    }


}