import _ from 'lodash';

/**
 * async constants
 * @typedef {Object} asyncConstants
 * @property {string} NAME the base name for the constant used to construct types
 * @property {string} START start type of the this async action
 * @property {string} SUCCESS success type of the this async action
 * @property {string} FAIL fail type of the this async action
 */

/**
 * Creates an object with constant keys `NAME`, `START`, `SUCCESS`, `FAIL`
 * in the format that `createAsyncAction` expects
 * @return {asyncConstants}
 * @param  {string} name the base name for this constant, e.g. `"GET_USER"`
 * @example
 * const GET_USER = createAsyncConstants('GET_USER');
 * // {
 * //   NAME: 'GET_USER',
 * //   START: 'START_GET_USER',
 * //   SUCCESS: 'SUCCESS_GET_USER',
 * //   FAIL: 'FAIL_GET_USER'
 * // }
 */
export const createAsyncConstants = name => ({
  NAME: name,
  START: `START_${name}`,
  SUCCESS: `SUCCESS_${name}`,
  FAIL: `FAIL_${name}`,
});

const requiredKeys = ['NAME', 'START', 'FAIL', 'SUCCESS'];

export const isAsyncConstant = (obj) => {
  if (typeof obj !== 'object') return false;
  return _.every(requiredKeys, (requiredKey) => {
    const objKey = obj[requiredKey];
    return typeof objKey === 'string' && objKey.length > 0;
  });
};
