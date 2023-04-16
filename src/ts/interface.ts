import { Synth } from './Synth.js'

const registerUIElement = (element: Element, event: string, listener: (e: Event) => void) => {
    element.addEventListener(event, listener)
}

const interfaceInit = (synth: Synth) => {

    const allowAudio = (e: any) => {
        if(synth.context.state === 'suspended') {
            synth.context.resume()
        }
    }

    const allowAudioElement = document.querySelector('button[name=allow-audio]')
    registerUIElement(allowAudioElement, 'click', allowAudio)

    document.addEventListener("keydown", () => {
        console.log("keydown")
        synth.playNote()
    })
}

export { interfaceInit }