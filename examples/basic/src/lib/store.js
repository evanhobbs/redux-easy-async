import { createAsyncMiddleware } from '@nerdwallet/redux-easy-async';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

export default () => {
  const asyncMiddleware = createAsyncMiddleware();
  const loggerMiddleware = createLogger();
  return createStore(rootReducer, applyMiddleware(asyncMiddleware, loggerMiddleware));
};
