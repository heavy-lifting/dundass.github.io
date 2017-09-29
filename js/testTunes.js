(function() {
	"use strict";

	fluid.registerNamespace("testTunes");

	var environment = flock.init();

	testTunes.play = function() {
		var shitSynth = flock.synth({
			synthDef: {
				ugen: "flock.ugen.sinOsc",
				freq: {
					ugen: "flock.ugen.lfSaw",
					freq: {ugen: "flock.ugen.sin", freq: 0.25, mul: 100, add: 100},
					mul: 380,
					add: 60,
				},
				mul: 0.1
			}
		});

		environment.start();
	};

}());
