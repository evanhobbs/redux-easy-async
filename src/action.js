import _ from 'lodash';
/**
 * Action creator function that creates Flux Standard Actions (FSA) {@link https://github.com/acdlite/flux-standard-action}
 * @typedef {Object} actionCreator
 * @private
 * @param {Object} options options
 * @param {Object} [options.payload={}] payload for the action
 * @param {Object} [options.meta={}] meta for the action
 * @param {Object} [options.error=null]
 */

/**
 * Creates an action creator function
 * @param  {string} type a string type for the action, e.g. `ADD_TODO`
 * @param  {function} [payloadReducer] function which returns the payload from the arguments action
 * @param  {function} [metaReducer] function which returns the meta from the arguments action
 * is called with.  (Default: `args => args.meta`).
 * @return {actionCreator} an action creator function using the given type
 * @private
 * @example
 * // simple example
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
) => {
  const actionCreator = (...args) => {
    const action = {
      type,
      payload: payloadReducer(...args),
      meta: metaReducer(...args),
    };
    if (_.isError(action.payload)) action.error = true;
    return action;
  };

  // TODO: this is just for backwards compatibility - will remove soon
  actionCreator.getType = () => type;
  actionCreator.toString = () => type;

  return actionCreator;
};
