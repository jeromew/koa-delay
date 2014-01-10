
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-delay');
var wait = require('co-wait');

/**
 * Add a delay before and/or after
 * invoking the downstream middleware
 *
 * @param {Integer} delay(ms) before going downstream 
 * @param {Integer} delay(ms) before going upstream
 */

module.exports = function(before, after) {

  before = ~~before;
  after  = ~~after;

  return function *delay(next) {

    if (debug.enabled) {
      if (next) {
        debug('pause downstream flow for ' + before + 'ms');
      } else {
	debug('async call duration ' + before + 'ms');
      }
    }

    if (before) {
      yield wait(before);
    }

    if (debug.enabled) {
      if (next) {
        debug('resume downstream flow');
      } else {
	debug('async got result');
      }
    }
    
    if (next) {
      // middleware flow: go downstream
      yield *next;
    }

    if (debug.enabled && next) {
      debug('pause upstream flow for ' + after + 'ms');
    }

    if (after) {
      yield wait(after);
    }

    if (debug.enabled && next) {
      debug('resume upstream flow');
    }

  }

}
