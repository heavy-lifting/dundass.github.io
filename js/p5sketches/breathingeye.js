function BreathingEye() {
  //state
}

BreathingEye.prototype.render = function() {
  var c1, c2, c3;

  var t = millis() * 0.0005;
  var sin1 = 150 * Math.sin(t - 90) + 150;
  var sin2 = 100 * Math.sin(t + 160) + 100;

  push();
  translate(width / 2, height / 2);
  noStroke();
  //fill(255,10);
  //rect(0,0,1000,1000);
  rotate(t * 250);
  if(mouseIsPressed) {
    fill(255, 30, 30, 50);
    ellipse(mouseX, 50, 100, 100);
  }
  fill(sin1, sin2, 255 - sin1, 100);
  ellipse(sin2 + 20, sin1, 10, sin1);

  // if(c1 > 0) {
  // 	fill(300 - c1, 0, 0, 100);
  // 	ellipse(200 - c1, 200 - c1, 100 - c1 / 2, 100 - c1 / 2);
  //   c1 -= 2;
  // }
  //
  // if(c2 > 0) {
  // 	fill(40, 40, 255 - c2, 100);
  // 	ellipse(-c2 * 2 - 500, -c2, c2 / 5, c2 * 3);
  //   c2 -= 1;
  // }
  //
  // if(c3 > 0) {
  // 	fill(40, 255 - c3, 40, 100);
  // 	ellipse(-c3 - 500, 0, c3 * 2, 5);
  //   c3 -= 1;
  // }

  if(sin1 > 150) {
    fill(sin1, sin2, 255 - sin1, 100);
    ellipse(sin2 + 80, sin1, (sin1 - 150) * 0.66, (sin1 - 150) * 0.66);
    fill(0, 10);
    rect(0, 0, width, height);
  }
  pop();
}
