 /* eslint-disable */
// const MAIN_TYPE = 'REDUX_SIMPLE_ASYNC_MAIN_TYPE';
import { createAsyncConstants } from './async-constants';
import { createAction } from './action';
import { createAsyncMiddleware } from './middleware';

export default {
  createAsyncConstants,
  createAsyncConstants,
}



  /*
    if types are in createAsyncConstants
      create actions with each type, payload, meta
    if it's just a single name
      internally use createAsyncConstants?
    if it's start, success, fail actions?

   */

// // create an async action for use with the asyncMiddleware. See asyncMiddleware() below for options
// export const createAsyncAction = (id, actionName, fn) => {
//   const actionCreator = function (...args) {
//     const action = fn(...args);
//     return {
//       type: id,
//       ...action,
//       actionName,
//       startAction: actionCreator.start,
//       successAction: actionCreator.success,
//       failAction: actionCreator.fail,
//     };
//   };
//   // attach the name and start, success, and fail actions for convenience
//   actionCreator.start = createAction(`START: ${actionName}`, payloadReducer, metaReducer);
//   actionCreator.success = createAction(`SUCCESS: ${actionName}`, payloadReducer, metaReducer);
//   actionCreator.fail = createAction(`FAIL: ${actionName}`, payloadReducer, metaReducer);
//   actionCreator.actionName = actionName;
//   return actionCreator;
// };
// // // create an async action for use with the asyncMiddleware. See asyncMiddleware() below for options
// // export const createAsyncAction = (id, actionName, fn) => {
// //   const actionCreator = function (...args) {
// //     const action = fn(...args);
// //     return {
// //       type: id,
// //       ...action,
// //       actionName,
// //       startAction: actionCreator.start,
// //       successAction: actionCreator.success,
// //       failAction: actionCreator.fail,
// //     };
// //   };
// //   // attach the name and start, success, and fail actions for convenience
// //   actionCreator.start = createAction(`START: ${actionName}`, payloadReducer, metaReducer);
// //   actionCreator.success = createAction(`SUCCESS: ${actionName}`, payloadReducer, metaReducer);
// //   actionCreator.fail = createAction(`FAIL: ${actionName}`, payloadReducer, metaReducer);
// //   actionCreator.actionName = actionName;
// //   return actionCreator;
// // };
