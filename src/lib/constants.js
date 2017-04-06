export const REDUX_EASY_ASYNC_MAIN_TYPE = 'REDUX_EASY_ASYNC_MAIN_TYPE';


export const ERRORS = {
  ACTION_NOT_OBJECT: 'createAsyncAction(type, fn, options): fn must return an object',
  MAKE_REQUEST_NOT_FUNCTION: 'createAsyncAction(type, fn, options): object returned by fn must have a makeRequest function',
  ASYNC_TYPE_NOT_VALID: 'type must be either a string or an object in the format that createAsyncConstants() returns.',
  REDUCER_TYPES_NOT_VALID: 'createCombinedAsyncReducer(types): types must be an array of strings or objects in the format that createAsyncConstants() returns.',
};
