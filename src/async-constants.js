import _ from 'lodash';

/**
 * Creates an object with constant keys `NAME`, `START_TYPE`, `SUCCESS_TYPE`, `FAIL_TYPE` in the
 * format that {@link createAsyncAction} expects
 * @param  {string} name - the base name for this constant, e.g. `"GET_USER"`
 * @return {object} returns an object with keys: `NAME`, `START_TYPE`, `SUCCESS_TYPE`, and
 * `FAIL_TYPE`
 * @example
 * const GET_USER = createAsyncConstants('GET_USER');
 * // {
 * //   NAME: 'GET_USER', // general name for action
 * //   START_TYPE: 'START_GET_USER', // start type of the this async action
 * //   SUCCESS_TYPE: 'SUCCESS_GET_USER', // success type of the this async action
 * //   FAIL_TYPE: 'FAIL_GET_USER' // fail type of the this async action
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
