import { Synth } from './Synth.js'
import { interfaceInit } from './interface.js'

const synth = new Synth()

console.log(synth.context.state)
console.log(synth.latency)

synth.initNotes()
interfaceInit(synth)