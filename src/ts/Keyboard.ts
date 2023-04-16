import { Synth } from './Synth'

export class Keyboard {
    pressedKeys: Set<string> = new Set()
    bindingMap: Map<string, string>

    constructor(bindingMap: Map<string, string>) {
        this.bindingMap = bindingMap
    }

    init(synth: Synth) {
        document.addEventListener("keydown", (e: any) => {
            if(!this.pressedKeys.has(e.code)) {
                this.pressedKeys.add(e.code)

                if(this.bindingMap.has(e.code)) {
                    synth.triggerNoteStart(this.bindingMap.get(e.code))
                }
            }
        })

        document.addEventListener("keyup", (e: any) => {
            this.pressedKeys.delete(e.code)

            if(this.bindingMap.has(e.code)) {
                synth.triggerNoteStop(this.bindingMap.get(e.code))
            }
        })
    }
}