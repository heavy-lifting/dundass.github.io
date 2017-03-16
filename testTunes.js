(function() {
	"use strict";
	
	fluid.registerNamespace("testTunes");
	
	var environment = flock.init();
	
	testTunes.play = function() {
		var shitSynth = flock.synth({
			synthDef: {
				ugen: "flock.ugen.sin",
				freq: {
					ugen: "flock.ugen.lfNoise",
					freq: 10,
					mul: 380,
					add: 60
				},
				mul: 0.1
			}
		});
		
		environment.start();
	};
	
}());