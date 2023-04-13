//import { module } from ./module_filename
if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!');
} else {
  console.log('WebMIDI is not supported in this browser.');
}
function hello(compiler: string) {
  console.log(`Hello from ${compiler}`);
  console.log('test');
}
hello("TypeScript");