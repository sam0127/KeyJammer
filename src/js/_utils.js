//Applies cubic curve to envelope input values,
//to increase control in lower ranges
function sliderInputMap(x) {
  return (0.01 * x ** 3);
}


function mapMidiToRange(value, min = 0, max = 1) {
  return (value / 127.0) * (max - min);
}
