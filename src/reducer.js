import { combineReducers } from 'redux';
import { getOrCreateAsyncConstants } from './async-constants';
import {
  ERRORS,
} from './lib/constants';

const asyncDefaultState = {
  hasPendingRequests: false,
  pendingRequests: 0,
};

export const createAsyncReducer = (type) => {
  const asyncConstants = getOrCreateAsyncConstants(type);
  if (!asyncConstants) {
    throw new Error(`createAsyncReducer(type): ${ERRORS.ASYNC_TYPE_NOT_VALID}`);
  }

  const { START_TYPE, SUCCESS_TYPE, FAIL_TYPE } = asyncConstants;

  return (state = asyncDefaultState, action = {}) => {
    if ([START_TYPE, SUCCESS_TYPE, FAIL_TYPE].indexOf(action.type) > -1) {
      const pendingRequests = action.type === START_TYPE
          ? state.pendingRequests + 1
          : state.pendingRequests - 1;
      return {
        pendingRequests,
        hasPendingRequests: pendingRequests > 0,
      };
    }
    return state;
  };
};


export const createCombinedAsyncReducer = (types) => {
  if (!Array.isArray(types)) throw new Error(ERRORS.REDUCER_TYPES_NOT_VALID);
  const reducers = types.reduce((acc, type) => {
    const asyncConstants = getOrCreateAsyncConstants(type);
    if (asyncConstants) {
      // eslint-disable-next-line no-param-reassign
      acc[asyncConstants.NAME] = createAsyncReducer(type);
    }
    return acc;
  }, {});
  return combineReducers(reducers);
};
