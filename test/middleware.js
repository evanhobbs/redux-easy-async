import { assert } from 'chai';
import configureStore from 'redux-mock-store';
import { createAsyncMiddleware } from '../src/middleware';
import { createAction } from '../src/action';

const makeTestAction = args => ({
  type: 'REDUX_EASY_ASYNC_NAMESPACE',
  actionName: 'TEST',
  startActionCreator: createAction('TEST_START'),
  successActionCreator: createAction('TEST_SUCCESS'),
  failActionCreator: createAction('TEST_FAIL'),
  ...args,
});

describe('createAsyncMiddleware()', () => {
  let store;

  beforeEach(() => {
    store = configureStore([createAsyncMiddleware()])({});
  });

  it('should not handle the action if not the correct middleware main type', () => {
    const action = { type: 'SOME_OTHER_TYPE' };
    const result = store.dispatch(action);
    // dispatch returns the dispatched action by default
    assert.equal(result, action);
    assert.lengthOf(store.getActions(), 1);
  });
  it('throws error if makeRequest doesn\'t return a promise', () => {
    const action = makeTestAction({
      makeRequest: () => {},
    });
    assert.throws(() => { store.dispatch(action); });
  });
  it('returns false and doesn\'t do anything if shouldMakeRequest returns false', () => {
    const action = makeTestAction({
      shouldMakeRequest: () => false,
    });
    const result = store.dispatch(action);
    assert.isFalse(result);
    assert.lengthOf(store.getActions(), 0);
  });
  it('returns a promise', () => {
    const action = makeTestAction({
      makeRequest: () => new Promise(() => {}),
    });
    const result = store.dispatch(action);
    assert.isFunction(result.then);
  });
  describe('start action', () => {
    it('has correct type', () => {
      const action = makeTestAction({
        makeRequest: () => new Promise(() => {}),
      });
      store.dispatch(action);
      const startAction = store.getActions()[0];
      assert.equal(startAction.type, 'TEST_START');
    });
    it('gets called with correct meta', () => {
      const action = makeTestAction({
        makeRequest: () => new Promise(() => {}),
        meta: {
          something: 'something',
        },
      });
      store.dispatch(action);
      const startAction = store.getActions()[0];
      const { meta } = startAction;
      // tough to be exact but make sure start time is a number fairly close to now
      assert.approximately(meta.requestStartTime, Date.now(), 100);
      assert.equal(meta.something, 'something');
      assert.equal(meta.actionName, 'TEST');
      assert.equal(meta.asyncType, 'start');
      // make sure unique id is in the format we expect
      assert.match(meta.asyncID, /asyncID\d+/);
    });
    it('payload is undefined if no parseStart()`', () => {
      const action = makeTestAction({
        makeRequest: () => new Promise(() => {}),
      });
      store.dispatch(action);
      const startAction = store.getActions()[0];
      assert.isNull(startAction.payload);
    });
    it('payload is the result of parseStart() it present', () => {
      const action = makeTestAction({
        makeRequest: () => new Promise(() => {}),
        parseStart: () => 'testing123',
      });
      store.dispatch(action);
      const startAction = store.getActions()[0];
      assert.equal(startAction.payload, 'testing123');
    });
  });
  describe('success action', () => {
    let action;
    beforeEach(() => {
      action = makeTestAction({
        makeRequest: () => new Promise((resolve) => {
          setTimeout(() => resolve('testing123'), 5);
        }),
      });
    });

    it('has the correct type', (done) => {
      store.dispatch(action).then(() => {
        const successAction = store.getActions()[1];
        assert.equal(successAction.type, 'TEST_SUCCESS');
        done();
      });
    });

    it('payload is the resolved value of the promise', (done) => {
      store.dispatch(action).then(() => {
        const successAction = store.getActions()[1];
        assert.equal(successAction.payload, 'testing123');
        done();
      });
    });

    it('payload is the value of parseSuccess if present', (done) => {
      store.dispatch({
        ...action,
        parseSuccess: resp => resp + resp,
      }).then(() => {
        const successAction = store.getActions()[1];
        assert.equal(successAction.payload, 'testing123testing123');
        done();
      });
    });

    it('has the correct meta', (done) => {
      store.dispatch({
        ...action,
        meta: {
          test: 'something',
          test2: 'somethingelse',
        },
      }).then(() => {
        const successAction = store.getActions()[1];
        const { meta } = successAction;
        // user meta`
        assert.equal(meta.test, 'something');
        assert.equal(meta.test2, 'somethingelse');
        // auto meta
        assert.equal(meta.actionName, 'TEST');
        assert.equal(meta.resp, 'testing123');
        assert.equal(meta.asyncType, 'success');
        // tough to be exact but make sure start time is a number fairly close to now
        assert.approximately(meta.requestStartTime, Date.now(), 100);
        assert.isNumber(meta.requestDuration);
        assert.isTrue(meta.requestDuration > 0);
        // make sure unique id is in the format we expect
        assert.match(meta.asyncID, /asyncID\d+/);
        done();
      });
    });
  });
  describe('fail action', () => {
    let action;
    beforeEach(() => {
      action = makeTestAction({
        makeRequest: () => new Promise((resolve, reject) => {
          setTimeout(() => reject('testing123'), 5);
        }),
      });
    });

    it('has the correct type', (done) => {
      store.dispatch(action).catch(() => {
        const failAction = store.getActions()[1];
        assert.equal(failAction.type, 'TEST_FAIL');
        done();
      });
    });

    it('payload is the resolved value of the promise', (done) => {
      store.dispatch(action).catch(() => {
        const failAction = store.getActions()[1];
        assert.equal(failAction.payload, 'testing123');
        done();
      });
    });

    it('payload is the value of parseFail if present', (done) => {
      store.dispatch({
        ...action,
        parseFail: resp => resp + resp,
      }).catch(() => {
        const failAction = store.getActions()[1];
        assert.equal(failAction.payload, 'testing123testing123');
        done();
      });
    });

    it('has the correct meta', (done) => {
      store.dispatch({
        ...action,
        meta: {
          test: 'something',
          test2: 'somethingelse',
        },
      }).catch(() => {
        const failAction = store.getActions()[1];
        const { meta } = failAction;
        // user meta
        assert.equal(meta.test, 'something');
        assert.equal(meta.test2, 'somethingelse');
        // auto meta
        assert.equal(meta.actionName, 'TEST');
        assert.equal(meta.asyncType, 'fail');
        assert.equal(meta.resp, 'testing123');
        // tough to be exact but make sure start time is a number fairly close to now
        assert.approximately(meta.requestStartTime, Date.now(), 100);
        assert.isNumber(meta.requestDuration);
        assert.isTrue(meta.requestDuration > 0);
        // make sure unique id is in the format we expect
        assert.match(meta.asyncID, /asyncID\d+/);
        done();
      });
    });
  });
});
