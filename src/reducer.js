import { combineReducers } from 'redux';
import { getOrCreateAsyncConstants } from './async-constants';
import {
  ERRORS,
} from './lib/constants';

const asyncDefaultState = {
  hasPendingRequests: false,
  pendingRequests: 0,
};

/**
 * Creates a reducer that automatically tracks the status of a SINGLE async actions created with
 * {@link createAsyncAction}. Unless you are only ever going to have one async action you most
 * likely want to use: {@link createMultipleAsyncReducer}.
 * @kind function
 * @param  {String|Object|Function} type of async action to track. Type can be one of the following:
 * a string (e.g. `"GET_POSTS"``), a constants object created with {@link createAsyncConstants}, or
 * an async action created with {@link createAsyncAction}.
 * @return {function}      Redux reducer.
 */
export const createSingleAsyncReducer = (type) => {
  const asyncConstants = getOrCreateAsyncConstants(type);
  if (!asyncConstants) {
    throw new Error(`createSingleAsyncReducer(type): ${ERRORS.ASYNC_TYPE_NOT_VALID}`);
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


/**
 * Creates a requests reducer that automatically tracks the status of MULTIPLE async actions created
 * with {@link createAsyncAction}.
 * @kind function
 * @param  {Array<String|Object|Function>} types an array of async actions to track. Types can be
 * one of the following: a string (e.g. `"GET_POSTS"``), a constants object created with
 * {@link createAsyncConstants}, or an async action created with {@link createAsyncAction}.
 * @return {function}       Redux reducer
 *
 * @example
 * import { createAsyncAction, createAsyncConstants } from '@nerdwallet/redux-easy-async';
 *
 * // Types can async action, constants object, or string:
 *
 * // string constant
 * const FETCH_POSTS = 'FETCH_POSTS';
 *
 * // async action
 * export const fetchUser = createAsyncAction('FETCH_USER', (id) => {
 *   return {
 *     makeRequest: () => fetch(`https://myapi.com/api/user/${id}`),
 *   };
 * });
 *
 * // async constant
 * const fetchComments = createAsyncConstants('FETCH_COMMENTS');
 *
 * const requestsReducer = createMultipleAsyncReducer([FETCH_POSTS, fetchUser, fetchComments]);
 *
 * // Now `requestsReducer` is reducer that automatically tracks each of the asynchronous action
 * // types.
 * // {
 * //   {
 * //    FETCH_POSTS: {
 * //      hasPendingRequests: false,
 * //      pendingRequests: 0,
 * //   },
 * //   {
 * //    FETCH_USER: {
 * //      hasPendingRequests: false,
 * //      pendingRequests: 0,
 * //   }
 * //   {
 * //    FETCH_COMMENTS: {
 * //      hasPendingRequests: false,
 * //      pendingRequests: 0,
 * //   }
 * // }
 *
 */
export const createMultipleAsyncReducer = (types) => {
  if (!Array.isArray(types)) throw new Error(ERRORS.REDUCER_TYPES_NOT_VALID);
  const reducers = types.reduce((acc, type) => {
    const asyncConstants = getOrCreateAsyncConstants(type);
    if (asyncConstants) {
      // eslint-disable-next-line no-param-reassign
      acc[asyncConstants.NAME] = createSingleAsyncReducer(type);
    }
    return acc;
  }, {});
  return combineReducers(reducers);
};
