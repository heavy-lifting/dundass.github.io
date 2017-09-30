function BreathingEye() {
  //state
  this.rotateFactor = 250;  // map to mouseX
}

BreathingEye.prototype.render = function() {
  // 1536 * 769
  var t = millis() * 0.0005;
  var sin1 = (width / 10) * Math.sin(t - 90) + (width / 10);
  var sin2 = (width / 15) * Math.sin(t + 160) + (width / 15);

  push();
  translate(width / 2, height / 2);
  noStroke();
  //fill(255,10);
  //rect(0,0,1000,1000);
  rotate(t * this.rotateFactor);
  // if(mouseIsPressed) {
  //   fill(255, 30, 30, 50);
  //   ellipse(mouseX, 50, 100, 100);
  // }
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
