import _ from 'lodash';
import { getOrCreateAsyncConstants } from './async-constants';
import { BASE_TYPE } from './lib/constants';
import { createAction } from './action';

const decorateActionCreator = (actionCreator, asyncConstants) => {
  const { START, SUCCESS, FAIL, NAME } = asyncConstants;
  _.assign(actionCreator, {
    START,
    SUCCESS,
    FAIL,
    NAME,
    startFn: createAction(START),
    successFn: createAction(SUCCESS),
    failFn: createAction(FAIL),
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
    baseType = BASE_TYPE,
  } = options;

  const asyncConstants = getOrCreateAsyncConstants(type);
  if (!asyncConstants) {
    throw new Error('createAsyncAction() requires type to be a string or an object inthe format that createAsyncConstants() returns.');
  }

  const actionCreator = (...args) => {
    const action = fn(...args);
    return {
      type: baseType,
      ...action,
      actionName: actionCreator.actionName,
      startActionCreator: actionCreator.startFn,
      successActionCreator: actionCreator.successFn,
      failActionCreator: actionCreator.failFn,
    };
  };
  // attach the name and start, success, and fail actions for convenience
  decorateActionCreator(actionCreator, asyncConstants);
  return actionCreator;
};
