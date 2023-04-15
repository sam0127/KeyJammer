import { Midi } from "./Midi.js";

const interfaceInit = (midi: Midi) => {
    const select = document.getElementById('midi-inputs');
    console.log(midi.getAvailableInputs());

    const createOption = (key: string, value: string) => {
        const option = document.createElement('option');
        option.textContent = value;
        option.value = key;
        option.selected = false;

        select.appendChild(option);
    }

    const populateInputDropdown = () => {
        select.querySelectorAll("option:not(:first-child)").forEach((el) => {
            el.remove();
        });

        midi.getAvailableInputs().forEach((value, key) => {
            createOption(key, value.name);
        });
    }

    const onMidiInputChange = () => {
        populateInputDropdown();
    }

    const onMidiSelect = (e: any) => {
        console.log(e.target.value + " " + e.target.options[e.target.selectedIndex].innerText);
        
    }



    populateInputDropdown();
    midi.midiAccess.onstatechange = onMidiInputChange;
    select.addEventListener('change', onMidiSelect);
}

export { interfaceInit };