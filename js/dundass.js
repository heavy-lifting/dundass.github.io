// var itera = require ? require('itera') : (itera || {});
var dundass = dundass || {};

// cell2reel = cell arr => start ${dur} arr

// rename this file to mappings ?? or move these existing functions to mappings.js then use namespaces within dundass module for each environment
// eg dundass.max.evoseq ? but then still requires a file to load that from the dundass module (ie main top-level program)

(function(dundass) {

  'use strict';

  // var seq = function (phrase, clk) {
  //   return phrase[clk % phrase.length];
  // }

  var seq = function (phrase) {
    var clk = -1;
    return function (steps) {
      steps = steps || 1;
      clk += steps;
      return phrase[clk % phrase.length];
    }
  }

  var arrayToPlayMessage = function (array, bufferLength, environmentName) {
    bufferLength = bufferLength || 1000;
    environmentName = environmentName || 'max';
    return array.map(function (elem, idx) {
      // diff transform per environment
      switch(environmentName) {
        case 'max':
          return elem > 0 ? 'start ' + (bufferLength * idx / array.length) : 'stop';
        break;
        case 'p5.sound':

        break;
        case 'supercollider':

        break;
      }
    });
  }

  dundass.seq = seq;
  dundass.arrayToPlayMessage = arrayToPlayMessage;

})(dundass);
