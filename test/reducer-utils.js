import { assert } from 'chai';
import { createCombinedAsyncReducer } from '../src/reducer';
import { createAsyncAction } from '../src/async-action';
import { createAsyncConstants } from '../src/async-constants';

const assertState = (state, hasPendingRequests, pendingRequests) => {
  assert.equal(state.hasPendingRequests, hasPendingRequests);
  assert.equal(state.pendingRequests, pendingRequests);
};

export const runSingleReducerTests = (reducer, name) => {
  const INVALID = { type: 'SOME_OTHER_ACTION_TYPE' };
  let START_TYPE;
  let SUCCESS_TYPE;
  let FAIL_TYPE;

  beforeEach(() => {
    START_TYPE = { type: `START_${name}` };
    SUCCESS_TYPE = { type: `SUCCESS_${name}` };
    FAIL_TYPE = { type: `FAIL_${name}` };
  });
  it('initial state is no pending requests', () => {
    const state = reducer();
    assertState(state, false, 0);
  });
  it('start adds to pending requests', () => {
    let state = reducer();
    assertState(state, false, 0);
    state = reducer(state, START_TYPE);
    assertState(state, true, 1);
    state = reducer(state, START_TYPE);
    assertState(state, true, 2);
  });
  it('success removes pending requests', () => {
    let state = reducer();
    state = reducer(state, START_TYPE);
    state = reducer(state, START_TYPE);
    assertState(state, true, 2);
    state = reducer(state, SUCCESS_TYPE);
    assertState(state, true, 1);
    state = reducer(state, SUCCESS_TYPE);
    assertState(state, false, 0);
  });
  it('fail removes pending requests', () => {
    let state = reducer();
    state = reducer(state, START_TYPE);
    state = reducer(state, START_TYPE);
    assertState(state, true, 2);
    state = reducer(state, FAIL_TYPE);
    assertState(state, true, 1);
    state = reducer(state, FAIL_TYPE);
    assertState(state, false, 0);
  });
  it('other types have no effect', () => {
    let state = reducer();
    assertState(state, false, 0);
    state = reducer(state, INVALID);
    assertState(state, false, 0);
    state = reducer(state, START_TYPE);
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
    let state = {
      TEST: {
        hasPendingRequests: false,
        pendingRequests: 0,
      },
      TEST2: {
        hasPendingRequests: false,
        pendingRequests: 0,
      },
    };
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


    const reducer = createCombinedAsyncReducer(types);
    assert.deepEqual(reducer(), state);

    state = reducer(state, { type: 'START_TEST' });
    assert.deepEqual(state, {
      TEST: {
        hasPendingRequests: true,
        pendingRequests: 1,
      },
      TEST2: {
        hasPendingRequests: false,
        pendingRequests: 0,
      },
    });

    state = reducer(state, { type: 'START_TEST2' });
    assert.deepEqual(state, {
      TEST: {
        hasPendingRequests: true,
        pendingRequests: 1,
      },
      TEST2: {
        hasPendingRequests: true,
        pendingRequests: 1,
      },
    });

    state = reducer(state, { type: 'SUCCESS_TEST' });
    assert.deepEqual(state, {
      TEST: {
        hasPendingRequests: false,
        pendingRequests: 0,
      },
      TEST2: {
        hasPendingRequests: true,
        pendingRequests: 1,
      },
    });

    state = reducer(state, { type: 'FAIL_TEST2' });
    assert.deepEqual(state, {
      TEST: {
        hasPendingRequests: false,
        pendingRequests: 0,
      },
      TEST2: {
        hasPendingRequests: false,
        pendingRequests: 0,
      },
    });
  });
};

