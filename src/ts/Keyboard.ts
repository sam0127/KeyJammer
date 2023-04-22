import { Synth } from './Synth'

/*
Keyboard Class

This class handles all input from the user's (computer) keyboard, it has:
A pressedKeys set, containing all keyboard keys that the user is currently pressing,
a droneKeys set, a set containing keys that are sustained via drone AKA Caps Lock,
a sustainKeys set, a set containing keys that are sustained via sustain input AKA Shift or Space,
a bindingMap, a map holding the binding of keyboard keys to MIDI notes, TODO: add key mapping customization,
a controlsKets set, containing the keyboard key codes that are used NOT used for playing notes AKA sustain and drone controls,
a drone boolean variable, whether drone record is on,
a sustain boolean variable, whether the sustain signal is active
*/ 
export class Keyboard {
    pressedKeys: Set<string> = new Set()
    droneKeys: Set<string> = new Set()
    sustainKeys: Set<string> = new Set()
    readonly bindingMap: Map<string, string>
    readonly controlKeys: Set<string>
    drone: boolean = false
    sustain: boolean = false

    constructor(bindingMap: Map<string, string>, controlKeys: Set<string>) {
        this.bindingMap = bindingMap
        this.controlKeys = controlKeys
    }

    private isSustainKey(key: string) {
        return key === "Space"
            || key === "ShiftLeft"
            || key === "ShiftRight"
    }

    private onControlInput(synth: Synth, key: string, keydown: boolean) {
        if(keydown) {
            if(key === "CapsLock") {
                this.drone = !this.drone
                if(this.drone) {
                    this.sustainKeys.forEach((sustainedKey) => {
                        this.droneKeys.add(sustainedKey)
                    })

                }
            } else if(this.isSustainKey(key)) {
                this.sustain = true
            } else if(key === "Escape") {
                this.clearAllNotes(synth)
            }
        } else {
            if(this.isSustainKey(key)) {
                this.sustain = false

                this.sustainKeys.forEach((sustainedKey) => {
                    if(!this.droneKeys.has(sustainedKey)) {
                        synth.triggerNoteStop(this.bindingMap.get(sustainedKey))
                    }
                })

                this.sustainKeys.clear()
            }
        }
    }

    init(synth: Synth) {
        document.addEventListener("keydown", (e: any) => {
            if(!this.pressedKeys.has(e.code)) {
                this.pressedKeys.add(e.code)
                
                //pressed key is a note key
                if(this.bindingMap.has(e.code)) {
                    //console.log("note start")
                    synth.triggerNoteStart(this.bindingMap.get(e.code))
                } else if(this.controlKeys.has(e.code)) { //pressed key is a control key
                    this.onControlInput(synth, e.code, true)
                }
            }
        })

        document.addEventListener("keyup", (e: any) => {
            this.pressedKeys.delete(e.code)

            //Released key is a note key
            if(this.bindingMap.has(e.code)) {
                if(this.drone) {
                    this.droneKeys.add(e.code)
                } else if(this.sustain) {
                    this.sustainKeys.add(e.code)
                } else if(!this.droneKeys.has(e.code)){
                    synth.triggerNoteStop(this.bindingMap.get(e.code))
                }
            } else if(this.controlKeys.has(e.code)) { //Released key is a control key
                this.onControlInput(synth, e.code, false)
            }
        })
    }

    clearAllNotes(synth: Synth) {
        console.log("Clearing all notes:")
        console.log("Pressed Keys -")
        this.pressedKeys.forEach((key) => {
            if(this.bindingMap.has(key)) {
                console.log(key)
                synth.triggerNoteStop(this.bindingMap.get(key))
            }
        })
        console.log("Sustained Keys -")
        this.sustainKeys.forEach((key) => {
            if(this.bindingMap.has(key)) {
                console.log(key)
                synth.triggerNoteStop(this.bindingMap.get(key))
            }
        })
        console.log("Drone Keys -")
        this.droneKeys.forEach((key) => {
            if(this.bindingMap.has(key)) {
                console.log(key)
                synth.triggerNoteStop(this.bindingMap.get(key))
            }
        })

        this.pressedKeys.clear()
        this.sustainKeys.clear()
        this.droneKeys.clear()
    }
}