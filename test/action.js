import { isFSA } from 'flux-standard-action';
import { assert } from 'chai';
import { createAction } from '../src/action';

const assertIsFSA = action => assert.isTrue(isFSA(action));

describe('createAction()', () => {
  it('should create a flux standard action', () => {
    let actionCreator;
    actionCreator = createAction('TEST');
    assertIsFSA(actionCreator());

    actionCreator = createAction('TEST');
    assertIsFSA(actionCreator({
      payload: Error(),
    }));
  });
});
