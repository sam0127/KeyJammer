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
