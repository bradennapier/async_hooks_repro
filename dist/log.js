"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// * IMPORTANT:
//     If logging is ever done within the callback hooks, it must
//     use the `log` function shown below otherwise it will
//     create an endless loop.
var _default = (message, ...args) => {
  _fs.default.writeSync(1, `${message}\n`);

  if (args.length) {
    args.forEach(arg => {
      if (typeof arg === 'object') {
        _fs.default.writeSync(1, `${JSON.stringify(arg)}\n`);
      } else {
        _fs.default.writeSync(1, `${String(arg)}\n`);
      }
    });
  }
};

exports.default = _default;