"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAsyncContext = createAsyncContext;
exports.getContext = getContext;
exports.runInContext = runInContext;
exports.default = void 0;

var _async_hooks = _interopRequireDefault(require("async_hooks"));

var _log = _interopRequireDefault(require("./log"));

var _asyncContext = _interopRequireDefault(require("./classes/async-context"));

var _contextRoot = _interopRequireDefault(require("./classes/context-root"));

var _context = require("./context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAsyncContext(contextID) {
  const context = new _asyncContext.default(contextID);

  _context.AsyncContexts.set(contextID, context);

  context.hook = _async_hooks.default.createHook({
    init(asyncId, type, triggerId) {
      if (type !== 'CONTEXT_ROOT') {
        const base = context.states.get(triggerId);

        if (base) {
          (0, _log.default)(`${String(Date.now())} | ${'[INIT]'.padEnd(10)} | ${type.padEnd(11)} | asyncId ${asyncId} | trigger: ${triggerId}`);
          context.states.set(asyncId, base);
        }
      }
    },

    after(asyncId) {
      if (context.states.has(asyncId)) {
        (0, _log.default)(`${String(Date.now())} | ${'[AFTER]'.padEnd(10)} | asyncId ${String(asyncId)}`);
        context.complete(asyncId);
      }
    },

    promiseResolve(asyncId) {
      if (context.states.has(asyncId)) {
        (0, _log.default)(`${String(Date.now())} | ${'[RESOLVE]'.padEnd(10)} | asyncId ${String(asyncId)}`);
        context.complete(asyncId);
      }
    },

    destroy(asyncId) {
      if (context.states.has(asyncId)) {
        context.complete(asyncId);
      }
    }

  });
  return context;
}

function getContext(contextID) {
  const context = _context.AsyncContexts.get(contextID);

  if (!context) {
    throw new Error(`[ERROR] | getContext (Async) | Context ${contextID} does not exist`);
  }

  return context;
}

async function runInContext(contextID, fn, ...args) {
  const context = _context.AsyncContexts.get(contextID) || createAsyncContext(contextID);
  const runner = new _contextRoot.default(context, fn);
  return runner.run(args);
}

var _default = Object.freeze({
  create: createAsyncContext,
  get: getContext,
  run: runInContext
});

exports.default = _default;