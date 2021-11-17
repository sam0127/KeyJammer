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
  console.log(e);
  console.log(e.velocity)
  let frequency = frequencyTable[e.note.octave][e.note.name]
  console.log(frequency)
  oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity))
  console.log(oscMap)
}

function onNoteOff(e) {
  console.log(e);
  var osc = oscMap.get(e.note.name + e.note.octave)
  osc.stop();
  oscMap.delete(e.note.name + e.note.octave)
}

function onPitchBend(e) {
  console.log(e)
  //bend range in cents
  let bendRange = 200
  let bendValue = e.value

  for(let [key, value] of oscMap) {
    value.detune.setValueAtTime(bendRange*bendValue, audioContext.currentTime)
  }
}
