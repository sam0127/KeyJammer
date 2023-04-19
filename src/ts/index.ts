import { Synth } from './Synth.js'
import { Keyboard } from './Keyboard.js'

import { documentInit } from './document.js'

//KeyToNoteMap: Map containing key bindings to note names, 'KeyCode': frequencyHz
const keyToNoteMap: Map<string, string> = new Map()
keyToNoteMap.set('KeyQ', 'C2')
keyToNoteMap.set('Digit2', 'C#2')
keyToNoteMap.set('KeyW', 'D2')
keyToNoteMap.set('Digit3', 'D#2')
keyToNoteMap.set('KeyE', 'E2')
keyToNoteMap.set('KeyR', 'F2')
keyToNoteMap.set('Digit5', 'F#2')
keyToNoteMap.set('KeyT', 'G2')
keyToNoteMap.set('Digit6', 'G#2')
keyToNoteMap.set('KeyY', 'A2')
keyToNoteMap.set('Digit7', 'A#2')
keyToNoteMap.set('KeyU', 'B2')
keyToNoteMap.set('KeyI', 'C3')
keyToNoteMap.set('Digit9', 'C#3')
keyToNoteMap.set('KeyO', 'D3')
keyToNoteMap.set('Digit0', 'D#3')
keyToNoteMap.set('KeyP', 'E3')
keyToNoteMap.set('BracketLeft', 'F3')
keyToNoteMap.set('Equal', 'F#3')
keyToNoteMap.set('BracketRight', 'G3')
keyToNoteMap.set('KeyA', 'G#3')
keyToNoteMap.set('KeyZ', 'A3')
keyToNoteMap.set('KeyS', 'A#3')
keyToNoteMap.set('KeyX', 'B3')
keyToNoteMap.set('KeyC', 'C4')
keyToNoteMap.set('KeyF', 'C#4')
keyToNoteMap.set('KeyV', 'D4')
keyToNoteMap.set('KeyG', 'D#4')
keyToNoteMap.set('KeyB', 'E4')
keyToNoteMap.set('KeyN', 'F4')
keyToNoteMap.set('KeyJ', 'F#4')
keyToNoteMap.set('KeyM', 'G4')
keyToNoteMap.set('KeyK', 'G#4')
keyToNoteMap.set('Comma', 'A4')
keyToNoteMap.set('KeyL', 'A#4')
keyToNoteMap.set('Period', 'B4')
keyToNoteMap.set('Slash', 'C5')

const controlKeySet: Set<string> = new Set()
controlKeySet.add('Space')
controlKeySet.add('ShiftLeft')
controlKeySet.add('ShiftRight')
controlKeySet.add('CapsLock')
controlKeySet.add('Escape')

//NoteToFrequencyMap: Map representing the tuning system, 'note-name': 'frequencyHz'
const noteToFrequencyMap: Map<string, number> = new Map()
noteToFrequencyMap.set('C2', 65.41)
noteToFrequencyMap.set('C#2', 69.30)
noteToFrequencyMap.set('D2', 73.42)
noteToFrequencyMap.set('D#2', 77.78)
noteToFrequencyMap.set('E2', 82.41)
noteToFrequencyMap.set('F2', 87.31)
noteToFrequencyMap.set('F#2', 92.50)
noteToFrequencyMap.set('G2', 98.00)
noteToFrequencyMap.set('G#2', 103.83)
noteToFrequencyMap.set('A2', 110.00)
noteToFrequencyMap.set('A#2', 116.54)
noteToFrequencyMap.set('B2', 123.47)
noteToFrequencyMap.set('C3', 130.81)
noteToFrequencyMap.set('C#3', 138.59)
noteToFrequencyMap.set('D3', 146.83)
noteToFrequencyMap.set('D#3', 155.56)
noteToFrequencyMap.set('E3', 164.81)
noteToFrequencyMap.set('F3', 174.61)
noteToFrequencyMap.set('F#3', 185.00)
noteToFrequencyMap.set('G3', 196.00)
noteToFrequencyMap.set('G#3', 207.65)
noteToFrequencyMap.set('A3', 220.00)
noteToFrequencyMap.set('A#3', 233.08)
noteToFrequencyMap.set('B3', 246.94)
noteToFrequencyMap.set('C4', 261.63)
noteToFrequencyMap.set('C#4', 277.18)
noteToFrequencyMap.set('D4', 293.66)
noteToFrequencyMap.set('D#4', 311.13)
noteToFrequencyMap.set('E4', 329.63)
noteToFrequencyMap.set('F4', 349.23)
noteToFrequencyMap.set('F#4', 369.99)
noteToFrequencyMap.set('G4', 392.00)
noteToFrequencyMap.set('G#4', 415.30)
noteToFrequencyMap.set('A4', 440.00)
noteToFrequencyMap.set('A#4', 466.16)
noteToFrequencyMap.set('B4', 493.88)
noteToFrequencyMap.set('C5', 523.25)

const keyboard = new Keyboard(keyToNoteMap, controlKeySet)
const synth = new Synth(noteToFrequencyMap)

document.addEventListener('DOMContentLoaded', () => {
    documentInit(synth, keyboard)
})