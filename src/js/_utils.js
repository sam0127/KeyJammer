//Applies cubic curve to envelope input values,
//to increase control in lower ranges
function sliderInputMap(x) {
  return (0.01 * x ** 3);
}


function mapMidiToRange(value, base = 127.0, min = 0, max = 1) {
  return (value / base) * (max - min);
}
