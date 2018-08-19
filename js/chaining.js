
const a = [0, 1, 2, 3, 4, 5, 6, 7];
const mult = (x, y=2) => x * y;
const add = (x, y=1) => x + y;
const compose = (a, b) => (c) => a(b(c));
//const pipe = (fn,...fns) => (...args) => fns.reduce((acc, fn) => fn(acc), fn(...args));
const pipe = (fns) => (x) => fns.reduce((v, f) => f(v), x);
const multadd = pipe([mult, add]);

var b = a.map((x) => multadd(x));

console.log(b);

////////////////////

Object.assign = Object.assign || function(object) {
 for(var i = 1, len = arguments.length; i < len; i++) {
  for(var key in arguments[i]) {
   object[key] = objects[key] || arguments[i][key];
  }
 }
 return object;
};

const barker = (state) => ({
  bark: () => console.log('woof, i am ' + state.name)
})

const driver = (state) => ({
  drive: () => state.position = state.position + state.speed
})

barker({name: 'wooffus'}).bark()

const roboDog = (name) => {
  let state = {
    name,
    speed: 100,
    position: 0
  }
  return Object.assign(
    {},
    barker(state),
    driver(state)
  )
}

let preston = roboDog('preston')

preston.bark()
