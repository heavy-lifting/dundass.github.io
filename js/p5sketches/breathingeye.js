function BreathingEye() {
  //state
  this.rotateFactor = 250;  // map to mouseX
}

BreathingEye.prototype.render = function() {
  // 1536 * 769
  var t = millis() * 0.0005;
  var sin1 = (width / 10) * sin(t - 90) + (width / 10);
  var sin2 = (width / 15) * sin(t + 160) + (width / 15);

  if(mouseIsPressed) {
    this.rotateFactor = 50.0 + mouseY / 5.0;
  }

  push();
  translate(width / 2, height / 2);
  noStroke();
  rotate(t * this.rotateFactor);
  fill(sin1, sin2, 255 - sin1, 100);
  ellipse(sin2 + 20, sin1, 10, sin1);

  if(sin1 > (width / 10)) {
    fill(sin1, sin2, 255 - sin1, 100);
    ellipse(sin2 + (width / 20), sin1, (sin1 - (width / 10)) * 0.66, (sin1 - (width / 10)) * 0.66);
    fill(0, 10);
    rect(0, 0, width, height);
  }
  pop();

}
