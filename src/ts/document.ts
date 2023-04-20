import { Synth } from './Synth.js'
import { Keyboard } from './Keyboard.js'
import { oscilloscopeInit } from './oscilloscope.js'

const registerInputElement = (element: Element, event: string, listener: (e: Event) => void) => {
    element.addEventListener(event, listener)
}

const documentInit = (synth: Synth, keyboard: Keyboard) => {
    //sets default synth properties from DOM
    const setDefaults = (synth: Synth) => {
        synth.setWaveType(parseInt(waveTypeElement.value))
        //synth.setFilterType(lowPassElement.checked ? 'lowpass' : 'highpass')
        synth.setFilterCutoff(parseFloat(cutoffElement.value))
        synth.setFilterEnvCutoff(parseFloat(envCutoffElement.value))
        synth.setFilterResonance(parseInt(resonanceElement.value))
        synth.setAmpEnvelope(ampAttackElement.name, parseInt(ampAttackElement.value))
        synth.setAmpEnvelope(ampDecayElement.name, parseInt(ampDecayElement.value))
        synth.setAmpEnvelope(ampSustainElement.name, parseInt(ampSustainElement.value))
        synth.setAmpEnvelope(ampReleaseElement.name, parseInt(ampReleaseElement.value))
        synth.setFilterEnvelope(filterAttackElement.name, parseInt(filterAttackElement.value))
        synth.setFilterEnvelope(filterDecayElement.name, parseInt(filterDecayElement.value))
        synth.setFilterEnvelope(filterSustainElement.name, parseInt(filterSustainElement.value))
        synth.setFilterEnvelope(filterReleaseElement.name, parseInt(filterReleaseElement.value))
    }

    //User interaction event handlers below
    const onAllowAudio = (e: any) => {
        if(synth.context.state === 'suspended') {
            console.log("Initializing Audio")

            synth.context.resume()
            synth.init()
            setDefaults(synth)
            keyboard.init(synth)
            oscilloscopeInit(
                <HTMLCanvasElement>oscilloscopeElement,
                <HTMLCanvasElement>spectrographElement,
                <AnalyserNode>synth.globalChain.get(1)
            )
        }
    }

    const onMasterVolumeInput = (e: any) => {
        synth.setMasterVolume(e.currentTarget.value)
    }

    const onSimpleWaveInput = (e: any) => {
        synth.setWaveType(e.currentTarget.value)
    }

    const onLowPassInput = (e: any) => {
        synth.setFilterType('lowpass')
    }

    const onHighPassInput = (e: any) => {
        synth.setFilterType('highpass')
    }

    const onCutoffInput = (e: any) => {
        synth.setFilterCutoff(parseFloat(e.currentTarget.value))
    }

    const onEnvCutoffInput = (e: any) => {
        synth.setFilterEnvCutoff(parseFloat(e.currentTarget.value))
    }

    const onResonanceInput = (e: any) => {
        synth.setFilterResonance(e.currentTarget.value)
    }

    const onAmpEnvelopeInput = (e: any) => {
        synth.setAmpEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    const onFilterEnvelopeInput = (e: any) => {
        synth.setFilterEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    const onOctaveIncreaseInput = (e: any) => {
        synth.setOctaveOffset(1)
        octaveDisplayElement.innerHTML = (parseInt(octaveDisplayElement.innerHTML) + 1).toString()
    }

    const onOctaveDecreaseInput = (e: any) => {
        synth.setOctaveOffset(-1)
        octaveDisplayElement.innerHTML = (parseInt(octaveDisplayElement.innerHTML) - 1).toString()
    }

    //UI Elements
    const allowAudioElement = document.querySelector('button[name="allow-audio"]')
    const masterVolumeElement = document.querySelector('input[name="master-volume"]')

    const waveTypeElement = <HTMLInputElement>document.querySelector('input[name="wave-input"]')

    const lowPassElement = <HTMLInputElement>document.getElementById('low-pass')
    const highPassElement = <HTMLInputElement>document.getElementById('high-pass')

    const cutoffElement = <HTMLInputElement>document.querySelector('input[name="cutoff"]')
    const envCutoffElement = <HTMLInputElement>document.querySelector('input[name="env-cutoff"]')
    const resonanceElement = <HTMLInputElement>document.querySelector('input[name="resonance"]')


    const ampAttackElement = <HTMLInputElement>document.querySelector('input[name="amp-attack-input"]')
    const ampDecayElement = <HTMLInputElement>document.querySelector('input[name="amp-decay-input"]')
    const ampSustainElement = <HTMLInputElement>document.querySelector('input[name="amp-sustain-input"]')
    const ampReleaseElement = <HTMLInputElement>document.querySelector('input[name="amp-release-input"]')

    const filterAttackElement = <HTMLInputElement>document.querySelector('input[name="filter-attack-input"]')
    const filterDecayElement = <HTMLInputElement>document.querySelector('input[name="filter-decay-input"]')
    const filterSustainElement = <HTMLInputElement>document.querySelector('input[name="filter-sustain-input"]')
    const filterReleaseElement = <HTMLInputElement>document.querySelector('input[name="filter-release-input"]')

    const octaveIncreaseElement = document.querySelector('button[name="increase-octave"]')
    const octaveDecreaseElement = document.querySelector('button[name="decrease-octave"]')
    const octaveDisplayElement = document.querySelector('.octave-offset-container span')

    const oscilloscopeElement = document.getElementById('oscilloscope')
    const spectrographElement = document.getElementById('spectrograph')

    //Attach Event handlers to appropriate element
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

    registerInputElement(octaveIncreaseElement, 'click', onOctaveIncreaseInput)
    registerInputElement(octaveDecreaseElement, 'click', onOctaveDecreaseInput)
}

export { documentInit }