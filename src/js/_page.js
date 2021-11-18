let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscMap = new Map();
let susSet = new Set();
let mainGainNode = null;
let volSlider = document.getElementById("volume-slider");
let volValue = document.getElementById("volume-value");
let waveSlider = document.getElementById("wave-slider");
let frequencyTable = getNoteFreqTable();
var sustain = false;
var waveformType = "sine";
AudioSetup();
MIDISetup();

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

function addInputButton(name, index){
  var buttonID = "input-device-"+index;
  var newButton = document.createElement("button");
  newButton.id = buttonID;
  newButton.classList.add("midi-device-selector");
  newButton.addEventListener("click", function() {
    var button = document.getElementById(buttonID);
    for(var el of document.getElementsByClassName("selected"))
    {
      el.classList.remove("selected");
    }
    button.classList.add("selected");
    chooseInput(name);
    document.getElementById("dropdown-button-id").innerHTML = name + ' <i class="dropdown-icon"></i>';
  });
  newButton.appendChild(document.createTextNode(name));
  document.getElementById("device-list").appendChild(newButton);
}

function changeVolume() {
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(this.value*100);
}

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
