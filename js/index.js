import { Synth } from './Synth.js';
import { Keyboard } from './Keyboard.js';
import { documentInit } from './document.js';
//KeyToNoteMap: Map containing key bindings to note names, 'KeyCode': 'notename'
const keyToNoteMap = new Map();
/*
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
keyToNoteMap.set('Quote', 'C#5')
*/
keyToNoteMap.set('KeyZ', 'C2');
keyToNoteMap.set('KeyS', 'C#2');
keyToNoteMap.set('KeyX', 'D2');
keyToNoteMap.set('KeyD', 'D#2');
keyToNoteMap.set('KeyC', 'E2');
keyToNoteMap.set('KeyV', 'F2');
keyToNoteMap.set('KeyG', 'F#2');
keyToNoteMap.set('KeyB', 'G2');
keyToNoteMap.set('KeyH', 'G#2');
keyToNoteMap.set('KeyN', 'A2');
keyToNoteMap.set('KeyJ', 'A#2');
keyToNoteMap.set('KeyM', 'B2');
keyToNoteMap.set('Comma', 'C3');
keyToNoteMap.set('KeyL', 'C#3');
keyToNoteMap.set('Period', 'D3');
keyToNoteMap.set('Semicolon', 'D#3');
keyToNoteMap.set('Slash', 'E3');
keyToNoteMap.set('KeyQ', 'F3');
keyToNoteMap.set('Digit2', 'F#3');
keyToNoteMap.set('KeyW', 'G3');
keyToNoteMap.set('Digit3', 'G#3');
keyToNoteMap.set('KeyE', 'A3');
keyToNoteMap.set('Digit4', 'A#3');
keyToNoteMap.set('KeyR', 'B3');
keyToNoteMap.set('KeyT', 'C4');
keyToNoteMap.set('Digit6', 'C#4');
keyToNoteMap.set('KeyY', 'D4');
keyToNoteMap.set('Digit7', 'D#4');
keyToNoteMap.set('KeyU', 'E4');
keyToNoteMap.set('KeyI', 'F4');
keyToNoteMap.set('Digit9', 'F#4');
keyToNoteMap.set('KeyO', 'G4');
keyToNoteMap.set('Digit0', 'G#4');
keyToNoteMap.set('KeyP', 'A4');
keyToNoteMap.set('Minus', 'A#4');
keyToNoteMap.set('BracketLeft', 'B4');
keyToNoteMap.set('BracketRight', 'C5');
//keyToNoteMap.set('Quote', 'C#5')
const controlKeySet = new Set();
controlKeySet.add('Space');
controlKeySet.add('ShiftLeft');
controlKeySet.add('ShiftRight');
controlKeySet.add('CapsLock');
controlKeySet.add('Escape');
//NoteToFrequencyMap: Map representing the tuning system, 'note-name': 'frequencyHz'
const noteToFrequencyMap = new Map();
noteToFrequencyMap.set('A0', 27.50);
noteToFrequencyMap.set('A#0', 29.14);
noteToFrequencyMap.set('B0', 30.87);
noteToFrequencyMap.set('C1', 32.70);
noteToFrequencyMap.set('C#1', 34.65);
noteToFrequencyMap.set('D1', 36.71);
noteToFrequencyMap.set('D#1', 38.89);
noteToFrequencyMap.set('E1', 41.20);
noteToFrequencyMap.set('F1', 43.65);
noteToFrequencyMap.set('F#1', 46.25);
noteToFrequencyMap.set('G1', 49.00);
noteToFrequencyMap.set('G#1', 51.91);
noteToFrequencyMap.set('A1', 55.00);
noteToFrequencyMap.set('A#1', 58.27);
noteToFrequencyMap.set('B1', 61.74);
noteToFrequencyMap.set('C2', 65.41);
noteToFrequencyMap.set('C#2', 69.30);
noteToFrequencyMap.set('D2', 73.42);
noteToFrequencyMap.set('D#2', 77.78);
noteToFrequencyMap.set('E2', 82.41);
noteToFrequencyMap.set('F2', 87.31);
noteToFrequencyMap.set('F#2', 92.50);
noteToFrequencyMap.set('G2', 98.00);
noteToFrequencyMap.set('G#2', 103.83);
noteToFrequencyMap.set('A2', 110.00);
noteToFrequencyMap.set('A#2', 116.54);
noteToFrequencyMap.set('B2', 123.47);
noteToFrequencyMap.set('C3', 130.81);
noteToFrequencyMap.set('C#3', 138.59);
noteToFrequencyMap.set('D3', 146.83);
noteToFrequencyMap.set('D#3', 155.56);
noteToFrequencyMap.set('E3', 164.81);
noteToFrequencyMap.set('F3', 174.61);
noteToFrequencyMap.set('F#3', 185.00);
noteToFrequencyMap.set('G3', 196.00);
noteToFrequencyMap.set('G#3', 207.65);
noteToFrequencyMap.set('A3', 220.00);
noteToFrequencyMap.set('A#3', 233.08);
noteToFrequencyMap.set('B3', 246.94);
noteToFrequencyMap.set('C4', 261.63);
noteToFrequencyMap.set('C#4', 277.18);
noteToFrequencyMap.set('D4', 293.66);
noteToFrequencyMap.set('D#4', 311.13);
noteToFrequencyMap.set('E4', 329.63);
noteToFrequencyMap.set('F4', 349.23);
noteToFrequencyMap.set('F#4', 369.99);
noteToFrequencyMap.set('G4', 392.00);
noteToFrequencyMap.set('G#4', 415.30);
noteToFrequencyMap.set('A4', 440.00);
noteToFrequencyMap.set('A#4', 466.16);
noteToFrequencyMap.set('B4', 493.88);
noteToFrequencyMap.set('C5', 523.25);
noteToFrequencyMap.set('C#5', 554.37);
noteToFrequencyMap.set('D5', 587.33);
noteToFrequencyMap.set('D#5', 622.25);
noteToFrequencyMap.set('E5', 659.26);
noteToFrequencyMap.set('F5', 698.46);
noteToFrequencyMap.set('F#5', 739.99);
noteToFrequencyMap.set('G5', 783.99);
noteToFrequencyMap.set('G#5', 830.61);
noteToFrequencyMap.set('A5', 880.00);
noteToFrequencyMap.set('A#5', 932.33);
noteToFrequencyMap.set('B5', 987.77);
noteToFrequencyMap.set('C6', 1046.50);
noteToFrequencyMap.set('C#6', 1108.73);
noteToFrequencyMap.set('D6', 1174.66);
noteToFrequencyMap.set('D#6', 1244.51);
noteToFrequencyMap.set('E6', 1318.51);
noteToFrequencyMap.set('F6', 1396.91);
noteToFrequencyMap.set('F#6', 1479.98);
noteToFrequencyMap.set('G6', 1567.98);
noteToFrequencyMap.set('G#6', 1661.22);
noteToFrequencyMap.set('A6', 1760.00);
noteToFrequencyMap.set('A#6', 1864.66);
noteToFrequencyMap.set('B6', 1975.53);
noteToFrequencyMap.set('C7', 2093.00);
const keyboard = new Keyboard(keyToNoteMap, controlKeySet);
const synth = new Synth(noteToFrequencyMap);
document.addEventListener('DOMContentLoaded', () => {
    documentInit(synth, keyboard);
});