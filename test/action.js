import { isFSA } from 'flux-standard-action';
import { assert } from 'chai';
import { createAction } from '../src/action';

const assertIsFSA = action => assert.isTrue(isFSA(action));

describe('createAction()', () => {
  it('should have the correct type', () => {
    const actionCreator = createAction('TEST');
    assert.equal(actionCreator().type, 'TEST');
  });
  it('should have correct payload and meta', () => {
    const actionCreator = createAction('TEST');
    const payload = {};
    const meta = {};
    assert.equal(actionCreator({ payload }).payload, payload);
    assert.equal(actionCreator({ meta }).meta, meta);
  });
  it('error should be true if payload is an error', () => {
    const actionCreator = createAction('TEST');
    assert.isTrue(actionCreator({ payload: Error() }).error);
  });
  it('should have getType and toString method which return the type', () => {
    const actionCreator = createAction('TEST');
    assert.equal(actionCreator.getType(), 'TEST');
    assert.equal(actionCreator.toString(), 'TEST');
  });
  it('should create Flux Standard Actions', () => {
    const actionCreator = createAction('TEST');
    assertIsFSA(actionCreator());
    assertIsFSA(actionCreator({ payload: 'test', meta: 'meta' }));
    assertIsFSA(actionCreator({ payload: Error() }));
  });
});
