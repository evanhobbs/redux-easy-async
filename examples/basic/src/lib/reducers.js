import { combineReducers } from 'redux';
import { createAsyncReducer } from 'redux-easy-async';
import { fetchPost } from './actions';

const selectedPost = (state = 1, { type, payload }) => {
  if (type === 'SELECT_POST') return payload.id;
  return state;
};

const posts = (state = {}, { type, payload }) => {
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
const requestsReducer = createAsyncReducer([fetchPost]);

export default combineReducers({
  selectedPost,
  posts,
  requests: requestsReducer,
});
