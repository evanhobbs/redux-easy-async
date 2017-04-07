import { combineReducers } from 'redux';
import { createCombinedAsyncReducer } from '@nerdwallet/redux-easy-async';
import { fetchPost } from './actions';

const selectedPost = (state = 1, action) => {
  if (action.type === 'SELECT_POST') return action.id;
  return state;
};

const posts = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case fetchPost.SUCCESS_TYPE:
      return {
        ...state,
        [payload.id]: payload,
      };
    default:
      return state;
  }
};

// creates a reducer that will automatically track requests -- in this case just fetchPost
// note: this must be an array
const requestsReducer = createCombinedAsyncReducer([fetchPost]);

export default combineReducers({
  selectedPost,
  posts,
  requests: requestsReducer,
});
