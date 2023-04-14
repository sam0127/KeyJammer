export class Midi {
    midiAccess: MIDIAccess;

    constructor() {
        navigator.requestMIDIAccess()
            .then((midiAccess: any) => {
                this.midiAccess = midiAccess;
            }, () => {
                console.log("error");
            });
    }
}