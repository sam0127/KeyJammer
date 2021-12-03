//Connects main gain node to audioCtx destination, sets initial display values,
//attaches eventListeners
function AudioSetup() {
  //create main gain node and attach to destination
  mainGainNode = audioContext.createGain();
  mainGainNode.connect(audioContext.destination);
  mainGainNode.gain.value = volSlider.value;

  //set initial display values
  volValue.innerHTML = Math.round(volSlider.value * 100);
  pitchbendValue.innerHTML = Math.round(pitchbendSlider.value / 100.0);

  //attach slider event listeners
  volSlider.addEventListener("input", changeVolume, false);
  waveSlider.addEventListener("input", changeWaveform, false);
  pitchbendSlider.addEventListener("input", changePitchbend, false);

  filterModeRadios.forEach(
    radio => radio.addEventListener("change", changeFilterMode, false)
  );
  filterCutoffSlider.addEventListener("input", changeFilterCutoff, false);

  ampEnvAttackSlider.addEventListener("input", changeAmpAttack, false);
  ampEnvDecaySlider.addEventListener("input", changeAmpDecay, false);
  ampEnvSustainSlider.addEventListener("input", changeAmpSustain, false);
  ampEnvReleaseSlider.addEventListener("input", changeAmpRelease, false);

  filterEnvAttackSlider.addEventListener("input", changeFilterAttack, false);
  filterEnvDecaySlider.addEventListener("input", changeFilterDecay, false);
  filterEnvSustainSlider.addEventListener("input", changeFilterSustain, false);
  filterEnvReleaseSlider.addEventListener("input", changeFilterRelease, false);
}


//Creates oscillator, attaches new individual gain node, sets osc frequency,
//starts wave and applies envelope
function playWave(frequency, velocity) {
  //note object containing oscillator and its gain node
  var note = {
    oscNode: audioContext.createOscillator(),
    gainNode: audioContext.createGain(),
    filterNode: audioContext.createBiquadFilter()
  };

  //connect nodes
  //An individual note has the following structure:
  // _______   ________   __________
  // | OSC |-->| GAIN |-->| FILTER |
  // -------   --------   ----------
  // Each notes final FILTER node connects to the mainGainNode
  note.filterNode.connect(mainGainNode);
  note.gainNode.connect(note.filterNode);
  note.oscNode.connect(note.gainNode);

  //set node attributes
  note.oscNode.type = waveformType;
  note.oscNode.frequency.value = frequency;

  note.gainNode.gain.value = 0;
  note.filterNode.frequency.value = 0;
  note.filterNode.type = filterMode;


  if(detuneValue !== 0){
    note.oscNode.detune.setValueAtTime(
      detuneRange*detuneValue,
      audioContext.currentTime
    );
  }

  //start oscillator and envelope
  note.oscNode.start();
  envelopeOn(note, velocity);
  console.log("Base Latency: " + audioContext.baseLatency);
  console.log("Output Latency: " + audioContext.outputLatency);
  return note;
}

//Generates amplitude and filter envelope
function envelopeOn(note, velocity) {
  var now = audioContext.currentTime;

  //ramp up amplitude to velocity for attack duration,
  //ramp down amplitude to sustain value for decay duration
  console.log(note.gainNode);
  note.gainNode.gain.cancelScheduledValues(0);
  note.gainNode.gain.setValueAtTime(0,now);

  note.gainNode.gain.linearRampToValueAtTime(
    velocity,
    now + parseFloat(ampEnvelope.attack)
  );

  note.gainNode.gain.linearRampToValueAtTime(
    velocity * ampEnvelope.sustain,
    now + parseFloat(ampEnvelope.attack) + parseFloat(ampEnvelope.decay)
  );

  //ramp up frequency to cutoff for attack duration,
  //ramp down frequency to sustain value for decay duration
  note.filterNode.frequency.cancelScheduledValues(0);
  note.filterNode.frequency.setValueAtTime(0,now);

  note.filterNode.frequency.linearRampToValueAtTime(
    filterCutoff,
    now + parseFloat(filterEnvelope.attack)
  );

  note.filterNode.frequency.linearRampToValueAtTime(
    filterCutoff * filterEnvelope.sustain,
    now + parseFloat(filterEnvelope.attack) + parseFloat(filterEnvelope.decay)
  );
}

