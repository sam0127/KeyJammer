import { Midi } from "./Midi.js";
import { interfaceInit } from "./interface.js";

const midi = new Midi();
await midi.init();

interfaceInit(midi);

