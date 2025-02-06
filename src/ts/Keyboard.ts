import { InputController } from './InputController'

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
                    if((<HTMLInputElement>document.activeElement).type !== 'text') {
                        e.stopPropagation()
                        e.preventDefault()
                        inputController.startSignal(this.bindingMap.get(e.code))
                    }
                    
                }
            }
        })

        document.addEventListener("keyup", (e: any) => {
            this.pressedKeys.delete(e.code)
            if(this.bindingMap.has(e.code)) {
                if((<HTMLInputElement>document.activeElement).type !== 'text') {
                    e.stopPropagation()
                    e.preventDefault()
                    inputController.stopSignal(this.bindingMap.get(e.code))
                }
            }
        })
    }

    clearAllKeys() {
        this.pressedKeys.forEach(key => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'code': key}))
        })

        this.pressedKeys.clear()
    }
}