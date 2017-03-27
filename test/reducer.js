import { createAsyncReducer } from '../src/reducer';
import { createAsyncConstants } from '../src/async-constants';
import { createAsyncAction } from '../src/async-action';
import { runSingleReducerTests, runCombinedReducerTests } from './reducer-utils';


describe('createAsyncReducer()', () => {
  describe('works with type as a string', () => {
    const reducer = createAsyncReducer('TEST');
    runSingleReducerTests(reducer, 'TEST');
  });
  describe('works with type as async constants', () => {
    const asyncConstants = createAsyncConstants('TEST');
    const reducer = createAsyncReducer(asyncConstants);
    runSingleReducerTests(reducer, 'TEST');
  });
  describe('works with async actions', () => {
    const asyncAction = createAsyncAction('TEST', () => {});
    const reducer = createAsyncReducer(asyncAction);
    runSingleReducerTests(reducer, 'TEST');
  });
});

describe('createCombinedAsyncReducer', () => {
  describe('works for string types', () => {
    runCombinedReducerTests('string');
  });
  describe('works for async constant types', () => {
    runCombinedReducerTests('object');
  });
  describe('works for async actions', () => {
    runCombinedReducerTests('function');
  });
});

