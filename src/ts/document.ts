import { Synth } from './Synth.js'
import { Keyboard } from './Keyboard.js'
import { oscilloscopeInit } from './oscilloscope.js'

const registerInputElement = (element: Element, event: string, listener: (e: Event) => void) => {
    element.addEventListener(event, listener)
}

const documentInit = (synth: Synth, keyboard: Keyboard) => {

    const onAllowAudio = (e: any) => {
        if(synth.context.state === 'suspended') {
            console.log("Initializing Audio")

            synth.context.resume()
            synth.init()
            keyboard.init(synth)
            oscilloscopeInit(
                <HTMLCanvasElement>oscilloscopeElement,
                <HTMLCanvasElement>spectrographElement,
                <AnalyserNode>synth.globalChain.get(1)
            )
        }
    }

    const onMasterVolumeChange = (e: any) => {
        const mainGain = <GainNode>synth.globalChain.last()
        mainGain.gain.value = e.currentTarget.value / 100.0
    }

    const allowAudioElement = document.querySelector('button[name="allow-audio"]')
    const masterVolumeElement = document.querySelector('input[name="master-volume"]')
    const oscilloscopeElement = document.getElementById('oscilloscope')
    const spectrographElement = document.getElementById('spectrograph')

    registerInputElement(allowAudioElement, 'click', onAllowAudio)
    registerInputElement(masterVolumeElement, 'input', onMasterVolumeChange)
}

export { documentInit }