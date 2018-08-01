"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _async_hooks = _interopRequireDefault(require("async_hooks"));

var _log = _interopRequireDefault(require("../log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AsyncContext {
  constructor(contextID) {
    _defineProperty(this, "contextID", void 0);

    _defineProperty(this, "states", void 0);

    _defineProperty(this, "hook", void 0);

    this.states = new Map();
    this.contextID = contextID;
  }

  run(callback, args) {
    if (this.states.size === 0) {
      (0, _log.default)('[ENABLING HOOKS]');
      this.hook.enable();
    }

    const eid = _async_hooks.default.executionAsyncId();

    (0, _log.default)(`[START]: Context Base EID: ${eid}`);
    const state = {
      root: eid
    };
    this.states.set(eid, state);
    return callback(...args); // this.states.delete(eid);
  }

  complete(id) {
    this.states.delete(id);
    (0, _log.default)(`${String(Date.now())} | ${'[DESTROY]'.padEnd(10)} | asyncId ${String(id).padEnd(3)} | remaining ${String(this.states.size).padEnd(3)} | ids left: ${[...this.states.keys()].join(', ')}`);

    if (this.states.size === 0) {
      (0, _log.default)('[DISABLING HOOKS]');
      this.hook.disable();
    }
  }

  inScope() {
    return this.states.has(_async_hooks.default.executionAsyncId());
  }

  state() {
    const eid = _async_hooks.default.executionAsyncId();

    const state = this.states.get(eid);

    if (!state) {
      throw new Error(`[ERROR] | AsyncContext[${this.contextID}] | No State Found for Async ID: ${eid}, this was likely run outside the asynchronous context.`);
    }

    return state;
  }

  rootID() {
    return this.state().root;
  }

  get(id) {
    return this.state()[id];
  }

  set(id, value) {
    const state = this.state();
    state[id] = value;
  }

  assign(...objs) {
    const state = this.state();
    Object.assign(state, ...objs);
  }

}

exports.default = AsyncContext;