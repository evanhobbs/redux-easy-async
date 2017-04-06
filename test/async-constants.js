import { assert } from 'chai';
import {
  isValidAsyncConstant,
  createAsyncConstants,
  getOrCreateAsyncConstants,
} from '../src/async-constants';

describe('Async Constants', () => {
  let asyncConst;

  beforeEach(() => {
    asyncConst = {
      NAME: 'TEST',
      START_TYPE: 'START_TEST',
      FAIL_TYPE: 'FAIL_TEST',
      SUCCESS_TYPE: 'SUCCESS_TEST',
    };
  });

  describe('isValidAsyncConstant()', () => {
    it('identifies an async constant', () => {
      assert.isTrue(isValidAsyncConstant(asyncConst));
    });
    it('returns false for invalid types', () => {
      assert.isFalse(isValidAsyncConstant(true));
      assert.isFalse(isValidAsyncConstant(''));
      assert.isFalse(isValidAsyncConstant([]));
      assert.isFalse(isValidAsyncConstant(1234));
    });
    it('returns false if missing NAME', () => {
      delete asyncConst.NAME;
      assert.isFalse(isValidAsyncConstant(asyncConst));
    });
    it('returns false if missing START_TYPE', () => {
      delete asyncConst.START_TYPE;
      assert.isFalse(isValidAsyncConstant(asyncConst));
    });
    it('returns false if missing FAIL_TYPE', () => {
      delete asyncConst.FAIL_TYPE;
      assert.isFalse(isValidAsyncConstant(asyncConst));
    });
    it('returns false if missing SUCCESS_TYPE', () => {
      delete asyncConst.SUCCESS_TYPE;
      assert.isFalse(isValidAsyncConstant(asyncConst));
    });
  });

  describe('createAsyncConstants()', () => {
    it('creates an object with all proper keys', () => {
      assert.deepEqual(createAsyncConstants('TEST'), asyncConst);
    });
  });
  describe('getOrCreateAsyncConstants()', () => {
    it('creates a new async constant from a string type', () => {
      assert.deepEqual(getOrCreateAsyncConstants('TEST'), asyncConst);
    });
    it('returns the type if already valid', () => {
      assert.equal(getOrCreateAsyncConstants(asyncConst), asyncConst);
    });
    it('returns null if not a string or valid async const', () => {
      assert.isNull(getOrCreateAsyncConstants({}));
      assert.isNull(getOrCreateAsyncConstants({
        START_TYPE: 'START_TEST',
        FAIL_TYPE: 'FAIL_TEST',
        SUCCESS_TYPE: 'SUCCESS_TEST',
      }));
    });
  });
});
