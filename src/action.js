import _ from 'lodash';
/**
 * Action creator function that creates Flux Standard Actions (FSA) {@link https://github.com/acdlite/flux-standard-action}
 * @typedef {Object} actionCreator
 * @param {Object} options options
 * @param {Object} [options.payload={}] payload for the action
 * @param {Object} [options.meta={}] meta for the action
 * @param {Object} [options.error=null]
 */

/**
 * Creates an action creator function
 * @param  {string} type a string type for the action, e.g. `ADD_TODO`
 * @return {actionCreator} an action creator function using the given type
 * @example
 * const addTodo = createAction('ADD_TODO');
 * addTodo({
 *   payload: { text: 'Do something' },
 *   meta: { time: Date.now() },
 * })
 * // {
 * //   type: 'ADD_TODO',
 * //   payload: { text: 'Do something' },
 * //   meta: { time: 1490472864040 }
 * // }
 */
export const createAction = (
  type,
  payloadReducer = args => _.get(args, 'payload'),
  metaReducer = args => _.get(args, 'meta'),
) => (...args) => ({
  type,
  payload: payloadReducer(...args),
  meta: metaReducer(...args),
});
