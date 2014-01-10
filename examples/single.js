var koa = require('koa');
var delay = require('koa-delay');

var app = koa();

app.use(delay(30, 20));

app.use(function*() {
  this.body = "hello world";
});

if (!module.parent) app.listen(3000);
