import { combineReducers } from 'redux';
import _ from 'lodash';
import { getOrCreateAsyncConstants } from './async-constants';
import {
  ERRORS,
} from './lib/constants';

const asyncDefaultState = {
  hasPendingRequests: false,
  pendingRequests: [],
};

const createSingleAsyncReducer = (type) => {
  const asyncConstants = getOrCreateAsyncConstants(type);
  if (!asyncConstants) {
    throw new Error(ERRORS.CREATE_ASYNC_REDUCER_INVALID_TYPE);
  }

  const { START_TYPE, SUCCESS_TYPE, FAIL_TYPE } = asyncConstants;

  return (state = asyncDefaultState, action = {}) => {
    if ([START_TYPE, SUCCESS_TYPE, FAIL_TYPE].indexOf(action.type) > -1) {
      let updatedPendingRequests;

      if (action.type === START_TYPE) {
        updatedPendingRequests = [
          ...state.pendingRequests,
          // store the meta but omit `actionCreatorArgs` as they may not be serializable
          _.omit(action.meta, 'actionCreatorArgs'),
        ];
      } else {
        updatedPendingRequests = state.pendingRequests.filter(req => (
          req.asyncID !== action.meta.asyncID
        ));
      }
      return {
        pendingRequests: updatedPendingRequests,
        hasPendingRequests: updatedPendingRequests.length > 0,
      };
    }
    return state;
  };
};


/**
 * Creates a requests reducer that automatically tracks the status of one or more async actions
 * created with {@link createAsyncAction}. As you dispatch async actions this reducer will
 * automatically update with number of requests, request meta for each, a boolean for whether any
 * requests are currently pending for this request.
 * @kind function
 * @param  {Array|String|Object|Function} types - one or more async actions to track. Either a
 * single instance or an array of one or more of the following: a string (e.g. `"GET_POSTS"``), a
 * constants object created with {@link createAsyncConstants}, or an async action created with
 * {@link createAsyncAction}. Typically you will want to pass an array of actions to track all
 * async actions for your application in one place.
 * @return {function}       Redux reducer automatically tracking the async action(s)
 *
 * @example
 * import { createAsyncAction, createAsyncConstants } from '`redux-easy-async';
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
 * // now we can create a reducer from the action or constants we've defined
 * const requestsReducer = createAsyncReducer([FETCH_POSTS, fetchUser, fetchComments]);
 *
 * // Now `requestsReducer` is reducer that automatically tracks each of the asynchronous action
 * // types. It's state looks something like this to start:
 * // {
 * //   {
 * //    FETCH_POSTS: {
 * //      hasPendingRequests: false,
 * //      pendingRequests: [],
 * //   },
 * //   {
 * //    FETCH_USER: {
 * //      hasPendingRequests: false,
 * //      pendingRequests: [],
 * //   }
 * //   {
 * //    FETCH_COMMENTS: {
 * //      hasPendingRequests: false,
 * //      pendingRequests: [],
 * //   }
 * // }
 *
 */
export const createAsyncReducer = (types) => {
  if (Array.isArray(types)) {
    const reducers = types.reduce((acc, type) => {
      const asyncConstants = getOrCreateAsyncConstants(type);
      if (asyncConstants) {
        // eslint-disable-next-line no-param-reassign
        acc[asyncConstants.NAME] = createSingleAsyncReducer(type);
      }
      return acc;
    }, {});
    return combineReducers(reducers);
  }
  return createSingleAsyncReducer(types);
};
