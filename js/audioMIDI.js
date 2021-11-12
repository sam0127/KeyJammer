function midiDeviceDropdown() {
  var dropbtn = document.getElementById("dropdown-button-id")
  var dropContent = document.getElementById("device-list")
  console.log(dropbtn)
  if(dropbtn.classList.contains("button-open")) {
    dropbtn.classList.remove("button-open")
    dropContent.classList.remove("dropdown-open")

  } else {
    dropbtn.classList.add("button-open")
    dropContent.classList.add("dropdown-open")
  }
}

function addInputButton(name, index){
  var buttonID = "input-device-"+index
  var newButton = document.createElement("button")
  newButton.id = buttonID
  newButton.classList.add("midi-device-selector")
  newButton.addEventListener("click", function() {
    var button = document.getElementById(buttonID)
    for(var el of document.getElementsByClassName("selected"))
    {
      el.classList.remove("selected")
    }
    button.classList.add("selected")
    chooseInput(name)
    document.getElementById("dropdown-button-id").innerHTML = name + ' <i class="dropdown-icon"></i>'
  })
  newButton.appendChild(document.createTextNode(name))
  document.getElementById("device-list").appendChild(newButton)
}

function addListeners(input) {
  input.addListener('noteon', "all", onNoteOn)
  input.addListener('noteoff', "all", onNoteOff)
  input.addListener('pitchbend', "all", onPitchBend)
  input.addListener('controlchange', "all", onControlChange)
  input.addListener('programchange', "all", function (e) {console.log(e)})
  input.addListener('channelaftertouch', "all", function (e) {console.log(e)})
  input.addListener('keyaftertouch', "all", function (e) {console.log(e)})
  //input.addListener('midimessage', "all", onMidiMessage)
}

function removeListeners(input) {
  input.removeListener('noteon')
  input.removeListener('noteoff')
  input.removeListener('pitchbend')
}

function chooseInput(name) {
  for(var i of WebMidi.inputs) {
    removeListeners(i)
  }
  let input = WebMidi.getInputByName(name)
  addListeners(input)
}

function changeVolume(event) {
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(volSlider.value * 100) + "%"
}

function AudioSetup() {
  volSlider.addEventListener("change", changeVolume, false)
  mainGainNode = audioContext.createGain()
  mainGainNode.connect(audioContext.destination)
  mainGainNode.gain.value = volSlider.value
  volValue.innerHTML = Math.round(volSlider.value * 100) + "%"
}

function MIDISetup() {
  WebMidi.enable(function (err) {

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
    }

    MIDIInputs = WebMidi.inputs
    for(var i = 0; i < MIDIInputs.length; i++) {
      console.log("Adding input button: " +MIDIInputs[i].name)
      addInputButton(MIDIInputs[i].name, i)
    }
  });
}


//MIDI Functions

function playWave(frequency, velocity) {
  let osc = audioContext.createOscillator()
  let velocityGainNode =audioContext.createGain()
  velocityGainNode.connect(mainGainNode)
  velocityGainNode.gain.value = velocity
  osc.connect(velocityGainNode)
  osc.type = "sine"
  osc.frequency.value = frequency
  osc.start()
  return osc
}

function onNoteOn(e) {
  let frequency = frequencyTable[e.note.octave][e.note.name]
  if(susMap.get(e.note.name + e.note.octave) === undefined) {
    oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity))
  } else {
    //susMap.get(e.note.name + e.note.octave).stop()
    //susMap.delete(e.note.name + e.note.octave)
    oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity))
  }

  console.log("oscMap: " + oscMap.size)

}

function onNoteOff(e) {
  console.log(e);
  var osc = oscMap.get(e.note.name + e.note.octave)
  if(sustain) {
    if(susMap.get(e.note.name + e.note.octave) === undefined) {
      susMap.set(e.note.name + e.note.octave, osc)
    }
  } else {
    console.log("stopping "+ e.note.name + e.note.octave)
    console.log(osc)
    osc.stop();
  }
  oscMap.delete(e.note.name + e.note.octave)

  console.log("oscMap: "+ oscMap.size);

  console.log("susMap: "+susMap.size);
}

function onPitchBend(e) {
  console.log(e)
  //bend range in cents (1/100*half-step)
  let bendRange = 200 //TODO: add pitchbend range customizability
  let bendValue = e.value

  for(let [key, value] of oscMap) {
    value.detune.setValueAtTime(bendRange*bendValue, audioContext.currentTime)
  }
}

function onControlChange(e) {
  console.log(e)
  if(e.controller.name == 'holdpedal') {
    //sustain on
    if(e.value == 127) {
      sustain = true

    } else { //sustain off
      sustain = false
      for(let [key, value] of susMap) {
        console.log("stopping " + key)
        console.log(value)
        value.stop()
      }
      susMap.clear()
      console.log("susMap: " + susMap.size)
    }
  }
}

