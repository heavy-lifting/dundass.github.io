
var a = [0, 1, 2, 3, 4, 5, 6, 7];
const mult = (x, y=2) => x * y;
const add = (x, y=1) => x + y;
const compose = (a, b) => (c) => a(b(c));
//const pipe = (fn,...fns) => (...args) => fns.reduce((acc, fn) => fn(acc), fn(...args));
const pipe = (fns) => (x) => fns.reduce((v, f) => f(v), x);
const multadd = pipe([mult, mult, add, add]);

var b = a.map((x) => multadd(x));

console.log(b);
