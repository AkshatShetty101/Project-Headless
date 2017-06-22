var Worker = require('webworker-threads').Worker;
// var w = new Worker('worker.js'); // Standard API

// You may also pass in a function:
var worker = new Worker(function(){
  postMessage("I'm working before postMessage('ali').");
  this.onmessage = function(event) {
    postMessage('Hi ' + event.data);
    self.close();
  };
});
worker.onmessage = function(event) {
  console.log("Worker said : " + event.data);
};
worker.postMessage('ali');
function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

function cb (err, data) {
  if(err)
  throw err;
  process.stdout.write(" ["+ this.id+ "]"+ data);
  //this.eval('fibo(35)', cb);
}

var Threads= require('webworker-threads');

Threads.create().eval(fibo).eval('fibo(35)', cb);
Threads.create().eval(fibo).eval('fibo(35)', cb);
Threads.create().eval(fibo).eval('fibo(35)', cb);
Threads.create().eval(fibo).eval('fibo(35)', cb);
Threads.create().eval(fibo).eval('fibo(35)', cb);

// (function spinForever () {
//   setImmediate(spinForever);
// })();
