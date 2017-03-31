import _ from 'lodash';
import { getOrCreateAsyncConstants } from './async-constants';
import { REDUX_EASY_ASYNC_MAIN_TYPE } from './lib/constants';
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
 * [description]
 * @param  {string|object}   type    [description]
 * @param  {Function} fn      [description]
 * @param  {Object}   options [description]
 * @return {function} actionCreator
 */
export const createAsyncAction = (type, fn, options = {}) => {
  const {
    middlewareMainType = REDUX_EASY_ASYNC_MAIN_TYPE,
  } = options;

  const asyncConstants = getOrCreateAsyncConstants(type);
  if (!asyncConstants) {
    throw new Error('createAsyncAction() requires type to be a string or an object inthe format that createAsyncConstants() returns.');
  }

  const actionCreator = (...args) => {
    const action = fn(...args);
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
