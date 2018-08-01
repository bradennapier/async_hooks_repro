import fs from 'fs';
// * IMPORTANT:
//     If logging is ever done within the callback hooks, it must
//     use the `log` function shown below otherwise it will
//     create an endless loop.
export default (message: string, ...args) => {
  fs.writeSync(1, `${message}\n`);
  if (args.length) {
    args.forEach(arg => {
      if (typeof arg === 'object') {
        fs.writeSync(1, `${JSON.stringify(arg)}\n`);
      } else {
        fs.writeSync(1, `${String(arg)}\n`);
      }
    });
  }
};
