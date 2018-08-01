/* @flow */
// $FlowIgnore
import { AsyncResource } from 'async_hooks';
import type AsyncContext from './async-context';

/**
 * This uses the `AyncResource` of the async_hooks module
 * to guarantee that every run request is generated with
 * its own dedicated state.
 *
 * This will cut off the state if run within another
 * AsyncContext and start anew.
 */
export default class ContextRoot<A: [], R = *> extends AsyncResource {
  callback: (...args: A) => R;

  context: AsyncContext<*>;

  constructor(context: AsyncContext<*>, callback: (...args: A) => R) {
    super('CONTEXT_ROOT');
    this.callback = callback;
    this.context = context;
  }

  run(args: any[]) {
    this.runInAsyncScope(this.context.run, this.context, this.callback, args);
    delete this.context;
    delete this.callback;
    this.emitDestroy();
  }
}
