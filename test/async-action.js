import { assert } from 'chai';
import { createAsyncAction } from '../src/async-action';

describe('createAsyncAction()', () => {
  it('throws an error if type is missing or invalid', () => {
    assert.throws(createAsyncAction);
    assert.throws(() => createAsyncAction({
      START_TYPE: 'START_TEST',
      SUCCESS_TYPE: 'SUCCESS_TEST',
      FAIL_TYPE: 'FAIL_TEST',
    }));
    assert.throws(() => createAsyncAction(123));
    assert.throws(() => createAsyncAction({}));
    assert.throws(() => createAsyncAction(true));
    assert.throws(() => createAsyncAction([]));
  });

  it('returns a decorated action creator for type as a string', () => {
    const fn = createAsyncAction('TEST', () => {});
    assert.equal(fn.START_TYPE, 'START_TEST');
    assert.equal(fn.SUCCESS_TYPE, 'SUCCESS_TEST');
    assert.equal(fn.FAIL_TYPE, 'FAIL_TEST');
    assert.equal(fn.actionName, 'TEST');
    assert.isFunction(fn.start);
    assert.isFunction(fn.success);
    assert.isFunction(fn.fail);
  });

  it('returns a decorated action creator for constants object', () => {
    const asyncConstants = {
      NAME: 'TEST',
      START_TYPE: 'START_TEST',
      SUCCESS_TYPE: 'SUCCESS_TEST',
      FAIL_TYPE: 'FAIL_TEST',
    };
    const fn = createAsyncAction(asyncConstants, () => {});
    assert.equal(fn.START_TYPE, asyncConstants.START_TYPE);
    assert.equal(fn.SUCCESS_TYPE, asyncConstants.SUCCESS_TYPE);
    assert.equal(fn.FAIL_TYPE, asyncConstants.FAIL_TYPE);
    assert.equal(fn.actionName, asyncConstants.NAME);
    assert.isFunction(fn.start);
    assert.isFunction(fn.success);
    assert.isFunction(fn.fail);
  });
});
