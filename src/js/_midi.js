//Initializes WebMidi.js
function MIDISetup() {
  WebMidi.enable(function (err) {

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
    }

    //For each detected MIDI input, add a corresponding button to the dropdown
    MIDIInputs = WebMidi.inputs;
    for(var i = 0; i < MIDIInputs.length; i++) {
      console.log("Adding input button: " +MIDIInputs[i].name);
      addInputButton(MIDIInputs[i].name, i);
    }
  });
}

//Attaches MIDI message handlers to selected input
function addListeners(input) {
  input.addListener('noteon', "all", onNoteOn);
  input.addListener('noteoff', "all", onNoteOff);
  input.addListener('pitchbend', "all", onPitchBend);
  input.addListener('controlchange', "all", onControlChange);
}

//Removes MIDI message handlers from input
function removeListeners(input) {
  input.removeListener('noteon');
  input.removeListener('noteoff');
  input.removeListener('pitchbend');
  input.removeListener('controlchange');
}

//if input is chosen, add MIDI message handlers
function chooseInput(name) {
  for(var i of WebMidi.inputs) {
    removeListeners(i);
  }
  var input = WebMidi.getInputByName(name)
  addListeners(input);
}


//assigns equal tempered frequencies to MIDI notes C0-C9
function populateFreqMap() {
  let freqMap = new Map();
  freqMap.set(12, 16.35);
  freqMap.set(13, 17.32);
  freqMap.set(14, 18.35);
  freqMap.set(15, 19.45);
  freqMap.set(16, 20.60);
  freqMap.set(17, 21.83);
  freqMap.set(18, 23.12);
  freqMap.set(19, 24.50);
  freqMap.set(20, 25.96);
  freqMap.set(21, 27.50);
  freqMap.set(22, 29.14);
  freqMap.set(23, 30.87);
  freqMap.set(24, 32.70);
  freqMap.set(25, 34.65);
  freqMap.set(26, 36.71);
  freqMap.set(27, 38.89);
  freqMap.set(28, 41.20);
  freqMap.set(29, 43.65);
  freqMap.set(30, 46.25);
  freqMap.set(31, 49.00);
  freqMap.set(32, 51.91);
  freqMap.set(33, 55.00);
  freqMap.set(34, 58.27);
  freqMap.set(35, 61.74);
  freqMap.set(36, 65.41);
  freqMap.set(37, 69.30);
  freqMap.set(38, 73.42);
  freqMap.set(39, 77.78);
  freqMap.set(40, 82.41);
  freqMap.set(41, 87.31);
  freqMap.set(42, 92.50);
  freqMap.set(43, 98.00);
  freqMap.set(44, 103.83);
  freqMap.set(45, 110.00);
  freqMap.set(46, 116.54);
  freqMap.set(47, 123.47);
  freqMap.set(48, 130.81);
  freqMap.set(49, 138.59);
  freqMap.set(50, 146.83);
  freqMap.set(51, 155.56);
  freqMap.set(52, 164.81);
  freqMap.set(53, 174.61);
  freqMap.set(54, 185.00);
  freqMap.set(55, 196.00);
  freqMap.set(56, 207.65);
  freqMap.set(57, 220.00);
  freqMap.set(58, 233.08);
  freqMap.set(59, 246.94);
  freqMap.set(60, 261.63);
  freqMap.set(61, 277.18);
  freqMap.set(62, 293.66);
  freqMap.set(63, 311.13);
  freqMap.set(64, 329.63);
  freqMap.set(65, 349.23);
  freqMap.set(66, 369.99);
  freqMap.set(67, 392.00);
  freqMap.set(68, 415.30);
  freqMap.set(69, 440.00);
  freqMap.set(70, 466.16);
  freqMap.set(71, 493.88);
  freqMap.set(72, 523.25);
  freqMap.set(73, 554.37);
  freqMap.set(74, 587.33);
  freqMap.set(75, 622.25);
  freqMap.set(76, 659.26);
  freqMap.set(77, 698.46);
  freqMap.set(78, 739.99);
  freqMap.set(79, 783.99);
  freqMap.set(80, 830.61);
  freqMap.set(81, 880.00);
  freqMap.set(82, 932.33);
  freqMap.set(83, 987.77);
  freqMap.set(84, 1046.50);
  freqMap.set(85, 1108.73);
  freqMap.set(86, 1174.66);
  freqMap.set(87, 1244.51);
  freqMap.set(88, 1318.51);
  freqMap.set(89, 1396.91);
  freqMap.set(90, 1479.98);
  freqMap.set(91, 1567.98);
  freqMap.set(92, 1661.22);
  freqMap.set(93, 1760.00);
  freqMap.set(94, 1864.66);
  freqMap.set(95, 1975.53);
  freqMap.set(96, 2093.00);
  freqMap.set(97, 2217.46);
  freqMap.set(98, 2349.32);
  freqMap.set(99, 2489.02);
  freqMap.set(100, 2637.02);
  freqMap.set(101, 2793.83);
  freqMap.set(102, 2959.96);
  freqMap.set(103, 3135.96);
  freqMap.set(104, 3322.44);
  freqMap.set(105, 3520.00);
  freqMap.set(106, 3729.31);
  freqMap.set(107, 3951.07);
  freqMap.set(108, 4186.01);
  freqMap.set(109, 4434.92);
  freqMap.set(110, 4698.64);
  freqMap.set(111, 4978.03);
  freqMap.set(112, 5274.04);
  freqMap.set(113, 5587.65);
  freqMap.set(114, 5919.91);
  freqMap.set(115, 6271.93);
  freqMap.set(116, 6644.88);
  freqMap.set(117, 7040.00);
  freqMap.set(118, 7458.62);
  freqMap.set(119, 7902.13);
  freqMap.set(120, 8372.02);
  return freqMap;
}

