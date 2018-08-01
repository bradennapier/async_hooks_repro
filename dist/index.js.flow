/* @flow */
import ah from 'async_hooks';
import log from './log';
import AsyncContext from './classes/async-context';
import ContextRoot from './classes/context-root';

import { AsyncContexts } from './context';

export function createAsyncContext<CID: string>(contextID: CID): AsyncContext<CID> {
  const context = new AsyncContext(contextID);
  AsyncContexts.set(contextID, context);

  context.hook = ah.createHook({
    init(asyncId: number, type: string, triggerId: number) {
      if (type !== 'CONTEXT_ROOT') {
        const base = context.states.get(triggerId);
        if (base) {
          log(
            `${String(Date.now())} | ${'[INIT]'.padEnd(10)} | ${type.padEnd(
              11,
            )} | asyncId ${asyncId} | trigger: ${triggerId}`,
          );
          context.states.set(asyncId, base);
        }
      }
    },
    after(asyncId: number) {
      if (context.states.has(asyncId)) {
        log(`${String(Date.now())} | ${'[AFTER]'.padEnd(10)} | asyncId ${String(asyncId)}`);
        context.complete(asyncId);
      }
    },
    promiseResolve(asyncId: number) {
      if (context.states.has(asyncId)) {
        log(`${String(Date.now())} | ${'[RESOLVE]'.padEnd(10)} | asyncId ${String(asyncId)}`);
        context.complete(asyncId);
      }
    },
    destroy(asyncId: number) {
      if (context.states.has(asyncId)) {
        context.complete(asyncId);
      }
    },
  });

  return context;
}

export function getContext<CID: string>(contextID: CID) {
  const context = AsyncContexts.get(contextID);
  if (!context) {
    throw new Error(`[ERROR] | getContext (Async) | Context ${contextID} does not exist`);
  }
  return context;
}

export async function runInContext<A, R>(
  contextID: string,
  fn: (...args: A[]) => R,
  ...args: any[]
) {
  const context = AsyncContexts.get(contextID) || createAsyncContext(contextID);
  const runner = new ContextRoot(context, fn);
  return runner.run(args);
}

export default Object.freeze({
  create: createAsyncContext,
  get: getContext,
  run: runInContext,
});
