import { assert } from 'chai';
import { isValidAsyncConstant } from '../src/async-constants';

describe('isValidAsyncConstant()', () => {
  let asyncConst =
  beforeEach(() => {
    asyncConst = {
      NAME: 'TEST',
      START_TYPE: 'START_TEST',
      FAIL_TYPE: 'FAIL_TEST',
      SUCCESS_TYPE: 'SUCCESS_TEST',
    };
  });
  it('identifies an async constant', () => {
    assert.isTrue(isValidAsyncConstant(asyncConst));
  });
  it('returns false for invalid types', () => {
    assert.isFalse(isValidAsyncConstant(true));
    assert.isFalse(isValidAsyncConstant(''));
    assert.isFalse(isValidAsyncConstant([]));
    assert.isFalse(isValidAsyncConstant(1234));
  });
  it('returns false if missing any of the NAME', () => {
    delete asyncConst.NAME;
    assert.isFalse(isValidAsyncConstant(asyncConst));
  });
});

describe('createAsyncConstants()', () => {
  it('should have all the proper keys', () => {

  });
});
