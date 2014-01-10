# koa-delay

  Delay middleware for koa.
  Add a delay(ms) before going to the downstream middlware and/or before
  returning to the upstream middlare.
  Simulate the delay of async calls.

  This middleware can be used to build koa load testing graphs in order to understand the behavior of koa.

  It can be used to simulate complex graphs and can be used as setup mechanism for testing the development of health check middleware for koa.

  In debug mode it can be used as a learning tool to better visualize the effect of different yielding techniques.

## Installation

```js
$ npm install koa-delay
```

## Examples

### Testing examples

In order to observe the delay on console, you should activate DEBUG like so

```
$ DEBUG=koa-delay node --harmony example.js

and from another console
$ curl -N http://127.0.0.1:3000
```

You should probably call the url 2 times in order to remove most of the initial node.js/v8 bootstraping delay upon first call.

### Add a 5 sec delay before going downstream

This example can be found in examples/single.js

```
var koa = require('koa');
var delay = require('koa-delay');

var app = koa();

app.use(delay(30, 20));

app.use(function*() {
  this.body = "hello world";
});

if (!module.parent) app.listen(3000);
```

The debug output would look like

```
koa-delay pause downstream flow for 30ms +27ms
koa-delay resume downstream flow +32ms
koa-delay pause upstream flow for 20ms +2ms
koa-delay resume upstream flow +23ms
```

### Simulate a middleware graph

You can compose `delay` several times in order to simulate a middleware graph.

This example can be found in examples/multi.js

```
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
```

The debug output will look something like

```
koa-delay pause downstream flow for 10ms +3s
koa-delay resume downstream flow +15ms
koa-delay pause downstream flow for 20ms +2ms
koa-delay resume downstream flow +23ms
koa-delay async call duration 50ms +3ms
koa-delay async call duration 60ms +4ms
koa-delay async got result +50ms
koa-delay async got result +13ms
koa-delay async call duration 70ms +2ms
koa-delay async got result +73ms
koa-delay async call duration 80ms +3ms
koa-delay async got result +84ms
koa-delay pause downstream flow for 0ms +2ms
koa-delay resume downstream flow +2ms
koa-delay pause upstream flow for 90ms +2ms
koa-delay resume upstream flow +93ms
koa-delay pause upstream flow for 30ms +2ms
koa-delay resume upstream flow +33ms
koa-delay pause upstream flow for 0ms +3ms
koa-delay resume upstream flow +1ms
```

## Licence

The MIT License (MIT)

Copyright (c) 2014 Jérôme Wagner

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

