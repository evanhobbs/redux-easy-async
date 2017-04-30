import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'whatwg-fetch';
import App from './App';
import './css/index.css';
import createStore from './lib/store';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
