/* Run with `yarn try`  */
const ctx = require('./dist').default;
const log = require('./dist/log').default;

function fn() {
  // outputs using fs.writeSync(1, message)
  log(`
    Context State: ${JSON.stringify(ctx.get('foo').state())}
  `);
}

ctx.run('foo', () => {
  ctx.get('foo').set('myvar', 'value1');
  setTimeout(fn);
  ctx.run('foo', () => {
    ctx.get('foo').set('myvar', 'value2');
    setTimeout(fn);
  });
});

setTimeout(() => {
  console.log(`${String(Date.now())} | EVALUATION COMPLETED`);
}, 8000);
