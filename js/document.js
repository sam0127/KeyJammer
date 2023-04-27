import { oscilloscopeInit } from './oscilloscope.js';
const registerInputElement = (element, event, listener) => {
    element.addEventListener(event, listener);
};
async function fetchDefaultPresets() {
    let presets = [];
    var response = await fetch("./assets/defaultpresets/default.json");
    var jsonData = await response.json();
    presets[0] = jsonData;
    response = await fetch("./assets/defaultpresets/trumpet.json");
    jsonData = await response.json();
    presets[1] = jsonData;
    response = await fetch("./assets/defaultpresets/marimba.json");
    jsonData = await response.json();
    presets[2] = jsonData;
    response = await fetch("./assets/defaultpresets/wow.json");
    jsonData = await response.json();
    presets[3] = jsonData;
    response = await fetch("./assets/defaultpresets/steelstring.json");
    jsonData = await response.json();
    presets[4] = jsonData;
    return presets;
}
const documentInit = (synth, keyboard) => {
    //Preset saving and loading
    const saveDefaultPresets = () => {
        fetchDefaultPresets().then(data => {
            data.forEach((item) => {
                localStorage.setItem(item["name"], JSON.stringify(item));
            });
        });
    };
    const populatePresetsDropdown = () => {
        //get presets from local storage
        for (let i = 0; i < loadPresetElement.options.length; i++) {
            loadPresetElement.options[i].remove();
        }
        for (let i = 0; i < deletePresetElement.options.length; i++) {
            deletePresetElement.options[i].remove();
        }
        for (let i = 0; i < localStorage.length; i++) {
            generatePresetOption(loadPresetElement, localStorage.key(i));
            generatePresetOption(deletePresetElement, localStorage.key(i));
        }
        generatePresetOption(deletePresetElement, " ");
    };
    const generatePresetOption = (selectElement, name) => {
        if (selectElement.querySelector(`option[value='${name}']`) === null) {
            const optionElement = document.createElement("option");
            optionElement.value = name;
            optionElement.text = name;
            if (name === "Default" && selectElement.name === "load-preset"
                || name === " " && selectElement.name === "delete-preset") {
                optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        }
    };
    const loadPreset = (name) => {
        const preset = JSON.parse(localStorage.getItem(name));
        waveTypeElement.value = preset["waveType"];
        cutoffElement.value = preset["cutoff"];
        envCutoffElement.value = preset["envCutoff"];
        resonanceElement.value = preset["resonance"];
        ampAttackElement.value = preset["amplitudeEnv"]["attack"];
        ampDecayElement.value = preset["amplitudeEnv"]["decay"];
        ampSustainElement.value = preset["amplitudeEnv"]["sustain"];
        ampReleaseElement.value = preset["amplitudeEnv"]["release"];
        filterAttackElement.value = preset["filterEnv"]["attack"];
        filterDecayElement.value = preset["filterEnv"]["decay"];
        filterSustainElement.value = preset["filterEnv"]["sustain"];
        filterReleaseElement.value = preset["filterEnv"]["release"];
        octaveDisplayElement.innerHTML = preset["offset"];
    };
    //sets default synth properties from DOM
    const setDefaults = (synth) => {
        synth.setWaveType(parseInt(waveTypeElement.value));
        //synth.setFilterType(lowPassElement.checked ? 'lowpass' : 'highpass')
        synth.setFilterCutoff(parseFloat(cutoffElement.value));
        synth.setFilterEnvCutoff(parseFloat(envCutoffElement.value));
        synth.setFilterResonance(parseInt(resonanceElement.value));
        synth.setAmpEnvelope(ampAttackElement.name, parseInt(ampAttackElement.value));
        synth.setAmpEnvelope(ampDecayElement.name, parseInt(ampDecayElement.value));
        synth.setAmpEnvelope(ampSustainElement.name, parseInt(ampSustainElement.value));
        synth.setAmpEnvelope(ampReleaseElement.name, parseInt(ampReleaseElement.value));
        synth.setFilterEnvelope(filterAttackElement.name, parseInt(filterAttackElement.value));
        synth.setFilterEnvelope(filterDecayElement.name, parseInt(filterDecayElement.value));
        synth.setFilterEnvelope(filterSustainElement.name, parseInt(filterSustainElement.value));
        synth.setFilterEnvelope(filterReleaseElement.name, parseInt(filterReleaseElement.value));
        synth.setOctaveOffset(parseInt(octaveDisplayElement.innerHTML));
    };
    //User interaction event handlers below
    const onInstructionsClick = (e) => {
        if (!instructionsAsideElement.classList.contains('opened')) {
            instructionsAsideElement.classList.add('opened');
        }
        else {
            instructionsAsideElement.classList.remove('opened');
        }
    };
    const onInstructionsKeyout = (e) => {
        if (instructionsAsideElement.classList.contains('opened') && e.code === "Escape") {
            instructionsAsideElement.classList.remove('opened');
        }
    };
    const onHeaderClick = (e) => {
        const sectionElement = document.getElementById(e.currentTarget.classList[1]);
        if (!sectionElement.classList.contains('closed')) {
            sectionElement.classList.add('closed');
            e.currentTarget.classList.add('closed');
        }
        else {
            sectionElement.classList.remove('closed');
            e.currentTarget.classList.remove('closed');
        }
    };
    const onAllowAudio = (e) => {
        if (synth.context.state === 'suspended') {
            console.log("Initializing Audio");
            synth.context.resume();
            synth.init();
            setDefaults(synth);
            keyboard.init(synth);
            oscilloscopeInit(oscilloscopeElement, spectrographElement, synth.globalChain.get(1));
        }
    };
    const onMasterVolumeInput = (e) => {
        synth.setMasterVolume(e.currentTarget.value);
    };
    const onLoadPresetInput = (e) => {
        loadPreset(e.currentTarget.value);
        setDefaults(synth);
    };
    const onSavePresetInput = (e) => {
        //if text container empty, alert require name
        //else save preset with name as key
        if (savePresetNameElement.value === "") {
            savePresetNameElement.required = true;
            alert("Please enter a name for your preset");
        }
        else {
            console.log(savePresetNameElement.value);
            savePresetNameElement.required = false;
            var preset = {
                name: savePresetNameElement.value,
                waveType: parseInt(waveTypeElement.value),
                filterType: lowPassElement.checked ? 0 : 1,
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
            };
            localStorage.setItem(savePresetNameElement.value, JSON.stringify(preset));
            console.log("Preset saved: ");
            console.log(preset);
            populatePresetsDropdown();
        }
    };
    const onDeletePresetInput = (e) => {
        console.log("Deleting preset " + deletePresetElement.value);
        localStorage.removeItem(deletePresetElement.value);
        populatePresetsDropdown();
    };
    const onSimpleWaveInput = (e) => {
        synth.setWaveType(e.currentTarget.value);
    };
    const onLowPassInput = (e) => {
        synth.setFilterType(0);
    };
    const onHighPassInput = (e) => {
        synth.setFilterType(1);
    };
    const onCutoffInput = (e) => {
        synth.setFilterCutoff(parseFloat(e.currentTarget.value));
    };
    const onEnvCutoffInput = (e) => {
        synth.setFilterEnvCutoff(parseFloat(e.currentTarget.value));
    };
    const onResonanceInput = (e) => {
        synth.setFilterResonance(e.currentTarget.value);
    };
    const onAmpEnvelopeInput = (e) => {
        synth.setAmpEnvelope(e.currentTarget.name, e.currentTarget.value);
    };
    const onFilterEnvelopeInput = (e) => {
        synth.setFilterEnvelope(e.currentTarget.name, e.currentTarget.value);
    };
    const onOctaveIncreaseInput = (e) => {
        if (parseInt(octaveDisplayElement.innerHTML) < 2) {
            keyboard.clearAllNotes(synth);
            synth.setOctaveOffset(parseInt(octaveDisplayElement.innerHTML) + 1);
            octaveDisplayElement.innerHTML = (parseInt(octaveDisplayElement.innerHTML) + 1).toString();
        }
    };
    const onOctaveDecreaseInput = (e) => {
        if (parseInt(octaveDisplayElement.innerHTML) > -1) {
            keyboard.clearAllNotes(synth);
            synth.setOctaveOffset(parseInt(octaveDisplayElement.innerHTML) - 1);
            octaveDisplayElement.innerHTML = (parseInt(octaveDisplayElement.innerHTML) - 1).toString();
        }
    };
    //UI Elements
    const instructionsButtonElement = document.querySelector('button[name="instructions"]');
    const instructionsAsideElement = document.querySelector('aside.instructions');
    const headerElements = document.querySelectorAll('.header-container');
    const allowAudioElement = document.querySelector('button[name="allow-audio"]');
    const masterVolumeElement = document.querySelector('input[name="master-volume"]');
    const loadPresetElement = document.querySelector('select[name="load-preset"]');
    const savePresetButtonElement = document.querySelector('button[name="save-preset"]');
    const savePresetNameElement = document.querySelector('input[name="save-preset-name"]');
    const deletePresetElement = document.querySelector('select[name="delete-preset"]');
    const deletePresetButtonElement = document.querySelector('button[name="delete-preset"]');
    const waveTypeElement = document.querySelector('input[name="wave-input"]');
    const lowPassElement = document.getElementById('low-pass');
    const highPassElement = document.getElementById('high-pass');
    const cutoffElement = document.querySelector('input[name="cutoff"]');
    const envCutoffElement = document.querySelector('input[name="env-cutoff"]');
    const resonanceElement = document.querySelector('input[name="resonance"]');
    const ampAttackElement = document.querySelector('input[name="amp-attack-input"]');
    const ampDecayElement = document.querySelector('input[name="amp-decay-input"]');
    const ampSustainElement = document.querySelector('input[name="amp-sustain-input"]');
    const ampReleaseElement = document.querySelector('input[name="amp-release-input"]');
    const filterAttackElement = document.querySelector('input[name="filter-attack-input"]');
    const filterDecayElement = document.querySelector('input[name="filter-decay-input"]');
    const filterSustainElement = document.querySelector('input[name="filter-sustain-input"]');
    const filterReleaseElement = document.querySelector('input[name="filter-release-input"]');
    const octaveIncreaseElement = document.querySelector('button[name="increase-octave"]');
    const octaveDecreaseElement = document.querySelector('button[name="decrease-octave"]');
    const octaveDisplayElement = document.querySelector('.octave-offset-container span');
    const oscilloscopeElement = document.getElementById('oscilloscope');
    const spectrographElement = document.getElementById('spectrograph');
    //save default presets to localStorage
    saveDefaultPresets();
    //populate dropdown with all presets in localStorage
    populatePresetsDropdown();
    //load default preset on DOM
    loadPreset("Default");
    //Attach Event handlers to appropriate element
    registerInputElement(instructionsButtonElement, 'click', onInstructionsClick);
    registerInputElement(document, 'keydown', onInstructionsKeyout);
    headerElements.forEach(headerElement => {
        registerInputElement(headerElement, 'click', onHeaderClick);
    });
    registerInputElement(allowAudioElement, 'click', onAllowAudio);
    registerInputElement(masterVolumeElement, 'input', onMasterVolumeInput);
    registerInputElement(loadPresetElement, 'change', onLoadPresetInput);
    registerInputElement(savePresetButtonElement, 'click', onSavePresetInput);
    registerInputElement(deletePresetButtonElement, 'click', onDeletePresetInput);
    registerInputElement(waveTypeElement, 'input', onSimpleWaveInput);
    registerInputElement(lowPassElement, 'change', onLowPassInput);
    registerInputElement(highPassElement, 'change', onHighPassInput);
    registerInputElement(cutoffElement, 'input', onCutoffInput);
    registerInputElement(envCutoffElement, 'input', onEnvCutoffInput);
    registerInputElement(resonanceElement, 'input', onResonanceInput);
    registerInputElement(ampAttackElement, 'input', onAmpEnvelopeInput);
    registerInputElement(ampDecayElement, 'input', onAmpEnvelopeInput);
    registerInputElement(ampSustainElement, 'input', onAmpEnvelopeInput);
    registerInputElement(ampReleaseElement, 'input', onAmpEnvelopeInput);
    registerInputElement(filterAttackElement, 'input', onFilterEnvelopeInput);
    registerInputElement(filterDecayElement, 'input', onFilterEnvelopeInput);
    registerInputElement(filterSustainElement, 'input', onFilterEnvelopeInput);
    registerInputElement(filterReleaseElement, 'input', onFilterEnvelopeInput);
    registerInputElement(octaveIncreaseElement, 'click', onOctaveIncreaseInput);
    registerInputElement(octaveDecreaseElement, 'click', onOctaveDecreaseInput);
    window.addEventListener('blur', (e) => {
        // keyboard.clearAllNotes(synth)
    });
};
export { documentInit };
