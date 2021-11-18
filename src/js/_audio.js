function AudioSetup() {
  volSlider.addEventListener("input", changeVolume, false);
  mainGainNode = audioContext.createGain();
  mainGainNode.connect(audioContext.destination);
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(volSlider.value * 100);

  waveSlider.addEventListener("input", changeWaveform, false);
}

function playWave(frequency, velocity) {
  var osc = audioContext.createOscillator();
  var velocityGainNode =audioContext.createGain();
  velocityGainNode.connect(mainGainNode);
  velocityGainNode.gain.value = velocity;
  osc.connect(velocityGainNode);
  osc.type = waveformType;
  osc.frequency.value = frequency;
  osc.start();
  console.log(osc);
  return osc;
}

function onNoteOn(e) {
  console.log(e);
  var frequency = frequencyTable[e.note.octave][e.note.name];
  oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity));
  console.log(oscMap);
}

function onNoteOff(e) {
  console.log(e);
  var osc = oscMap.get(e.note.name + e.note.octave);
  osc.stop();
  oscMap.delete(e.note.name + e.note.octave);
}

function onPitchBend(e) {
  console.log(e);
  //bend range in cents
  var bendRange = 200;
  var bendValue = e.value;

  for(var [key, value] of oscMap) {
    value.detune.setValueAtTime(bendRange*bendValue, audioContext.currentTime);
  }
}
