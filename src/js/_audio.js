function AudioSetup() {
  volSlider.addEventListener("input", changeVolume, false);
  mainGainNode = audioContext.createGain();
  mainGainNode.connect(audioContext.destination);
  mainGainNode.gain.value = volSlider.value;
  volValue.innerHTML = Math.round(volSlider.value * 100);

  waveSlider.addEventListener("input", changeWaveform, false);

  ampEnvAttackSlider.addEventListener("input", changeAmpAttack, false);
  ampEnvDecaySlider.addEventListener("input", changeAmpDecay, false);
  ampEnvSustainSlider.addEventListener("input", changeAmpSustain, false);
  ampEnvReleaseSlider.addEventListener("input", changeAmpRelease, false);

  filterEnvAttackSlider.addEventListener("input", changeFilterAttack, false);
  filterEnvDecaySlider.addEventListener("input", changeFilterDecay, false);
  filterEnvSustainSlider.addEventListener("input", changeFilterSustain, false);
  filterEnvReleaseSlider.addEventListener("input", changeFilterRelease, false);
}

function playWave(frequency, velocity) {
  //var osc = audioContext.createOscillator();
  //var velocityGainNode = audioContext.createGain();
  var note = {oscNode: audioContext.createOscillator(), gainNode: audioContext.createGain()};
  note.gainNode.connect(mainGainNode);
  note.gainNode.gain.value = 0;
  note.oscNode.connect(note.gainNode);
  note.oscNode.type = waveformType;
  note.oscNode.frequency.value = frequency;
  if(detuneValue !== 0){
    note.oscNode.detune.setValueAtTime(detuneRange*detuneValue, audioContext.currentTime);
  }
  note.oscNode.start();
  ampEnvelopeOn(note.gainNode, velocity);
  console.log(note.oscNode);
  return note;
}

function ampEnvelopeOn(gainNode, velocity) {
  var now = audioContext.currentTime;
  console.log(ampEnvelope);

  gainNode.gain.cancelScheduledValues(0);
  gainNode.gain.setValueAtTime(0,now);
  console.log(now + ampEnvelope.attack);
  gainNode.gain.linearRampToValueAtTime(velocity, now+parseFloat(ampEnvelope.attack));
  gainNode.gain.linearRampToValueAtTime(velocity*ampEnvelope.sustain,
    now + parseFloat(ampEnvelope.attack)+parseFloat(ampEnvelope.decay));
}

function ampEnvelopeOff(note) {
  var now = audioContext.currentTime;
  note.gainNode.gain.cancelScheduledValues(0);
  note.gainNode.gain.setValueAtTime(note.gainNode.gain.value, now);
  note.gainNode.gain.linearRampToValueAtTime(0,now+parseFloat(ampEnvelope.release));
  note.oscNode.stop(now+parseFloat(ampEnvelope.release));
}

function onNoteOn(e) {
  console.log(e);
  var frequency = frequencyTable[e.note.octave][e.note.name];
  oscMap.set(e.note.name + e.note.octave, playWave(frequency, e.velocity));
}

function onNoteOff(e) {
  console.log(e);
  var note = oscMap.get(e.note.name + e.note.octave);
  if(sustain) {
    susSet.add(note);
  } else {
    //note.oscNode.stop();
    ampEnvelopeOff(note);
  }
  oscMap.delete(e.note.name + e.note.octave);
}

function onPitchBend(e) {
  console.log(e);
  //bend range in cents
  detuneValue = e.value; //TODO: add bendrange customization

  for(var [key, value] of oscMap) {
    value.oscNode.detune.setValueAtTime(detuneRange*detuneValue, audioContext.currentTime);
  }
  for(var value of susSet) {
    value.oscNode.detune.setValueAtTime(detuneRange*detuneValue, audioContext.currentTime);
  }
}

function onControlChange(e) {
  if(e.controller.name == 'holdpedal') {
    if(sustain) {
      sustain = false;
      for(var value of susSet) {
        console.log("stopping: " + value);
        ampEnvelopeOff(value);
        //value.stop();
      }
      susSet.clear();
    } else {
      sustain = true;
    }
  } else {

  }
}
