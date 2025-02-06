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

    
    response = await fetch("./assets/defaultpresets/string.json");
    jsonData = await response.json();
    presets[1] = jsonData
    /*
    response = await fetch("./assets/defaultpresets/marimba.json");
    jsonData = await response.json();
    presets[2] = jsonData

    response = await fetch("./assets/defaultpresets/wow.json");
    jsonData = await response.json();
    presets[3] = jsonData

    response = await fetch("./assets/defaultpresets/steelstring.json");
    jsonData = await response.json();
    presets[4] = jsonData
    */
    return presets
}

const documentInit = (keyboard: Keyboard, inputController: InputController, defaultPresets: Map<string, string>) => {
    
    //Preset saving and loading
    const populatePresetsDropdown = () => {
        for(let i = 0; i < loadPresetElement.options.length; i++) {
            loadPresetElement.options[i].remove()
        }
        for(let i = 0; i < deletePresetElement.options.length; i++) {
            deletePresetElement.options[i].remove()
        }

        defaultPresets.forEach((value: string, key: string) => {
            generatePresetOption(loadPresetElement, key)
        })

        for(let i = 0; i < localStorage.length; i++) {
            generatePresetOption(loadPresetElement, localStorage.key(i))
            generatePresetOption(deletePresetElement, localStorage.key(i))
        }
        generatePresetOption(deletePresetElement, "")
    }

    const generatePresetOption = (selectElement: HTMLSelectElement, name: string) => {
        
        if(selectElement.querySelector(`option[value='${name}']`) === null) {
            const optionElement = document.createElement("option")
            optionElement.value = name
            optionElement.text = name
    
            if(name === "Default" && selectElement.name === "load-preset" || name === "") {
                optionElement.selected = true
                if(name === "") {
                    optionElement.classList.add("hidden")
                }
            }
            selectElement.appendChild(optionElement)
        }
            
    }

    const loadPreset = (name: string) => {
        let preset
        if(localStorage.getItem(name) != null) {
            preset = JSON.parse(localStorage.getItem(name))
        } else {
            preset = JSON.parse(defaultPresets.get(name))
        }
        
        if(preset["version"] == null || parseFloat(preset["version"]) < PRESET_VERSION) {
            console.error(`Preset ${name} was created on an earlier version of this software, settings may not apply properly.\nPreset version: ${preset["version"]} | Current version ${PRESET_VERSION}`)
        }

        if(preset["signalCapacity"] != null) {
            voicesElement.value = preset["signalCapacity"]
            setVoices(voicesElement.value)
        }

        if(preset["oscA"] != null) {
            if(preset["oscA"]["waveType"] != null) {
                const selectedWaveTypeA: HTMLInputElement = document.querySelector(`input[name='wave-src-oscA'][value='${preset["oscA"]["waveType"]}']`)
                selectedWaveTypeA.checked = true
            }
            if(preset["oscA"]["coarseDetune"] != null) {
                oscACoarseDetuneElement.value = preset["oscA"]["coarseDetune"]
            }
            if(preset["oscA"]["fineDetune"] != null) {
                oscAFineDetuneElement.value = preset["oscA"]["fineDetune"]
            }
            if(preset["oscA"]["amplitude"] != null) {
                oscAAmplitudeElement.value = preset["oscA"]["amplitude"]
            }
        }

        if(preset["oscB"] != null) {
            if(preset["oscB"]["waveType"] != null) {
                const selectedWaveTypeB: HTMLInputElement = document.querySelector(`input[name='wave-src-oscB'][value='${preset["oscB"]["waveType"]}']`)
                selectedWaveTypeB.checked = true
            }
            if(preset["oscB"]["coarseDetune"] != null) {
                oscBCoarseDetuneElement.value = preset["oscB"]["coarseDetune"]
            }
            if(preset["oscB"]["fineDetune"] != null) {
                oscBFineDetuneElement.value = preset["oscB"]["fineDetune"]
            }
            if(preset["oscB"]["amplitude"] != null) {
                oscBAmplitudeElement.value = preset["oscB"]["amplitude"]
            }
        }

        if(preset["filterA"] != null) {
            if(preset["filterA"]["filterType"] != null) {
                const selectedFilterTypeA: HTMLInputElement = document.querySelector(`input[name='filterA'][value='${preset["filterA"]["filterType"]}']`)
                selectedFilterTypeA.checked = true
            }
            if(preset["filterA"]["frequency"] != null) {
                frequencyAElement.value = preset["filterA"]["frequency"]
            }
            if(preset["filterA"]["envFrequency"] != null) {
                envFrequencyAElement.value = preset["filterA"]["envFrequency"]
            }
            if(preset["filterA"]["resonance"] != null) {
                resonanceAElement.value = preset["filterA"]["resonance"]
            }
        }

        if(preset["filterB"] != null) {
            if(preset["filterB"]["filterType"] != null) {
                const selectedFilterTypeB: HTMLInputElement = document.querySelector(`input[name='filterB'][value='${preset["filterB"]["filterType"]}']`)
                selectedFilterTypeB.checked = true
            }
            if(preset["filterB"]["frequency"] != null) {
                frequencyBElement.value = preset["filterB"]["frequency"]
            }
            if(preset["filterB"]["envFrequency"] != null) {
                envFrequencyBElement.value = preset["filterB"]["envFrequency"]
            }
            if(preset["filterB"]["resonance"] != null) {
                resonanceBElement.value = preset["filterB"]["resonance"]
            }
        }

        if(preset["amplitudeEnv"] != null) {
            if(preset["amplitudeEnv"]["attack"] != null) {
                ampAttackElement.value = preset["amplitudeEnv"]["attack"]
            }
            if(preset["amplitudeEnv"]["decay"] != null) {
                ampDecayElement.value = preset["amplitudeEnv"]["decay"]
            }
            if(preset["amplitudeEnv"]["sustain"] != null) {
                ampSustainElement.value = preset["amplitudeEnv"]["sustain"]
            }
            if(preset["amplitudeEnv"]["release"] != null) {
                ampReleaseElement.value = preset["amplitudeEnv"]["release"]
            }
        }

        if(preset["filterEnv"] != null) {
            if(preset["filterEnv"]["attack"] != null) {
                filterAttackElement.value = preset["filterEnv"]["attack"]
            }
            if(preset["filterEnv"]["decay"] != null) {
                filterDecayElement.value = preset["filterEnv"]["decay"]
            }
            if(preset["filterEnv"]["sustain"] != null) {
                filterSustainElement.value = preset["filterEnv"]["sustain"]
            }
            if(preset["filterEnv"]["release"] != null) {
                filterReleaseElement.value = preset["filterEnv"]["release"]
            }
        }
    }
    
    const setVoices = (value: string) => {
        voicesElement.parentElement.querySelector('label span').innerHTML = value
    }

    //sets inputController properties from DOM
    const configureInputController = (inputController: InputController) => {

        inputController.setSignalCapacity(parseInt(voicesElement.value))

        const checkedOscAWaveType: HTMLInputElement = document.querySelector('input[name="wave-src-oscA"]:checked')
        const checkedOscBWaveType: HTMLInputElement = document.querySelector('input[name="wave-src-oscB"]:checked')
        inputController.setWaveTypeA(checkedOscAWaveType.value)
        inputController.setWaveTypeB(checkedOscBWaveType.value)
        inputController.setDetuneA(Number(oscACoarseDetuneElement.value)*100 + Number(oscAFineDetuneElement.value))
        inputController.setDetuneB(Number(oscBCoarseDetuneElement.value)*100 + Number(oscBFineDetuneElement.value))
        inputController.setAmplitudeA(parseFloat(oscAAmplitudeElement.value))
        inputController.setAmplitudeB(parseFloat(oscBAmplitudeElement.value))

        const checkedFilterAType: HTMLInputElement = document.querySelector('input[name="filterA"]:checked')
        const checkedFilterBType: HTMLInputElement = document.querySelector('input[name="filterB"]:checked')
        inputController.setFilterTypeA(checkedFilterAType.value)
        inputController.setFilterTypeB(checkedFilterBType.value)
        inputController.setFilterFrequencyA(Math.pow(2, parseFloat(frequencyAElement.value)))
        inputController.setFilterFrequencyB(Math.pow(2, parseFloat(frequencyBElement.value)))
        inputController.setFilterEnvFrequencyA(Math.pow(2, parseFloat(envFrequencyAElement.value)))
        inputController.setFilterEnvFrequencyB(Math.pow(2, parseFloat(envFrequencyBElement.value)))
        inputController.setFilterQA(parseFloat(resonanceAElement.value))
        inputController.setFilterQB(parseInt(resonanceBElement.value))


        inputController.setAmpEnvelope(ampAttackElement.name, parseInt(ampAttackElement.value))
        inputController.setAmpEnvelope(ampDecayElement.name, parseInt(ampDecayElement.value))
        inputController.setAmpEnvelope(ampSustainElement.name, parseInt(ampSustainElement.value))
        inputController.setAmpEnvelope(ampReleaseElement.name, parseInt(ampReleaseElement.value))
        inputController.setFilterEnvelope(filterAttackElement.name, parseInt(filterAttackElement.value))
        inputController.setFilterEnvelope(filterDecayElement.name, parseInt(filterDecayElement.value))
        inputController.setFilterEnvelope(filterSustainElement.name, parseInt(filterSustainElement.value))
        inputController.setFilterEnvelope(filterReleaseElement.name, parseInt(filterReleaseElement.value))
        
    }

    //Create keymap window
    const createKeymapWindowFromBindings = () => {
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

    const onInstructionsClickout = (e: any) => {
        if(e.target.classList.contains('instructions')) {
            if(instructionsAsideElement.classList.contains('opened')) {
                instructionsAsideElement.classList.remove('opened')
            }
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
            configureInputController(inputController)
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
        configureInputController(inputController)
    }

    const onSavePresetInput = (e: any) => {
        //if text container empty, alert require name
        //else save preset with name as key
        
        if(savePresetNameElement.value === "") {
            savePresetNameElement.required = true
            alert("Please enter a name for your preset")
        } else {
            savePresetNameElement.required = false
            const checkedWaveTypeA: HTMLInputElement = document.querySelector("input[name='wave-src-oscA']:checked")
            const checkedWaveTypeB: HTMLInputElement = document.querySelector("input[name='wave-src-oscB']:checked")
            const checkedFilterTypeA: HTMLInputElement = document.querySelector("input[name='filterA']:checked")
            const checkedFilterTypeB: HTMLInputElement = document.querySelector("input[name='filterB']:checked")
            var preset: object = {
                name: savePresetNameElement.value,
                version: PRESET_VERSION,
                signalCapacity: voicesElement.value,
                oscA:
                {
                    waveType: checkedWaveTypeA.value,
                    coarseDetune: parseInt(oscACoarseDetuneElement.value),
                    fineDetune: parseInt(oscAFineDetuneElement.value),
                    amplitude: parseFloat(oscAAmplitudeElement.value)
                },
                oscB:
                {
                    waveType: checkedWaveTypeB.value,
                    coarseDetune: parseInt(oscBCoarseDetuneElement.value),
                    fineDetune: parseInt(oscBFineDetuneElement.value),
                    amplitude: parseFloat(oscBAmplitudeElement.value)
                },
                filterA:
                {
                    filterType: checkedFilterTypeA.value,
                    frequency: parseFloat(frequencyAElement.value),
                    envFrequency: parseFloat(envFrequencyAElement.value),
                    resonance: parseInt(resonanceAElement.value)
                },
                filterB:
                {
                    filterType: checkedFilterTypeB.value,
                    frequency: parseFloat(frequencyBElement.value),
                    envFrequency: parseFloat(envFrequencyBElement.value),
                    resonance: parseInt(resonanceBElement.value)
                },
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
                }
            }
            localStorage.setItem(savePresetNameElement.value, JSON.stringify(preset))
            populatePresetsDropdown()
            savePresetNameElement.value = ""
        }
            
    }

    const onDeletePresetInput = (e: any) => {
        if(confirm("Are you sure you want to delete " + deletePresetElement.value + "?")) {
            localStorage.removeItem(deletePresetElement.value)
            populatePresetsDropdown()
        }
    }

    const onKeyboardInput = (e: any) => {
        
    }

    const onMidiInput = (e: any) => {
        
    }

    const onVoicesInput = (e: any) => {
        setVoices(e.currentTarget.value)
        configureInputController(inputController)
    }

    //Oscillator event handlers
    const onOscAWaveInput = (e: any) => {
        inputController.setWaveTypeA(e.currentTarget.value)
    }

    const onOscADetuneInput = (e: any) => {
        inputController.setDetuneA(Number(oscACoarseDetuneElement.value)*100 + Number(oscAFineDetuneElement.value))
    }

    const onOscADetuneDblClickInput = (e: any) => {
        e.target.value = 0
        inputController.setDetuneA(Number(oscACoarseDetuneElement.value)*100 + Number(oscAFineDetuneElement.value))
    }

    const onOscAAmplitudeInput = (e: any) => {
        inputController.setAmplitudeA(e.currentTarget.value)
    }

    const onOscBWaveInput = (e: any) => {
        inputController.setWaveTypeB(e.currentTarget.value)
    }

    const onOscBDetuneInput = (e: any) => {
        inputController.setDetuneB(Number(oscBCoarseDetuneElement.value)*100 + Number(oscBFineDetuneElement.value))
    }

    const onOscBDetuneDblClickInput = (e: any) => {
        e.target.value = 0
        inputController.setDetuneB(Number(oscBCoarseDetuneElement.value)*100 + Number(oscBFineDetuneElement.value))
    }

    const onOscBAmplitudeInput = (e: any) => {
        inputController.setAmplitudeB(e.currentTarget.value)
    }

    //Filter event handlers
    const onFilterATypeInput = (e: any) => {
        inputController.setFilterTypeA(e.currentTarget.value)
    }   

    const onFrequencyAInput = (e: any) => {
        inputController.setFilterFrequencyA(Math.pow(2, parseFloat(e.currentTarget.value)))
    }

    const onEnvFrequencyAInput = (e: any) => {
        inputController.setFilterEnvFrequencyA(Math.pow(2, parseFloat(e.currentTarget.value)))
    }

    const onResonanceAInput = (e: any) => {
        inputController.setFilterQA(parseFloat(e.currentTarget.value))
    }

    const onFilterBTypeInput = (e: any) => {
        inputController.setFilterTypeB(e.currentTarget.value)
    }   

    const onFrequencyBInput = (e: any) => {
        inputController.setFilterFrequencyB(Math.pow(2, parseFloat(e.currentTarget.value)))
    }

    const onEnvFrequencyBInput = (e: any) => {
        inputController.setFilterEnvFrequencyB(Math.pow(2, parseFloat(e.currentTarget.value)))
    }

    const onResonanceBInput = (e: any) => {
        inputController.setFilterQB(parseFloat(e.currentTarget.value))
    }

    const onAmpEnvelopeInput = (e: any) => {
        inputController.setAmpEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    const onFilterEnvelopeInput = (e: any) => {
        inputController.setFilterEnvelope(e.currentTarget.name, e.currentTarget.value)
    }

    //Used for checking if presets were made on earlier version
    const PRESET_VERSION = 1.1

    //REGISTER UI CONTROLS ------------------------------------------------------------------------------

    //Keyboard
    registerInputElement(document, 'keydown', onInstructionsKeyout)
    

    //Instructions
    const instructionsButtonElement: HTMLInputElement = document.querySelector('button[name="instructions"]')
    registerInputElement(instructionsButtonElement, 'click', onInstructionsClick)
    const instructionsAsideElement: Element = document.querySelector('aside.instructions')
    registerInputElement(instructionsAsideElement, 'click', onInstructionsClickout)

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

    const voicesElement: HTMLInputElement = document.querySelector('input[name="voices"]')
    registerInputElement(voicesElement, 'input', onVoicesInput)


    //Oscillators
    const oscAWaveTypeElements: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="wave-src-oscA"]')
    oscAWaveTypeElements.forEach(oscAWaveTypeElement => {
        registerInputElement(oscAWaveTypeElement, 'input', onOscAWaveInput)
    })
    const oscACoarseDetuneElement: HTMLInputElement = document.querySelector('input[name="coarse-detune-oscA"]')
    registerInputElement(oscACoarseDetuneElement, 'input', onOscADetuneInput)
    const oscAFineDetuneElement: HTMLInputElement = document.querySelector('input[name="fine-detune-oscA"]')
    registerInputElement(oscAFineDetuneElement, 'input', onOscADetuneInput)
    registerInputElement(oscACoarseDetuneElement, 'dblclick', onOscADetuneDblClickInput)
    registerInputElement(oscAFineDetuneElement, 'dblclick', onOscADetuneDblClickInput)
    const oscAAmplitudeElement: HTMLInputElement = document.querySelector('input[name="amplitude-oscA"]')
    registerInputElement(oscAAmplitudeElement, 'input', onOscAAmplitudeInput)

    const oscBWaveTypeElements: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="wave-src-oscB"]')
    oscBWaveTypeElements.forEach(oscBWaveTypeElement => {
        registerInputElement(oscBWaveTypeElement, 'input', onOscBWaveInput)
    })
    const oscBCoarseDetuneElement: HTMLInputElement = document.querySelector('input[name="coarse-detune-oscB"]')
    registerInputElement(oscBCoarseDetuneElement, 'input', onOscBDetuneInput)
    const oscBFineDetuneElement: HTMLInputElement = document.querySelector('input[name="fine-detune-oscB"]')
    registerInputElement(oscBFineDetuneElement, 'input', onOscBDetuneInput)
    registerInputElement(oscBCoarseDetuneElement, 'dblclick', onOscBDetuneDblClickInput)
    registerInputElement(oscBFineDetuneElement, 'dblclick', onOscBDetuneDblClickInput)
    const oscBAmplitudeElement: HTMLInputElement = document.querySelector('input[name="amplitude-oscB"]')
    registerInputElement(oscBAmplitudeElement, 'input', onOscBAmplitudeInput)

    //Filters
    const filterATypeElements: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="filterA"]')
    filterATypeElements.forEach(filterATypeElement => {
        registerInputElement(filterATypeElement, 'input', onFilterATypeInput)
    })
    const frequencyAElement: HTMLInputElement = document.querySelector('input[name="frequencyA"]')
    registerInputElement(frequencyAElement, 'input', onFrequencyAInput)
    const envFrequencyAElement: HTMLInputElement = document.querySelector('input[name="env-frequencyA"]')
    registerInputElement(envFrequencyAElement, 'input', onEnvFrequencyAInput)
    const resonanceAElement: HTMLInputElement = document.querySelector('input[name="resonanceA"]')
    registerInputElement(resonanceAElement, 'input', onResonanceAInput)

    const filterBTypeElements: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[name="filterB"]')
    filterBTypeElements.forEach(filterBTypeElement => {
        registerInputElement(filterBTypeElement, 'input', onFilterBTypeInput)
    })
    const frequencyBElement: HTMLInputElement = document.querySelector('input[name="frequencyB"]')
    registerInputElement(frequencyBElement, 'input', onFrequencyBInput)
    const envFrequencyBElement: HTMLInputElement = document.querySelector('input[name="env-frequencyB"]')
    registerInputElement(envFrequencyBElement, 'input', onEnvFrequencyBInput)
    const resonanceBElement: HTMLInputElement = document.querySelector('input[name="resonanceB"]')
    registerInputElement(resonanceBElement, 'input', onResonanceBInput)

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

    //Wave displays
    const oscilloscopeElement: Element = document.getElementById('oscilloscope')
    const spectrographElement: Element = document.getElementById('spectrograph')

    //INITIALIZATION ---------------------------------------------------------------

    //save default presets to localStorage
    //const defaultPresets: Map<string, string> = new Map()
    //saveDefaultPresets()
    //populate dropdown with all presets in localStorage
    populatePresetsDropdown()
    //load default preset on DOM
    loadPreset("Default")

    createKeymapWindowFromBindings()
    //Attach Event handlers to appropriate element

    window.addEventListener('blur', (e: any) => {
        keyboard.clearAllKeys()
    })
}

export { documentInit, fetchDefaultPresets }