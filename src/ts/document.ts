import { Synth } from './Synth.js'

const registerUIElement = (element: Element, event: string, listener: (e: Event) => void) => {
    element.addEventListener(event, listener)
}

const documentInit = (synth: Synth) => {

    const onAllowAudio = (e: any) => {
        if(synth.context.state === 'suspended') {
            synth.context.resume()
            synth.init()
        }
    }

    const onMasterVolumeChange = (e: any) => {
        console.log(e.currentTarget.value / 100.0)
        const mainGain = <GainNode>synth.globalChain.last()
        mainGain.gain.value = e.currentTarget.value / 100.0
    }

    const allowAudioElement = document.querySelector('button[name="allow-audio"]')
    const masterVolumeElement = document.querySelector('input[name="master-volume"]')

    registerUIElement(allowAudioElement, 'click', onAllowAudio)
    registerUIElement(masterVolumeElement, 'input', onMasterVolumeChange)
}

export { documentInit }