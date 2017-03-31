import _ from 'lodash';

/**
 * async constants
 * @typedef {Object} asyncConstants
 * @property {string} NAME the base name for the constant used to construct types
 * @property {string} START_TYPE start type of the this async action
 * @property {string} SUCCESS_TYPE success type of the this async action
 * @property {string} FAIL_TYPE fail type of the this async action
 */

/**
 * Creates an object with constant keys `NAME`, `START_TYPE`, `SUCCESS_TYPE`, `FAIL_TYPE` in the
 * format that `createAsyncAction` expects
 * @return {asyncConstants} returns an object with keys `NAME`, `START_TYPE`, `SUCCESS_TYPE`,
 * `FAIL_TYPE`
 * @param  {string} name the base name for this constant, e.g. `"GET_USER"`
 * @example
 * const GET_USER = createAsyncConstants('GET_USER');
 * // {
 * //   NAME: 'GET_USER',
 * //   START_TYPE: 'START_GET_USER',
 * //   SUCCESS_TYPE: 'SUCCESS_GET_USER',
 * //   FAIL_TYPE: 'FAIL_GET_USER'
 * // }
 */
export const createAsyncConstants = name => ({
  NAME: name,
  START_TYPE: `START_${name}`,
  SUCCESS_TYPE: `SUCCESS_${name}`,
  FAIL_TYPE: `FAIL_${name}`,
});

const requiredKeys = ['NAME', 'START_TYPE', 'FAIL_TYPE', 'SUCCESS_TYPE'];

export const isValidAsyncConstant = (obj) => {
  if (['object', 'function'].indexOf(typeof obj) === -1) return false;
  return _.every(requiredKeys, (requiredKey) => {
    const objKey = obj[requiredKey];
    return typeof objKey === 'string' && objKey.length > 0;
  });
};

export const getOrCreateAsyncConstants = (type) => {
  if (typeof type === 'string' && type.length) return createAsyncConstants(type);
  else if (isValidAsyncConstant(type)) return type;
  return null;
};
