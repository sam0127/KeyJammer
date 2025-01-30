import { Synth } from './Synth.js'
import { Keyboard } from './Keyboard.js'
import { oscilloscopeInit } from './oscilloscope.js'
import { InputController } from './InputController.js'

const registerInputElement = (element: Node, event: string, listener: (e: Event) => void) => {
    element.addEventListener(event, listener)
}

async function fetchDefaultPresets() {
    let presets = []
    var response = await fetch("./assets/defaultpresets/default.json");
    var jsonData = await response.json();
    presets[0] = jsonData

    response = await fetch("./assets/defaultpresets/trumpet.json");
    jsonData = await response.json();
    presets[1] = jsonData

    response = await fetch("./assets/defaultpresets/marimba.json");
    jsonData = await response.json();
    presets[2] = jsonData

    response = await fetch("./assets/defaultpresets/wow.json");
    jsonData = await response.json();
    presets[3] = jsonData

    response = await fetch("./assets/defaultpresets/steelstring.json");
    jsonData = await response.json();
    presets[4] = jsonData

    return presets
  }

const documentInit = (keyboard: Keyboard, inputController: InputController) => {

    //Preset saving and loading
    const saveDefaultPresets = () => {
        fetchDefaultPresets().then(data => {
            data.forEach((item: any) => {
                localStorage.setItem(item["name"], JSON.stringify(item))
            })
        })
    }

    const populatePresetsDropdown = () => {
        //get presets from local storage
        for(let i = 0; i < loadPresetElement.options.length; i++) {
            loadPresetElement.options[i].remove()
        }
        for(let i = 0; i < deletePresetElement.options.length; i++) {
            deletePresetElement.options[i].remove()
        }
        for(let i = 0; i < localStorage.length; i++) {
            generatePresetOption(loadPresetElement, localStorage.key(i))
            generatePresetOption(deletePresetElement, localStorage.key(i))
        }
        generatePresetOption(deletePresetElement, " ")
    }

    const generatePresetOption = (selectElement: HTMLSelectElement, name: string) => {
        if(selectElement.querySelector(`option[value='${name}']`) === null) {
            const optionElement = document.createElement("option")
            optionElement.value = name
            optionElement.text = name
    
            if(name === "Default" && selectElement.name === "load-preset"
                || name === " " && selectElement.name === "delete-preset"
            ) {
                optionElement.selected = true
            }
            selectElement.appendChild(optionElement)
        }
    }

    const loadPreset = (name: string) => {
        const preset = JSON.parse(localStorage.getItem(name))

        waveTypeElement.value = preset["waveType"]

        cutoffElement.value = preset["cutoff"]
        envCutoffElement.value = preset["envCutoff"]
        resonanceElement.value = preset["resonance"]
        ampAttackElement.value = preset["amplitudeEnv"]["attack"]
        ampDecayElement.value = preset["amplitudeEnv"]["decay"]
        ampSustainElement.value = preset["amplitudeEnv"]["sustain"]
        ampReleaseElement.value = preset["amplitudeEnv"]["release"]
        filterAttackElement.value = preset["filterEnv"]["attack"]
        filterDecayElement.value = preset["filterEnv"]["decay"]
        filterSustainElement.value = preset["filterEnv"]["sustain"]
        filterReleaseElement.value = preset["filterEnv"]["release"]
        octaveDisplayElement.innerHTML = preset["offset"]
    }

    //sets default inputController properties from DOM
    const setDefaults = (inputController: InputController) => {
        inputController.setWaveType(parseInt(waveTypeElement.value))
        //inputController.setFilterType(lowPassElement.checked ? 'lowpass' : 'highpass')
        inputController.setFilterCutoff(parseFloat(cutoffElement.value))
        inputController.setFilterEnvCutoff(parseFloat(envCutoffElement.value))
        inputController.setFilterResonance(parseInt(resonanceElement.value))
        inputController.setAmpEnvelope(ampAttackElement.name, parseInt(ampAttackElement.value))
        inputController.setAmpEnvelope(ampDecayElement.name, parseInt(ampDecayElement.value))
        inputController.setAmpEnvelope(ampSustainElement.name, parseInt(ampSustainElement.value))
        inputController.setAmpEnvelope(ampReleaseElement.name, parseInt(ampReleaseElement.value))
        inputController.setFilterEnvelope(filterAttackElement.name, parseInt(filterAttackElement.value))
        inputController.setFilterEnvelope(filterDecayElement.name, parseInt(filterDecayElement.value))
        inputController.setFilterEnvelope(filterSustainElement.name, parseInt(filterSustainElement.value))
        inputController.setFilterEnvelope(filterReleaseElement.name, parseInt(filterReleaseElement.value))
        inputController.setOctaveOffset(parseInt(octaveDisplayElement.innerHTML))
    }

    //Create keymap window
    const createKeymapWindow = () => {
        keyboard.bindingMap.forEach((value, key) => {
            const keyboardKey = document.querySelector(`div[data-key="${key}"]`)
            if(keyboardKey !== null) {
                keyboardKey.querySelector('span').innerHTML = value
                if(value.includes('#')) {
                    keyboardKey.classList.add('note-accidental')
                } else {
                    keyboardKey.classList.add('note-natural')
                }
            }
        })
    }
    //UI EVENT HANDLERS -----------------------------------------------------------

    const onInstructionsClick = (e: any) => {
        if(!instructionsAsideElement.classList.contains('opened')) {
            instructionsAsideElement.classList.add('opened')
        } else {
            instructionsAsideElement.classList.remove('opened')
        }
    }

    const onInstructionsKeyout = (e: any) => {
        if(instructionsAsideElement.classList.contains('opened') && e.code === "Escape") {
            instructionsAsideElement.classList.remove('opened')
        }
    }

    const onHeaderClick = (e: any) => {
        const sectionElement = document.getElementById(e.currentTarget.classList[1])

        if(!sectionElement.classList.contains('closed')) {
            sectionElement.classList.add('closed')
            e.currentTarget.classList.add('closed')
        } else {
            sectionElement.classList.remove('closed')
            e.currentTarget.classList.remove('closed')
        }
    }

    const onAllowAudio = (e: any) => {
        if(inputController.context.state === 'suspended') {
            console.log("Initializing Audio")

            inputController.context.resume()
            inputController.init()
            setDefaults(inputController)
            keyboard.init(inputController)
            oscilloscopeInit(
                <HTMLCanvasElement>oscilloscopeElement,
                <HTMLCanvasElement>spectrographElement,
                <AnalyserNode>inputController.globalChain.get(1)
            )
        }
    }

    const onMasterVolumeInput = (e: any) => {
        inputController.setMasterVolume(e.currentTarget.value)
    }

    const onLoadPresetInput = (e: any) => {
        loadPreset(e.currentTarget.value)
        setDefaults(inputController)
    }

    const onSavePresetInput = (e: any) => {
        //if text container empty, alert require name
        //else save preset with name as key
        if(savePresetNameElement.value === "") {
            savePresetNameElement.required = true
            alert("Please enter a name for your preset")
        } else {
            console.log(savePresetNameElement.value)
            savePresetNameElement.required = false
            var preset: object = {
                name: savePresetNameElement.value,
                waveType: parseInt(waveTypeElement.value),
                filterType: lowPassElement.checked ? 0 : 1, //TODO: when filters are added
                cutoff: parseFloat(cutoffElement.value),
                envCutoff: parseFloat(envCutoffElement.value),
                resonance: parseInt(resonanceElement.value),
                amplitudeEnv: {
                    attack: parseInt(ampAttackElement.value),
                    decay: parseInt(ampDecayElement.value),
                    sustain: parseInt(ampSustainElement.value),
                    release: parseInt(ampReleaseElement.value)
                },
                filterEnv: {
                    attack: parseInt(filterAttackElement.value),
                    decay: parseInt(filterDecayElement.value),
                    sustain: parseInt(filterSustainElement.value),
                    release: parseInt(filterReleaseElement.value)
                },
                offset: parseInt(octaveDisplayElement.innerHTML)
            }
            localStorage.setItem(savePresetNameElement.value, JSON.stringify(preset))
            console.log("Preset saved: ")
            console.log(preset)
            populatePresetsDropdown()
        }
    }

    const onDeletePresetInput = (e: any) => {
        console.log("Deleting preset " + deletePresetElement.value)
        localStorage.removeItem(deletePresetElement.value)
        populatePresetsDropdown()
    }

    const onKeyboardInput = (e: any) => {
        
    }

    const onMidiInput = (e: any) => {
        
    }

    const onMonophonicInput = (e: any) => {
        inputController.setMonophonic()
    }

    const onPolyphonicInput = (e: any) => {
        inputController.setPolyphonic()
    }

    const onSimpleWaveInput = (e: any) => {
        inputController.setWaveType(e.currentTarget.value)
    }

    const onLowPassInput = (e: any) => {
        inputController.setFilterType(0)
    }

    const onHighPassInput = (e: any) => {
        inputController.setFilterType(1)
    }

    const onCutoffInput = (e: any) => {
        inputController.setFilterCutoff(parseFloat(e.currentTarget.value))
    }

    const onEnvCutoffInput = (e: any) => {
        inputController.setFilterEnvCutoff(parseFloat(e.currentTarget.value))
    }

    const onResonanceInput = (e: any) => {
        inputController.setFilterResonance(e.currentTarget.value)
    }

    const onAmpEnvelopeInput = (e: any) => {
        inputController.setAmpEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    const onFilterEnvelopeInput = (e: any) => {
        inputController.setFilterEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    const onOctaveIncreaseInput = (e: any) => {
        if(parseInt(octaveDisplayElement.innerHTML) < 2) {
            keyboard.clearAllNotes(inputController)
            inputController.setOctaveOffset(parseInt(octaveDisplayElement.innerHTML) + 1)
            octaveDisplayElement.innerHTML = (parseInt(octaveDisplayElement.innerHTML) + 1).toString()
        }

    }

    const onOctaveDecreaseInput = (e: any) => {
        if(parseInt(octaveDisplayElement.innerHTML) > -1) {
            keyboard.clearAllNotes(inputController)
            inputController.setOctaveOffset(parseInt(octaveDisplayElement.innerHTML) - 1)
            octaveDisplayElement.innerHTML = (parseInt(octaveDisplayElement.innerHTML) - 1).toString()
        }
    }

    //REGISTER UI CONTROLS ------------------------------------------------------------------------------

    //Keyboard
    registerInputElement(document, 'keydown', onInstructionsKeyout)

    //Instructions
    const instructionsButtonElement: HTMLInputElement = document.querySelector('button[name="instructions"]')
    registerInputElement(instructionsButtonElement, 'click', onInstructionsClick)
    const instructionsAsideElement: Element = document.querySelector('aside.instructions')

    //Collapsible sections
    const headerElements: NodeListOf<Element> = document.querySelectorAll('.header-container')
    headerElements.forEach(headerElement => {
        registerInputElement(headerElement, 'click', onHeaderClick)
    })

    //Allow audio
    const allowAudioElement = document.querySelector('button[name="allow-audio"]')
    registerInputElement(allowAudioElement, 'click', onAllowAudio)

    //Master volume
    const masterVolumeElement = document.querySelector('input[name="master-volume"]')
    registerInputElement(masterVolumeElement, 'input', onMasterVolumeInput)

    //Presets
    const loadPresetElement: HTMLSelectElement = document.querySelector('select[name="load-preset"]')
    registerInputElement(loadPresetElement, 'change', onLoadPresetInput)
    const savePresetButtonElement: HTMLButtonElement = document.querySelector('button[name="save-preset"]')
    registerInputElement(savePresetButtonElement, 'click', onSavePresetInput)
    const savePresetNameElement: HTMLInputElement = document.querySelector('input[name="save-preset-name"]')
    const deletePresetElement: HTMLSelectElement = document.querySelector('select[name="delete-preset"]')
    const deletePresetButtonElement: HTMLInputElement = document.querySelector('button[name="delete-preset"]')
    registerInputElement(deletePresetButtonElement, 'click', onDeletePresetInput)

    //Input controls
    const keyboardInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('keyboard')
    registerInputElement(keyboardInputElement, 'change', onKeyboardInput)
    const midiInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('midi')
    registerInputElement(midiInputElement, 'change', onMidiInput)
    const monophonicInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('monophonic')
    registerInputElement(monophonicInputElement, 'change', onMonophonicInput)
    const polyphonicInputElement: HTMLInputElement = <HTMLInputElement>document.getElementById('polyphonic')
    registerInputElement(polyphonicInputElement, 'change', onPolyphonicInput)

    //Oscillators
    const waveTypeElement: HTMLInputElement = document.querySelector('input[name="wave-input"]')
    registerInputElement(waveTypeElement, 'input', onSimpleWaveInput)

    //Filter
    const lowPassElement: HTMLInputElement = <HTMLInputElement>document.getElementById('low-pass')
    registerInputElement(lowPassElement, 'change', onLowPassInput)
    const highPassElement: HTMLInputElement = <HTMLInputElement>document.getElementById('high-pass')
    registerInputElement(highPassElement, 'change', onHighPassInput)
    const cutoffElement: HTMLInputElement = document.querySelector('input[name="cutoff"]')
    registerInputElement(cutoffElement, 'input', onCutoffInput)
    const envCutoffElement: HTMLInputElement = document.querySelector('input[name="env-cutoff"]')
    registerInputElement(envCutoffElement, 'input', onEnvCutoffInput)
    const resonanceElement: HTMLInputElement = document.querySelector('input[name="resonance"]')
    registerInputElement(resonanceElement, 'input', onResonanceInput)

    //Amplitude envelope
    const ampAttackElement: HTMLInputElement = document.querySelector('input[name="amp-attack-input"]')
    registerInputElement(ampAttackElement, 'input', onAmpEnvelopeInput)
    const ampDecayElement: HTMLInputElement = document.querySelector('input[name="amp-decay-input"]')
    registerInputElement(ampDecayElement, 'input', onAmpEnvelopeInput)
    const ampSustainElement: HTMLInputElement = document.querySelector('input[name="amp-sustain-input"]')
    registerInputElement(ampSustainElement, 'input', onAmpEnvelopeInput)
    const ampReleaseElement: HTMLInputElement = document.querySelector('input[name="amp-release-input"]')
    registerInputElement(ampReleaseElement, 'input', onAmpEnvelopeInput)

    //Filter envelope
    const filterAttackElement: HTMLInputElement = document.querySelector('input[name="filter-attack-input"]')
    registerInputElement(filterAttackElement, 'input', onFilterEnvelopeInput)
    const filterDecayElement: HTMLInputElement = document.querySelector('input[name="filter-decay-input"]')
    registerInputElement(filterDecayElement, 'input', onFilterEnvelopeInput)
    const filterSustainElement: HTMLInputElement = document.querySelector('input[name="filter-sustain-input"]')
    registerInputElement(filterSustainElement, 'input', onFilterEnvelopeInput)
    const filterReleaseElement: HTMLInputElement = document.querySelector('input[name="filter-release-input"]')
    registerInputElement(filterReleaseElement, 'input', onFilterEnvelopeInput)

    //Octave controls
    const octaveIncreaseElement: HTMLButtonElement = document.querySelector('button[name="increase-octave"]')
    registerInputElement(octaveIncreaseElement, 'click', onOctaveIncreaseInput)
    const octaveDecreaseElement: HTMLButtonElement = document.querySelector('button[name="decrease-octave"]')
    registerInputElement(octaveDecreaseElement, 'click', onOctaveDecreaseInput)
    const octaveDisplayElement: Element = document.querySelector('.octave-offset-container span')

    //Wave displays
    const oscilloscopeElement: Element = document.getElementById('oscilloscope')
    const spectrographElement: Element = document.getElementById('spectrograph')

    //INITIALIZATION ---------------------------------------------------------------

    //save default presets to localStorage
    saveDefaultPresets()
    //populate dropdown with all presets in localStorage
    populatePresetsDropdown()
    //load default preset on DOM
    loadPreset("Default")

    createKeymapWindow()
    //Attach Event handlers to appropriate element

    window.addEventListener('blur', (e: any) => {
       // keyboard.clearAllNotes(inputController)
    })
}

export { documentInit }