//Generates amplitude envelope for closed gate
function envelopeOff(note) {
  var now = audioContext.currentTime;

  //ramp sutain amplitude down to 0, then stop
  note.gainNode.gain.cancelScheduledValues(0);
  note.gainNode.gain.setValueAtTime(note.gainNode.gain.value, now);
  note.gainNode.gain.linearRampToValueAtTime(
    0,
    now + parseFloat(ampEnvelope.release)
  );

  //ramp sutain frequency down to 0, then stop
  note.filterNode.frequency.cancelScheduledValues(0);
  note.filterNode.frequency.setValueAtTime(
    note.filterNode.frequency.value,
    now
  );
  note.filterNode.frequency.linearRampToValueAtTime(
    0,
    now + parseFloat(filterEnvelope.release)
  );

  note.oscNode.stop(now+parseFloat(ampEnvelope.release));
}

//MIDI noteon event handler
function onNoteOn(e) {
  //get note's corresponding frequency, start oscillator and add to map
  console.log(e);
  var name = e.data[1];
  var frequency = frequencyMap.get(name);
  oscMap.set(name, playWave(frequency, e.velocity));
}

//MIDI noteoff event handler
function onNoteOff(e) {
  var note = oscMap.get(e.data[1]);

  //if sustain pedal is held, add to susSet (sustained notes set)
  //else, begin envelope release
  if(sustain) {
    susSet.add(note);
  } else {
    envelopeOff(note);
  }
  oscMap.delete(e.note.name + e.note.octave);
}

//MIDI pitchbend event handler
function onPitchBend(e) {
  console.log(e);
  detuneValue = e.value;

  //for each oscillator currently playing, detune appropriately
  for(var [key, value] of oscMap) {
    value.oscNode.detune.setValueAtTime(
      detuneRange*detuneValue,
      audioContext.currentTime
    );
  }
  for(var value of susSet) {
    value.oscNode.detune.setValueAtTime(
      detuneRange*detuneValue,
      audioContext.currentTime
    );
  }
}

//MIDI controlchange event handler
function onControlChange(e) {
  console.log(e);
  //sustain pedal
  console.log(e.controller.name);
  switch(e.controller.name) {
    case 'holdpedal':
      //switch sustain states, sustained notes are released
      if(sustain) {
        sustain = false;
        for(var value of susSet) {
          envelopeOff(value);
        }
        susSet.clear();
      } else {
        sustain = true;
      }
      break;
    case 'volumecoarse':
      var val = mapMidiToRange(e.rawValue);
      mainGainNode.gain.value = val;
      volSlider.value = val;
      volValue.innerHTML = Math.round(volSlider.value*100);
      break;
    case 'brightness':
      var val = mapMidiToRange(e.rawValue, 127.0, 20, 20000);
      filterCutoff = val;
      filterCutoffSlider.value = val;
      break;
    case 'generalpurposeslider1': //AMP attack
      var val = sliderInputMap(mapMidiToRange(e.rawValue, 127.0, 0, 10));
      ampEnvelope.attack = val;
      console.log(ampEnvelope.attack);
      ampEnvAttackSlider.value = val;
      break;
    case 'generalpurposeslider2': //AMP decay
      var val = sliderInputMap(mapMidiToRange(e.rawValue, 127.0, 0, 10));
      ampEnvelope.decay = val;
      ampEnvDecaySlider.value = val;
      break;
    case 'generalpurposeslider3': //AMP sustain
      var val = mapMidiToRange(e.rawValue, 127.0, 0, 1);
      ampEnvelope.sustain = val;
      ampEnvSustainSlider.value = val;
      break;
    case 'generalpurposeslider4': //AMP release
      var val = sliderInputMap(mapMidiToRange(e.rawValue, 127.0, 0, 10));
      ampEnvelope.release = val;
      ampEnvReleaseSlider.value = val;
      break;
    case 'soundcontrol6': //filter attack
      var val = sliderInputMap(mapMidiToRange(e.rawValue, 127.0, 0, 10));
      filterEnvelope.attack = val;
      filterEnvAttackSlider.value = val;
      break;
    case 'soundcontrol7': //filter decay
      var val = sliderInputMap(mapMidiToRange(e.rawValue, 127.0, 0, 10));
      filterEnvelope.decay = val;
      filterEnvDecaySlider.value = val;
      break;
    case 'soundcontrol8': //filter sustain
      var val = mapMidiToRange(e.rawValue, 127.0, 0, 1);
      filterEnvelope.sustain = val;
      filterEnvSustainSlider.value = val;
      break;
    case 'soundcontrol9': //filter release
      var val = sliderInputMap(mapMidiToRange(e.rawValue, 127.0, 0, 10));
      filterEnvelope.release = val;
      filterEnvReleaseSlider.value = val;
      break;
    case 'generalpurposebutton3':
      filterMode = 'lowpass';
      document.getElementById("low-pass-selector").checked = true;
      break;
    case 'generalpurposebutton4':
      filterMode = 'highpass';
      document.getElementById("high-pass-selector").checked = true;
      break;
  }
}
