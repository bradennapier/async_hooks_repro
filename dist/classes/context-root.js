"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _async_hooks = require("async_hooks");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * This uses the `AyncResource` of the async_hooks module
 * to guarantee that every run request is generated with
 * its own dedicated state.
 *
 * This will cut off the state if run within another
 * AsyncContext and start anew.
 */
class ContextRoot extends _async_hooks.AsyncResource {
  constructor(context, callback) {
    super('CONTEXT_ROOT');

    _defineProperty(this, "callback", void 0);

    _defineProperty(this, "context", void 0);

    this.callback = callback;
    this.context = context;
  }

  run(args) {
    this.runInAsyncScope(this.context.run, this.context, this.callback, args);
    delete this.context;
    delete this.callback;
    this.emitDestroy();
  }

}

exports.default = ContextRoot;