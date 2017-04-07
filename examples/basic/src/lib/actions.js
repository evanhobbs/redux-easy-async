/* globals fetch */
import { createAsyncAction } from '@nerdwallet/redux-easy-async';

export const fetchPost = createAsyncAction(
  // the base name that will be used to construct the different types:
  // START_FETCH_POST, SUCCESS_FETCH_POST, FAIL_FETCH_POST
  'FETCH_POST',
  // action creator function that returns the options for the action. At a minimum it must
  // have a makeRequest method that returns a promise (in this case `fetch()` returns a promise)
  (id) => {
    return {
      makeRequest: () => {
        return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
              .then(response => response.json());
      },
    };
  }
);

export const selectNewPost = (id) => ({
  type: 'SELECT_POST',
  payload: {
    id,
  }
});
