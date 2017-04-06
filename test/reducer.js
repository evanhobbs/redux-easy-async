import { assert } from 'chai';
import { createAsyncReducer, createCombinedAsyncReducer } from '../src/reducer';
import { createAsyncConstants } from '../src/async-constants';
import { createAsyncAction } from '../src/async-action';
import { runSingleReducerTests, runCombinedReducerTests } from './reducer-utils';


describe('createAsyncReducer()', () => {
  it('throws error if type is not valid', () => {
    assert.throws(() => createAsyncReducer({}));
    assert.throws(() => createAsyncReducer(null));
    assert.throws(() => createAsyncReducer());
    assert.throws(() => createAsyncReducer(123));
    assert.throws(() => createAsyncReducer({}));
  });
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
  it('throws error if types is not array', () => {
    assert.throws(() => {
      createCombinedAsyncReducer();
    });
  });
  it('skips invalid types', () => {
    const reducer = createCombinedAsyncReducer([() => {}, 123, 'TEST']);
    // invalid async types were skipped and only have the one reducer
    assert.deepEqual(reducer(), {
      TEST: { hasPendingRequests: false, pendingRequests: 0 },
    });
  });
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

