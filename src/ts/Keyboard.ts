import { InputController } from './InputController'

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
    readonly bindingMap: Map<string, string>

    constructor(bindingMap: Map<string, string>) {
        this.bindingMap = bindingMap
    }

    //Initialize Keyboard listeners, conditionally trigger synth notes
    init(inputController: InputController) {
        document.addEventListener("keydown", (e: any) => {
            if(!this.pressedKeys.has(e.code)) {
                this.pressedKeys.add(e.code)
                if(this.bindingMap.has(e.code)) {
                    inputController.startSignal(this.bindingMap.get(e.code))
                }
            }
        })

        document.addEventListener("keyup", (e: any) => {
            this.pressedKeys.delete(e.code)
            if(this.bindingMap.has(e.code)) {
                inputController.stopSignal(this.bindingMap.get(e.code))
            }
        })
    }
}