import { assert } from 'chai';
import { createSingleAsyncReducer, createMultipleAsyncReducer } from '../src/reducer';
import { createAsyncConstants } from '../src/async-constants';
import { createAsyncAction } from '../src/async-action';
import { runSingleReducerTests, runCombinedReducerTests } from './reducer-utils';


describe('createSingleAsyncReducer()', () => {
  it('throws error if type is not valid', () => {
    assert.throws(() => createSingleAsyncReducer({}));
    assert.throws(() => createSingleAsyncReducer(null));
    assert.throws(() => createSingleAsyncReducer());
    assert.throws(() => createSingleAsyncReducer(123));
    assert.throws(() => createSingleAsyncReducer({}));
  });
  describe('works with type as a string', () => {
    const reducer = createSingleAsyncReducer('TEST');
    runSingleReducerTests(reducer, 'TEST');
  });
  describe('works with type as async constants', () => {
    const asyncConstants = createAsyncConstants('TEST');
    const reducer = createSingleAsyncReducer(asyncConstants);
    runSingleReducerTests(reducer, 'TEST');
  });
  describe('works with async actions', () => {
    const asyncAction = createAsyncAction('TEST', () => {});
    const reducer = createSingleAsyncReducer(asyncAction);
    runSingleReducerTests(reducer, 'TEST');
  });
});

describe('createMultipleAsyncReducer', () => {
  it('throws error if types is not array', () => {
    assert.throws(() => {
      createMultipleAsyncReducer();
    });
  });
  it('skips invalid types', () => {
    const reducer = createMultipleAsyncReducer([() => {}, 123, 'TEST']);
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

