function AudioSetup() {
  volSlider.addEventListener("change", changeVolume, false);
  mainGainNode = audioContext.createGain();
  mainGainNode.connect(audioContext.destination);
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(volSlider.value * 100) + "%";
}

function changeVolume(event) {
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(volSlider.value * 100) + "%";
}

function playWave(frequency, velocity) {
  let osc = audioContext.createOscillator();
  let velocityGainNode =audioContext.createGain();
  velocityGainNode.connect(mainGainNode);
  velocityGainNode.gain.value = velocity;
  osc.connect(velocityGainNode);
  osc.type = "sine";
  osc.frequency.value = frequency;
  osc.start();
  return osc;
}

function onNoteOn(e) { //TODO: some notes aren't created
  let frequency = frequencyTable[e.note.octave][e.note.name];
  if(susMap.get(e.note.name + e.note.octave) === undefined) {
    oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity));
  } else {
    //susMap.get(e.note.name + e.note.octave).stop()
    //susMap.delete(e.note.name + e.note.octave)
    oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity));
  }

  console.log("oscMap: " + oscMap.size);

}

//TODO: Fix sustain issue
function onNoteOff(e) {
  console.log(e);
  var osc = oscMap.get(e.note.name + e.note.octave);
  if(sustain) {
    if(susMap.get(e.note.name + e.note.octave) === undefined) {
      susMap.set(e.note.name + e.note.octave, osc);
    }
  } else {
    console.log("stopping "+ e.note.name + e.note.octave);
    console.log(osc);
    osc.stop();
  }
  oscMap.delete(e.note.name + e.note.octave);

  console.log("oscMap: "+ oscMap.size);

  console.log("susMap: "+susMap.size);
}

function onPitchBend(e) {
  console.log(e);
  //bend range in cents (1/100*half-step)
  let bendRange = 200; //TODO: add pitchbend range customizability
  let bendValue = e.value;

  for(let [key, value] of oscMap) {
    value.detune.setValueAtTime(bendRange*bendValue, audioContext.currentTime);
  }
}

function onControlChange(e) {
  console.log(e);
  if(e.controller.name == 'holdpedal') {
    //sustain on
    if(e.value == 127) {
      sustain = true;

    } else { //sustain off
      sustain = false;
      for(let [key, value] of susMap) {
        console.log("stopping " + key);
        console.log(value);
        value.stop();
      }
      susMap.clear();
      console.log("susMap: " + susMap.size);
    }
  }
}


