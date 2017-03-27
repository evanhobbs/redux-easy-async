import { assert } from 'chai';
import { isAsyncConstant } from '../src/async-constants';

describe('isAsyncConstant()', () => {
  let asyncConst =
  beforeEach(() => {
    asyncConst = {
      NAME: 'TEST',
      START: 'START_TEST',
      FAIL: 'FAIL_TEST',
      SUCCESS: 'SUCCESS_TEST',
    };
  });
  it('identifies an async constant', () => {
    assert.isTrue(isAsyncConstant(asyncConst));
  });
  it('returns false for invalid types', () => {
    assert.isFalse(isAsyncConstant(true));
    assert.isFalse(isAsyncConstant(''));
    assert.isFalse(isAsyncConstant([]));
    assert.isFalse(isAsyncConstant(1234));
  });
  it('returns false if missing any of the NAME', () => {
    delete asyncConst.NAME;
    assert.isFalse(isAsyncConstant(asyncConst));
  });
});

describe('createAsyncConstants()', () => {
  it('should have all the proper keys', () => {

  });
});
