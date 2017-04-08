import { assert } from 'chai';
import { createMultipleAsyncReducer } from '../src/reducer';
import { createAsyncAction } from '../src/async-action';
import { createAsyncConstants } from '../src/async-constants';

const assertState = (state, hasPendingRequests, pendingRequests) => {
  assert.equal(state.hasPendingRequests, hasPendingRequests);
  assert.equal(state.pendingRequests.length, pendingRequests);
};

export const runSingleReducerTests = (reducer, name) => {
  const INVALID = { type: 'SOME_OTHER_ACTION_TYPE' };

  const makeStartAction = id => ({ type: `START_${name}`, meta: { asyncID: id } });
  const makeSuccessAction = id => ({ type: `SUCCESS_${name}`, meta: { asyncID: id } });
  const makeFailAction = id => ({ type: `FAIL_${name}`, meta: { asyncID: id } });

  it('initial state is no pending requests', () => {
    const state = reducer();
    assertState(state, false, 0);
  });
  it('start adds to pending requests', () => {
    let state = reducer();
    assertState(state, false, 0);
    state = reducer(state, makeStartAction(1));
    assertState(state, true, 1);
    state = reducer(state, makeStartAction(2));
    assertState(state, true, 2);
  });
  it('success removes pending requests', () => {
    let state = reducer();
    state = reducer(state, makeStartAction(1));
    state = reducer(state, makeStartAction(2));
    assertState(state, true, 2);
    state = reducer(state, makeSuccessAction(1));
    assertState(state, true, 1);
    state = reducer(state, makeSuccessAction(2));
    assertState(state, false, 0);
  });
  it('fail removes pending requests', () => {
    let state = reducer();
    state = reducer(state, makeStartAction(1));
    state = reducer(state, makeStartAction(2));
    assertState(state, true, 2);
    state = reducer(state, makeFailAction(1));
    assertState(state, true, 1);
    state = reducer(state, makeFailAction(2));
    assertState(state, false, 0);
  });
  it('other types have no effect', () => {
    let state = reducer();
    assertState(state, false, 0);
    state = reducer(state, INVALID);
    assertState(state, false, 0);
    state = reducer(state, makeStartAction(1));
    state = reducer(state, INVALID);
    assertState(state, true, 1);
  });
  it('doesn\'t throw errors for invalid actions, missing state', () => {
    reducer();
    reducer(null, 'asdf');
    reducer(null, {});
    reducer('test', 12312);
  });
};


export const runCombinedReducerTests = (asyncConstantType) => {
  it('root reducers updates correctly', () => {
    let types;
    if (asyncConstantType === 'string') types = ['TEST', 'TEST2'];
    if (asyncConstantType === 'object') {
      types = [
        createAsyncConstants('TEST'),
        createAsyncConstants('TEST2'),
      ];
    }
    if (asyncConstantType === 'function') {
      types = [
        createAsyncAction('TEST', () => {}),
        createAsyncAction('TEST2', () => {}),
      ];
    }

    let state = {
      TEST: {
        hasPendingRequests: false,
        pendingRequests: [],
      },
      TEST2: {
        hasPendingRequests: false,
        pendingRequests: [],
      },
    };


    const reducer = createMultipleAsyncReducer(types);

    state = reducer(state, { type: 'START_TEST', meta: { asyncID: 1 } });
    assertState(state.TEST, true, 1);
    assertState(state.TEST2, false, 0);

    state = reducer(state, { type: 'START_TEST2', meta: { asyncID: 2 } });
    assertState(state.TEST, true, 1);
    assertState(state.TEST2, true, 1);

    state = reducer(state, { type: 'SUCCESS_TEST', meta: { asyncID: 1 } });
    assertState(state.TEST, false, 0);
    assertState(state.TEST2, true, 1);

    state = reducer(state, { type: 'FAIL_TEST2', meta: { asyncID: 2 } });
    assertState(state.TEST, false, 0);
    assertState(state.TEST2, false, 0);
  });
};

