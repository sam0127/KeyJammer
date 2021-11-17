let audioContext = new (window.AudioContext || window.webkitAudioContext)()
let oscMap = new Map()
let mainGainNode = null
let volSlider = document.getElementById("volume-slider")
let volValue = document.getElementById("volume-value")
let frequencyTable = getNoteFreqTable()
AudioSetup()
MIDISetup()

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
