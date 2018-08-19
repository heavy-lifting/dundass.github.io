/*
a = new Kick('. . . . ').vary('p: 0.5', 'randall').vary('each: 4', 'rev').vary('   .', 'clear');

b = new Snare('  .   . ').vary('p: 0.5', '!b');

iter([0,1,2,0,5,6]).rate([1,4]).mult([1,.6]).synth("prophet") // rate([1,4]) creates 2 layers at 2 diff rates, then mult([1,.6]) applies to either index of the layers
iter([0,1,0,1,8,1,0,0,0,1,0,1,8,0,0,1]).mult(127/8).vary('p: 0.3', 'mutate', {amount: .5, revert: true}).smp("snare") // name of sample or name of sampler ?
c = iter(Math.sin, 128).mult(127).vary('pq: 0.5', Array.reverse).midi("CVpal", 34) // maybe if u don't supply 2nd arg to iter(func), it just free-runs forever
d = iter([1,1,1,1]).rate([4]).vary(fast, {every: 8, amt: 4}).vary(switchSample, {smp: "tom1", p: 0.1}).smp("kd1") // should every be calculated before p ? (ie if they could coexist)
e = iter(vjaz.cellfo, 64).vary((x) => (x + 2), {p: 0.3}).vary((x) => Math.random, {every: 6}).osc('chroma')
.seq("midiout1") ?
*/

// for vary(): maybe have 'p: 0.3' for varying per-index, and 'pq: 0.5' for varying every i == 0
// should every also share this behaviour ? ie, every: and everyq: ? or should both every and p default to bar-quantised versions, then eg pt: and everyt: or pi: and everyi:
// also, if no every: or p: supplied to vary(), it happens immediately, and permanently if no revert:true supplied

// instead of naming variances as 'mutate', why not include a bunch of functions and send them in like map() ? eg vary('p: 0.3', mutate)

// do the pattern chains have to be stored in a variable ? ie, midi() smp() and synth() all return a Pattern or Chain object that gets stored in a global var ?
// actually, every method must return a Pattern/Chain anyway, to be able to chain functions like above, and the last ones have the side effect of routing it somewhere else
// maybe the last one returns a unique 'hash' string as an id for each pattern

// BIG BLUE SKY - can implement all of these custom functions as part of Array.prototype ?? or even, pass them to Array.map() ? [0,1,2].map(x => x * 127/2).map().synth("buzz")

/*
var PChain = function() {
  this.data = [];
}

PChain.prototype = {
  iter: function(gen, leng) { // also send in opts as object as in vary() ?
      if(Array.isArray(gen)) {
        this.data = gen;
      } else if(typeof gen === 'function') {
        for(var i = 0; i < leng; i++) this.data.push(gen(i/leng));  // save array as u go + persist data, or eval the chain every tick ?
      }
      return this;
  },
  vary: function(mod, opts) {

  }
}*/

// HOLD ON ONE MINUTE

/*
a = [0,1,2,3].map(x => x+Math.random()-1).clk(4).vary(Math.random, {every:4})
b = [1,0,0,1,0,0,0,0,1,0,0,0].clk([1,4]).vary((x) => Math.sin(x), {p:0.5})

to safely add to array prototype:

Object.defineProperty(Array.prototype, 'insert', {
  enumerable: false,
  value: function(index, element){
    this.splice(index, 0, element);
  }
});
var a = [1,2,3];
a.insert(0, 4);
console.log(a);
for (i in a) console.log(i, a[i]);

if that doesn't work:

c = clk([0,0,2,1].map((x) => x*Math.random()), [4,16]).vary(Math.sin, {p:.9}).midi('CVpal', [3,4])

or 2 ways:
d = [].map().clk().vary().synth()
e = gen(Math.sin, 128).clk().vary().midicc()
f = gen((x,i) => i%4==0 ? 1 : 0, 16).clk().vary().vary().smp("kick1")

perhaps patterns therefore are just a function expression ie (x,i) => { i%4==0 ? 1 : 0 } ??
*/

/*

var parr = [0,1,4,0,7].map()

g = parr.clk(16).vary().midiout1()

var pfun = (x,i) => (i%3)+(i%8)

h = gen(pfun).clk()

// (aside) - if gen only receives the func param and no iteration num, can it default to evaluating the function 'in the moment',
// so when the clk is triggered, it increments a count that is fed into the gen() function ?
// na, when u call gen(), just need to save the func temporarily until it is clk()d, at which point the count is supplied as the (x) in (x) => Math.sin(x) ?

*/

/*
so, patt can be either array or func (expression)
gen(Math.sin) evaluates Math.sin every clock tick with the new t val

how about, you can define 'fix' and 'vary' structures
k = fix(0).vary(Math.random, {every:4})
l = fix([0,0,1,0,1,2,3,4]).vary(x => x*2, {p:0.5})
m = fix(Math.sin).vary(x => x*-1, {every:6})
n = fix(0).vary(1, {every:12, lag:1}) // 0 becomes 1 every 12 measures, then spends 1s (1measure??) returning to orig val
from above, maybe use lag: for linear return based on measures, lags: for linear return based on secs, log: for log return based on measures + logs: for log return based on secs

*/

/*
how to deal with FD style nested arrays ? prob check each element once i increments if(typeof arr[i] === 'number') else if(typeof arr[i] === 'array') ...
could involve recursion ?
*/

/*
backend options: Tone.js, p5.sound, gibberish, SC?
*/

const Layer = function(fxd) {
  this.fixed = fxd;  // 1st arg to fix() -> num, arr or func
  this.transforms = [];  // arr of transform functions ie [vary(args), vary(args2), midicc(args3)]
}

const fix = (fxd) => {
  return new Layer(fxd);
}

Layer.prototype = {
  vary: function(transform, opts) {
    this.transforms.push(transform);
    // opts ?
    return this;
  }
}

var a = fix(2).vary(Math.sin, {}).vary((x)=>x*2, {});

console.log(a.transforms);

// errrr...
const calcLayers = function() {
  let x = a.fixed;
  for(let i = 0; i < a.transforms.length; i++) {
    x = a.transforms[i](x)
  }
}

const clk = setInterval(calcLayers, 100);
