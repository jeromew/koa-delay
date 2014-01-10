var debug = require('debug')('koa-delay');
var koa = require('koa');
var delay = require('koa-delay');
var compose = require('koa-compose');

var app = koa();

var mw = compose([
  delay(10,0),
  delay(20,30),
  
  // example of 2 concurrent async calls
  function*(next){
    yield [delay(50), delay(60)];
    yield next;
  },

  // example of 2 successive async calls
  function*(next){
    yield delay(70);
    yield delay(80);
    yield next;
  },
  
  delay(0,90)
]);

app.use(mw);

app.use(function*() {
  this.body = "hello world";
});

if (!module.parent) app.listen(3000);
