import _ from 'lodash';
import { getOrCreateAsyncConstants } from './async-constants';
import { REDUX_EASY_ASYNC_MAIN_TYPE, ERRORS } from './lib/constants';
import { createAction } from './action';

const decorateActionCreator = (actionCreator, asyncConstants) => {
  const { START_TYPE, SUCCESS_TYPE, FAIL_TYPE, NAME } = asyncConstants;
  _.assign(actionCreator, {
    START_TYPE,
    SUCCESS_TYPE,
    FAIL_TYPE,
    NAME,
    start: createAction(START_TYPE),
    success: createAction(SUCCESS_TYPE),
    fail: createAction(FAIL_TYPE),
    actionName: NAME,
  });
};

/**
 *
 * @param  {string|object}   type    can either be a string type (e.g. `"GET_POSTS"``) or a
 * an object created with {@link createAsyncConstants}.
 * @param  {Function} fn action creator function that will be
 * @param  {Object}   options [description]
 * @return {function} actionCreator
 */
export const createAsyncAction = (type, fn, options = {}) => {
  const {
    middlewareMainType = REDUX_EASY_ASYNC_MAIN_TYPE,
  } = options;

  const asyncConstants = getOrCreateAsyncConstants(type);
  if (!asyncConstants) {
    throw new Error(`createAsyncAction(type, fn, options): ${ERRORS.ASYNC_TYPE_NOT_VALID}`);
  }

  const actionCreator = (...args) => {
    const action = fn(...args);
    if (typeof action !== 'object') {
      throw new Error(ERRORS.ACTION_NOT_OBJECT);
    }
    if (typeof action.makeRequest !== 'function') {
      throw new Error(ERRORS.MAKE_REQUEST_NOT_FUNCTION);
    }
    return {
      type: middlewareMainType,
      ...action,
      actionName: actionCreator.actionName,
      startActionCreator: actionCreator.start,
      successActionCreator: actionCreator.success,
      failActionCreator: actionCreator.fail,
    };
  };
  // attach the name and start, success, and fail actions for convenience
  decorateActionCreator(actionCreator, asyncConstants);
  return actionCreator;
};
