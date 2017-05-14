import { assert } from 'chai';
import { createAsyncAction } from '../src/async-action';

describe('Async Actions', () => {
  describe('createAsyncAction()', () => {
    it('throws error if type is missing or invalid', () => {
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
      assert.equal(fn.actionName, asyncConstants.NAME);
      assert.equal(fn.START_TYPE, asyncConstants.START_TYPE);
      assert.equal(fn.SUCCESS_TYPE, asyncConstants.SUCCESS_TYPE);
      assert.equal(fn.FAIL_TYPE, asyncConstants.FAIL_TYPE);
      assert.isFunction(fn.start);
      assert.isFunction(fn.success);
      assert.isFunction(fn.fail);
    });
    it('action creator has correct type', () => {
      const fn = createAsyncAction('TEST', () => ({
        makeRequest: () => {},
      }));
      assert.equal(fn().type, 'REDUX_EASY_ASYNC_NAMESPACE');
    });
    it('action creator can have a custom middleware main type', () => {
      const fn = createAsyncAction('TEST', () => ({
        makeRequest: () => {},
      }), {
        namespace: 'MAIN_TEST_TYPE',
      });
      assert.equal(fn().type, 'MAIN_TEST_TYPE');
    });
    it('start, success, and fail action creators have correct type', () => {
      const fn = createAsyncAction('TEST', () => {});
      assert.equal(fn.start().type, 'START_TEST');
      assert.equal(fn.success().type, 'SUCCESS_TEST');
      assert.equal(fn.fail().type, 'FAIL_TEST');
    });
    it('action creator returns and action with all correct attributes', () => {
      const makeRequest = () => {};
      const meta = {};
      const shouldMakeRequest = () => true;
      const parseStart = () => null;
      const parseSuccess = resp => resp;
      const parseFail = resp => resp;

      const fn = createAsyncAction('TEST', () => ({
        makeRequest,
        meta,
        shouldMakeRequest,
        parseStart,
        parseSuccess,
        parseFail,
      }));

      const action = fn();

      // auto generated attributes
      assert.propertyVal(action, 'type', 'REDUX_EASY_ASYNC_NAMESPACE');
      assert.propertyVal(action, 'actionName', 'TEST');
      assert.propertyVal(action, 'startActionCreator', fn.start);
      assert.propertyVal(action, 'successActionCreator', fn.success);
      assert.propertyVal(action, 'failActionCreator', fn.fail);

      // manually generated attributes
      assert.propertyVal(action, 'makeRequest', makeRequest);
      assert.propertyVal(action, 'meta', meta);
      assert.propertyVal(action, 'shouldMakeRequest', shouldMakeRequest);
      assert.propertyVal(action, 'parseStart', parseStart);
      assert.propertyVal(action, 'parseSuccess', parseSuccess);
      assert.propertyVal(action, 'parseFail', parseFail);
    });
    it('throws error if action creator does not return an object with a makeRequest function', () => {
      let fn = createAsyncAction('TEST', () => {});
      assert.throws(fn);
      fn = createAsyncAction('TEST', () => ({}));
      assert.throws(fn);
    });
  });
});

