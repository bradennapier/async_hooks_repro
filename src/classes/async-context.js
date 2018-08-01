/* @flow */
import ah from 'async_hooks';
import log from '../log';
import type { AsyncState } from '../types';

export default class AsyncContext<CID: string> {
  contextID: CID;

  states: Map<number, AsyncState>;

  hook: $Call<typeof ah.createHook, Object>;

  constructor(contextID: CID) {
    this.states = new Map();
    this.contextID = contextID;
  }

  run(callback: Function, args: any[]) {
    if (this.states.size === 0) {
      log('[ENABLING HOOKS]');
      this.hook.enable();
    }
    const eid = ah.executionAsyncId();
    log(`[START]: Context Base EID: ${eid}`);
    const state: AsyncState = {
      root: eid,
    };
    this.states.set(eid, state);
    return callback(...args);
    // this.states.delete(eid);
  }

  complete(id: number) {
    this.states.delete(id);
    log(
      `${String(Date.now())} | ${'[DESTROY]'.padEnd(10)} | asyncId ${String(id).padEnd(
        3,
      )} | remaining ${String(this.states.size).padEnd(3)} | ids left: ${[
        ...this.states.keys(),
      ].join(', ')}`,
    );
    if (this.states.size === 0) {
      log('[DISABLING HOOKS]');
      this.hook.disable();
    }
  }

  inScope(): boolean {
    return this.states.has(ah.executionAsyncId());
  }

  state(): AsyncState {
    const eid = ah.executionAsyncId();
    const state = this.states.get(eid);
    if (!state) {
      throw new Error(
        `[ERROR] | AsyncContext[${
          this.contextID
        }] | No State Found for Async ID: ${eid}, this was likely run outside the asynchronous context.`,
      );
    }
    return state;
  }

  rootID() {
    return this.state().root;
  }

  get(id: string | Symbol) {
    return this.state()[id];
  }

  set<K: string | Symbol, V>(id: K, value: V) {
    const state = this.state();
    state[id] = value;
  }

  assign(...objs: Object[]) {
    const state = this.state();
    Object.assign(state, ...objs);
  }
}
