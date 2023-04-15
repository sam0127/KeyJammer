export class Midi {
    public midiAccess: MIDIAccess;
    input: MIDIInput;

    public async init() {
        await navigator.requestMIDIAccess()
            .then((midiAccess: any) => {
                this.midiAccess = midiAccess;
                console.log("WebMidi Initialized");
            }, () => {
                console.log("error");
            });
    }

    public getAvailableInputs() {
        return this.midiAccess.inputs;
    }
}