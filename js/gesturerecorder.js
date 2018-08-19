
let gesturePoints = [], recording = false, wobbleMax = 1, wobble = {x: 0, y: 0}, currentMouse = {x: 0, y: 0}, currentPoint = 0, midi = null;
let canvas = document.getElementsByTagName("canvas")[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

window.onmousedown = (e) => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  gesturePoints = [];
  recording = true;
  currentMouse.x = e.pageX;
  currentMouse.y = e.pageY;
}

window.onmouseup = () => {
  recording = false;
}

window.onmousemove = (e) => {
  if(recording) {
    currentMouse.x = e.clientX; // pageX, screenX ?
    currentMouse.y = e.clientY;
  }
}

const rand = (a, b) => {
  return Math.random()*(b-a)+a;
}

const timer = setInterval(() => {
  // loop thru each gesture point and check if it's time is here then draw to the canvas / output via midi/osc/socket
  let d = new Date();
  let now = d.getTime();
  if(recording) {
    gesturePoints.push( {x: currentMouse.x, y: currentMouse.y} );
  } else if(gesturePoints.length > 0) {
    currentPoint = (currentPoint + 1) % gesturePoints.length;
    if(currentPoint > 0) {
      ctx.beginPath();
      ctx.moveTo(gesturePoints[currentPoint - 1].x + wobble.x, gesturePoints[currentPoint - 1].y + wobble.y);
      wobble.x += rand(-wobbleMax, wobbleMax);
      wobble.y += rand(-wobbleMax, wobbleMax);
      ctx.lineTo(gesturePoints[currentPoint].x + wobble.x, gesturePoints[currentPoint].y + wobble.y);
      ctx.stroke();
      if(midi) sendNoteOn(midi, "output-1", 48+(gesturePoints[currentPoint].y + wobble.y)*60/window.innerHeight, 127, gesturePoints[currentPoint].x/500 + wobble.x);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}, 1);  // auto choose lowest interval for browser

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );

function listInputsAndOutputs( midiAccess ) {
  for (var entry of midiAccess.inputs) {
    var input = entry[1];
    console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'" );
  }

  for (var entry of midiAccess.outputs) {
    var output = entry[1];
    console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'" );
      console.log(output.id);
    sendNoteOn(midiAccess, output.id, 60, 127, 1000);
  }
}

const sendNoteOn = (midiAccess, portID, note, vel, leng) => {
  note = note || 60;
  vel = vel || 127;
  let noteOnMessage = [0x90, note, vel];
  let output = midiAccess.outputs.get(portID);
  output.send(noteOnMessage);
  if(leng) sendNoteOff(midiAccess, portID, note, leng);
}

const sendNoteOff = (midiAccess, portID, note, delay) => {
  note = note || 60;
  delay = delay || 0;
  let noteOffMessage = [0x80, note, 0x40];
  let output = midiAccess.outputs.get(portID);
  output.send(noteOffMessage, delay);
}
