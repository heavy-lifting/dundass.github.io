function TouchFoldPoints() {
  this.loc = 0; // loc of center
  this.p = []; // point locs array
  this.trig1 = 0;    //0 = sin, 1 = cos, 2 = tan, 3 = atan
  this.trig2 = 1;
  this.reloadCount = 0; // num times visual has cycled
  this.hue = 150;
  this.sat = 200;
  this.t_mult1 = 0.04;  // trig result reduction
  this.t_mult2 = 0.04;
}

TouchFoldPoints.prototype.update = function() {
	var d = 0, trig = 0, a = 0;
	for(var i = 0; i < this.p.length; i++) {
		for(var j = 0; j < this.p.length; j++) {
			d = dist(this.p[i].x, this.p[i].y, width - this.p[j].x, this.p[j].y);
			if(this.reloadCount % 2 == 0) a = d / this.p[i].y;
			else a = d / this.p[j].y;
			switch(this.trig1) {
  			case 0:  trig = Math.sin(a);  break;
  			case 1:  trig = Math.cos(a);  break;
  			case 2:  trig = Math.tan(a);  break;
  			case 3:  trig = Math.atan(a);  break;
			}
			this.p[i].x += (this.t_mult1 * trig);
			if(this.reloadCount % 3 <= 1) a = d / this.p[i].x;
			else a = d / this.p[j].x;
			switch(this.trig2) {
  			case 0:  trig = Math.sin(a);  break;
  			case 1:  trig = Math.cos(a);  break;
  			case 2:  trig = Math.tan(a);  break;
  			case 3:  trig = Math.atan(a);  break;
			}
			this.p[i].y += (this.t_mult2 * trig);
		}
	}
}


TouchFoldPoints.prototype.initRand = function() {
	randomSeed(1);
	for(var i = 0; i < this.p.length; i++) {
		this.p[i].x = this.loc.x + random(-50, 50);  this.p[i].y = this.loc.y + random(-250, 250);
	}
}

TouchFoldPoints.prototype.initHorizontal = function() {
	for(var i = 0; i < this.p.length; i++) {
		this.p[i].x = 400 + (-i * i);  this.p[i].y = -150 + (frameCount % 300) + sq(1);
	}
}

TouchFoldPoints.prototype.randomiseTrigMappings = function() {
  // assigns a new non-linear coordinate behaviour
	this.trig1 = int(Math.random() * 4); // used to be (int)random(4) in ScanFoldPoints.java
	this.trig2 = int(Math.random() * 4);
	this.t_mult1 = 0.02 + (Math.random() * 0.06);
	this.t_mult2 = 0.02 + (Math.random() * 0.06);
}

TouchFoldPoints.prototype.drawParticles = function(index) {
	push();
  noiseSeed(99);
	translate(width / 2, height / 2);
	strokeWeight(2);
	colorMode(HSB);
	for(var i = 0; i < this.p.length; i++) {
		stroke((this.loc.x / 4) + ((70 * noise(index)) - 10), this.sat, 255);
		point(this.p[i].x, this.p[i].y);
	}
	pop();
}

TouchFoldPoints.prototype.render = function() {
  background(0);
  this.loc.x = mouseX - width / 2;
  this.loc.y = mouseY - height / 2;
	if(frameCount % 150 == 0) {
		this.reloadCount++;
		if(this.reloadCount % 3 == 0) this.randomiseTrigMappings();
	}
	this.initRand();
	for(var i = 0; i < 100; i++) {
		this.update();
		this.drawParticles(i);
	}
}

TouchFoldPoints.prototype.initi = function() {
  this.loc = createVector(0, 0);
  for(var i = 0; i < 40; i++) {
    this.p[i] = createVector(-150 + (Math.random() * 300), -150 + (Math.random() * 300));
  }
}
