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

    const onMasterVolumeInput = (e: any) => {
        synth.updateMasterVolume(e.currentTarget.value)
    }

    const onSimpleWaveInput = (e: any) => {
        synth.updateWaveType(e.currentTarget.value)
    }

    const onLowPassInput = (e: any) => {
        synth.updateFilterType('lowpass')
    }

    const onHighPassInput = (e: any) => {
        synth.updateFilterType('highpass')
    }

    const onCutoffInput = (e: any) => {
        synth.updateFilterCutoff(parseFloat(e.currentTarget.value))
    }

    const onEnvCutoffInput = (e: any) => {
        synth.updateFilterEnvCutoff(parseFloat(e.currentTarget.value))
    }

    const onResonanceInput = (e: any) => {
        synth.updateFilterResonance(e.currentTarget.value)
    }

    const onAmpEnvelopeInput = (e: any) => {
        synth.updateAmpEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    const onFilterEnvelopeInput = (e: any) => {
        synth.updateFilterEnvelope(e.currentTarget.name, e.currentTarget.value)
    }



    const allowAudioElement = document.querySelector('button[name="allow-audio"]')
    const masterVolumeElement = document.querySelector('input[name="master-volume"]')

    const waveTypeElement = document.querySelector('input[name="wave-input"]')

    const lowPassElement = document.getElementById('low-pass')
    const highPassElement = document.getElementById('high-pass')

    const cutoffElement = document.querySelector('input[name="cutoff"]')
    const envCutoffElement = document.querySelector('input[name="env-cutoff"]')
    const resonanceElement = document.querySelector('input[name="resonance"]')


    const ampAttackElement = document.querySelector('input[name="amp-attack-input"]')
    const ampDecayElement = document.querySelector('input[name="amp-decay-input"]')
    const ampSustainElement = document.querySelector('input[name="amp-sustain-input"]')
    const ampReleaseElement = document.querySelector('input[name="amp-release-input"]')

    const filterAttackElement = document.querySelector('input[name="filter-attack-input"]')
    const filterDecayElement = document.querySelector('input[name="filter-decay-input"]')
    const filterSustainElement = document.querySelector('input[name="filter-sustain-input"]')
    const filterReleaseElement = document.querySelector('input[name="filter-release-input"]')

    const oscilloscopeElement = document.getElementById('oscilloscope')
    const spectrographElement = document.getElementById('spectrograph')

    registerInputElement(allowAudioElement, 'click', onAllowAudio)
    registerInputElement(masterVolumeElement, 'input', onMasterVolumeInput)

    registerInputElement(waveTypeElement, 'input', onSimpleWaveInput)

    registerInputElement(lowPassElement, 'change', onLowPassInput)
    registerInputElement(highPassElement, 'change', onHighPassInput)
    registerInputElement(cutoffElement, 'input', onCutoffInput)
    registerInputElement(envCutoffElement, 'input', onEnvCutoffInput)
    registerInputElement(resonanceElement, 'input', onResonanceInput)

    registerInputElement(ampAttackElement, 'input', onAmpEnvelopeInput)
    registerInputElement(ampDecayElement, 'input', onAmpEnvelopeInput)
    registerInputElement(ampSustainElement, 'input', onAmpEnvelopeInput)
    registerInputElement(ampReleaseElement, 'input', onAmpEnvelopeInput)
    registerInputElement(filterAttackElement, 'input', onFilterEnvelopeInput)
    registerInputElement(filterDecayElement, 'input', onFilterEnvelopeInput)
    registerInputElement(filterSustainElement, 'input', onFilterEnvelopeInput)
    registerInputElement(filterReleaseElement, 'input', onFilterEnvelopeInput)
}

export { documentInit }