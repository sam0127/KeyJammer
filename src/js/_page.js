//initialize global variables
//WebAudio API
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let mainGainNode = null;
let ampEnvelopeNode = null;

//structures containing currently playing oscillators
let oscMap = new Map();
let susSet = new Set();

//pull page elements
let volSlider = document.getElementById("volume-slider");
var volValue = document.getElementById("volume-value");
let waveSlider = document.getElementById("wave-slider");
let pitchbendSlider = document.getElementById("pitchbend-slider");
var pitchbendValue = document.getElementById("pitchbend-value-text");

let ampEnvAttackSlider = document.getElementById("amp-env-slider-A");
let ampEnvDecaySlider = document.getElementById("amp-env-slider-D");
let ampEnvSustainSlider = document.getElementById("amp-env-slider-S");
let ampEnvReleaseSlider = document.getElementById("amp-env-slider-R");

let filterEnvAttackSlider = document.getElementById("filter-env-slider-A");
let filterEnvDecaySlider = document.getElementById("filter-env-slider-D");
let filterEnvSustainSlider = document.getElementById("filter-env-slider-S");
let filterEnvReleaseSlider = document.getElementById("filter-env-slider-R");

//initialize frequency table
let frequencyTable = getNoteFreqTable();

//synth state values
var sustain = false;
var detuneValue = 0;
var detuneRange = 200;
var waveformType = "sine";

//envelope objects
var ampEnvelope = {attack: 0, decay: 0, sustain: 0, release: 0};
var filterEnvelope = {attack: 0, decay: 0, sustain: 0, release: 0};

//setup audio and MIDI
AudioSetup();
MIDISetup();

//Populate dropdown with connected MIDI input devices
function addInputButton(name, index){
  var buttonID = "input-device-"+index;
  var newButton = document.createElement("button");

  newButton.id = buttonID;
  newButton.classList.add("midi-device-selector");

  //device selection event handler
  newButton.addEventListener("click", function() {
    var button = document.getElementById(buttonID);
    for(var el of document.getElementsByClassName("selected"))
    {
      el.classList.remove("selected");
    }
    button.classList.add("selected");

    //choose this device as the input device
    chooseInput(name);
    document.getElementById("dropdown-button-id").innerHTML =
      name + ' <i class="dropdown-icon"></i>';
  });
  newButton.appendChild(document.createTextNode(name));
  document.getElementById("device-list").appendChild(newButton);
}


////////UI event handlers
//
//when midi device dropdown button is selected
function midiDeviceDropdown() {
  var dropbtn = document.getElementById("dropdown-button-id");
  var dropContent = document.getElementById("device-list");

  if(dropbtn.classList.contains("button-open")) {
    dropbtn.classList.remove("button-open");
    dropContent.classList.remove("dropdown-open");

  } else {
    dropbtn.classList.add("button-open");
    dropContent.classList.add("dropdown-open");
  }
}

//Volume slider event handler
function changeVolume() {
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(this.value*100);
}

//Waveform slider event handler
function changeWaveform() {
  var waveformNumber = waveSlider.value;
  switch(waveformNumber) {
    case '0':
      waveformType = "sine";
      break;
    case '1':
      waveformType = "square";
      break;
    case '2':
      waveformType = "sawtooth";
      break;
    case '3':
      waveformType = "triangle";
      break;
    case '4':
      //TODO: implement custom wave type
      waveformType = "custom";
      break;
  }
}

//pitchbend range slider event handler
function changePitchbend() {
  detuneRange = pitchbendSlider.value;
  pitchbendValue.innerHTML = Math.round(this.value/100.0);
}

//etc
function changeAmpAttack() {
  ampEnvelope.attack = sliderInputMap(ampEnvAttackSlider.value);
}

function changeAmpDecay() {
  ampEnvelope.decay = sliderInputMap(ampEnvDecaySlider.value);
}

function changeAmpSustain() {
  ampEnvelope.sustain = ampEnvSustainSlider.value;
}

function changeAmpRelease() {
  ampEnvelope.release = sliderInputMap(ampEnvReleaseSlider.value);
}

function changeFilterAttack() {

}

function changeFilterDecay() {

}

function changeFilterSustain() {

}

function changeFilterRelease() {

}

//Applies cubic curve to envelope input values,
//to increase control in lower ranges
function sliderInputMap(x) {
  return (0.01 * x ** 3);
}

