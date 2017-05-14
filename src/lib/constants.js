export const REDUX_EASY_ASYNC_NAMESPACE = 'REDUX_EASY_ASYNC_NAMESPACE';

export const ERRORS = {
  ACTION_NOT_OBJECT: 'createAsyncAction(type, fn, options): fn must return an object',
  MAKE_REQUEST_NOT_FUNCTION: 'createAsyncAction(type, fn, options): object returned by fn must have a makeRequest function',
  CREATE_ASYNC_REDUCER_INVALID_TYPE: 'createAsyncReducer(types): invalid argument. "types" must be either a string or object OR an array of string or objects in the format that createAsyncConstants() returns.',
};