function onMidiMessage(e) {
  console.log(e)
}

let audioContext = new (window.AudioContext || window.webkitAudioContext)()
let oscMap = new Map()
let susMap = new Map()
let mainGainNode = null
let volSlider = document.getElementById("volume-slider")
let volValue = document.getElementById("volume-value")
let frequencyTable = getNoteFreqTable()
let sustain = false
AudioSetup()
MIDISetup()


function getNoteFreqTable() {
  let table = [];
  for(var i=0; i < 10; i++){
    table[i] = [];
  }
  table[0]["C"] = 16.35
  table[0]["C#"] = 17.32
  table[0]["D"] = 18.35
  table[0]["D#"] = 19.45
  table[0]["E"] = 20.60
  table[0]["F"] = 21.83
  table[0]["F#"] = 23.12
  table[0]["G"] = 24.50
  table[0]["G#"] = 25.96
  table[0]["A"] = 27.50
  table[0]["A#"] = 29.14
  table[0]["B"] = 30.87
  table[1]["C"] = 32.70
  table[1]["C#"] = 34.65
  table[1]["D"] = 36.71
  table[1]["D#"] = 38.89
  table[1]["E"] = 41.20
  table[1]["F"] = 43.65
  table[1]["F#"] = 46.25
  table[1]["G"] = 49.00
  table[1]["G#"] = 51.91
  table[1]["A"] = 55.00
  table[1]["A#"] = 58.27
  table[1]["B"] = 61.74
  table[2]["C"] = 65.41
  table[2]["C#"] = 69.30
  table[2]["D"] = 73.42
  table[2]["D#"] = 77.78
  table[2]["E"] = 82.41
  table[2]["F"] = 87.31
  table[2]["F#"] = 92.50
  table[2]["G"] = 98.00
  table[2]["G#"] = 103.83
  table[2]["A"] = 110.00
  table[2]["A#"] = 116.54
  table[2]["B"] = 123.47
  table[3]["C"] = 130.81
  table[3]["C#"] = 138.59
  table[3]["D"] = 146.83
  table[3]["D#"] = 155.56
  table[3]["E"] = 164.81
  table[3]["F"] = 174.61
  table[3]["F#"] = 185.00
  table[3]["G"] = 196.00
  table[3]["G#"] = 207.65
  table[3]["A"] = 220.00
  table[3]["A#"] = 233.08
  table[3]["B"] = 246.94
  table[4]["C"] = 261.63
  table[4]["C#"] = 277.18
  table[4]["D"] = 293.66
  table[4]["D#"] = 311.13
  table[4]["E"] = 329.63
  table[4]["F"] = 349.23
  table[4]["F#"] = 369.99
  table[4]["G"] = 392.00
  table[4]["G#"] = 415.30
  table[4]["A"] = 440.00
  table[4]["A#"] = 466.16
  table[4]["B"] = 493.88
  table[5]["C"] = 523.25
  table[5]["C#"] = 554.37
  table[5]["D"] = 587.33
  table[5]["D#"] = 622.25
  table[5]["E"] = 659.26
  table[5]["F"] = 698.46
  table[5]["F#"] = 739.99
  table[5]["G"] = 783.99
  table[5]["G#"] = 830.61
  table[5]["A"] = 880.00
  table[5]["A#"] = 932.33
  table[5]["B"] = 987.77
  table[6]["C"] = 1046.50
  table[6]["C#"] = 1108.73
  table[6]["D"] = 1174.66
  table[6]["D#"] = 1244.51
  table[6]["E"] = 1318.51
  table[6]["F"] = 1396.91
  table[6]["F#"] = 1479.98
  table[6]["G"] = 1567.98
  table[6]["G#"] = 1661.22
  table[6]["A"] = 1760.00
  table[6]["A#"] = 1864.66
  table[6]["B"] = 1975.53
  table[7]["C"] = 2093.00
  table[7]["C#"] = 2217.46
  table[7]["D"] = 2349.32
  table[7]["D#"] = 2489.02
  table[7]["E"] = 2637.02
  table[7]["F"] = 2793.83
  table[7]["F#"] = 2959.96
  table[7]["G"] = 3135.96
  table[7]["G#"] = 3322.44
  table[7]["A"] = 3520.00
  table[7]["A#"] = 3729.31
  table[7]["B"] = 3951.07
  table[8]["C"] = 4186.01
  table[8]["C#"] = 4434.92
  table[8]["D"] = 4698.64
  table[8]["D#"] = 4978.03
  table[8]["E"] = 5274.04
  table[8]["F"] = 5587.65
  table[8]["F#"] = 5919.91
  table[8]["G"] = 6271.93
  table[8]["G#"] = 6644.88
  table[8]["A"] = 7040.00
  table[8]["A#"] = 7458.62
  table[8]["B"] = 7902.13
  table[9]["C"] = 8372.02
  return table
}
