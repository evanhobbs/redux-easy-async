import { assert } from 'chai';
import { createAsyncAction } from '../src/async-action';

describe('createAsyncAction()', () => {
  it('throws an error if type is missing or invalid', () => {
    assert.throws(createAsyncAction);
    assert.throws(() => createAsyncAction({
      START: 'START_TEST',
      SUCCESS: 'SUCCESS_TEST',
      FAIL: 'FAIL_TEST',
    }));
    assert.throws(() => createAsyncAction(123));
    assert.throws(() => createAsyncAction({}));
    assert.throws(() => createAsyncAction(true));
    assert.throws(() => createAsyncAction([]));
  });

  it('returns a decorated action creator for type as a string', () => {
    const fn = createAsyncAction('TEST', () => {});
    assert.equal(fn.START, 'START_TEST');
    assert.equal(fn.SUCCESS, 'SUCCESS_TEST');
    assert.equal(fn.FAIL, 'FAIL_TEST');
    assert.equal(fn.actionName, 'TEST');
    assert.isFunction(fn.startFn);
    assert.isFunction(fn.successFn);
    assert.isFunction(fn.failFn);
  });

  it('returns a decorated action creator for constants object', () => {
    const asyncConstants = {
      NAME: 'TEST',
      START: 'START_TEST',
      SUCCESS: 'SUCCESS_TEST',
      FAIL: 'FAIL_TEST',
    };
    const fn = createAsyncAction(asyncConstants, () => {});
    assert.equal(fn.START, asyncConstants.START);
    assert.equal(fn.SUCCESS, asyncConstants.SUCCESS);
    assert.equal(fn.FAIL, asyncConstants.FAIL);
    assert.equal(fn.actionName, asyncConstants.NAME);
    assert.isFunction(fn.startFn);
    assert.isFunction(fn.successFn);
    assert.isFunction(fn.failFn);
  });
});
