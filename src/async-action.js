import _ from 'lodash';
import { createAsyncConstants, isAsyncConstant } from './async-constants';
import { BASE_TYPE } from './lib/constants';
import { createAction } from './action';

const getAsyncConstants = (type) => {
  if (typeof type === 'string' && type.length) return createAsyncConstants(type);
  else if (isAsyncConstant(type)) return type;
  return null;
};

const decorateActionCreator = (actionCreator, asyncConstants) => {
  const { START, SUCCESS, FAIL, NAME } = asyncConstants;
  _.assign(actionCreator, {
    START,
    SUCCESS,
    FAIL,
    startFn: createAction(START),
    successFn: createAction(SUCCESS),
    failFn: createAction(FAIL),
    actionName: NAME,
  });
};

export const createAsyncAction = (type, fn, options = {}) => {
  const {
    baseType = BASE_TYPE,
  } = options;

  const asyncConstants = getAsyncConstants(type);
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
