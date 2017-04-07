# Redux Easy Async
> Redux Easy Async makes handling asynchronous actions, such as API requests,
> simple, reliable, and powerful.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

![alt tag](https://image.ibb.co/gpFfqa/Screen_Shot_2017_04_06_at_1_54_21_PM.png)
animated gif should be here

Redux is fantastic tool for managing application state but since actions, by their
very nature, are synchronous, asynchronous requests (such as to APIs) can be
more challenging. Standard approaches involve a lot of boilerplate, reinventing
the wheel, and opportunity for error. For more info see: [Motivation](#motivation)

Redux Easy Async provides a simple yet powerful approach for creating and
tracking asynchronous actions. Features:
* Create asynchronous actions (including associated constants for start,
  success, and fail) with a single call.
* Create reducer(s) that automatically track the status of asynchronous actions,
  i.e. pending, completed. No more dispatching loading actions or storing
  `isFetching` state.
* Optional configuration to parse API responses pre-reducer, conditionally
  make requests, prevent multiple requests, and more.


## Installation

With NPM:
```sh
npm install @nerdwallet/redux-easy-async --save
```
or with Yarn:
```sh
yarn add @nerdwallet/redux-easy-async
```

## Basic Usage
1. Add the async middleware to wherever you create your redux store:
  ```javascript
  // assuming have created and imported a root reducer:
  // e.g. import rootReducer from './reducers';
  import { createStore, applyMiddleware } from 'redux';
  import { createAsyncMiddleware } from '@nerdwallet/redux-easy-async';

  const asyncMiddleware = createAsyncMiddleware();
  createStore(rootReducer, applyMiddleware(asyncMiddleware));
  ```
2. Create an async action:
  ```javascript
  import { createAsyncAction } from '@nerdwallet/redux-easy-async';

  export const fetchUser = createAsyncAction('FETCH_USER', (id) => {
    return {
      makeRequest: () => fetch(`https://myapi.com/api/user/${id}`),
    };
  });
  // fetchUser is now a function that can be dispatched:
  //   const id = 1;
  //   dispatch(fetchUser(id))
  //   
  // but it also has constant attached for start, success, fail
  //   fetchUser.START_TYPE === "START_FETCH_USER"
  //   fetchUser.SUCCESS_TYPE === "SUCCESS_FETCH_USER"
  //   fetchUser.FAIL_TYPE === "FAIL_FETCH_USER"
  ```

3. Handle the action in a reducer somewhere:

  ```javascript
  const usersReducer = (state = {}, action) => {
    const { type, payload } = action;
    switch (type) {
      case fetchUser.SUCCESS_TYPE:
        return {
          ...state,
          [payload.id]: payload
        };
      case fetchUser.FAIL_TYPE:
        return {
          ...state,
          [payload.id]: {
            ...payload,
            error: true,
          },
        };
      default:
        return state;
    }
  };
  ```

4. Dispatch the action somewhere in your app:
  ```javascript
  dispatch(fetchUser(1));
  ```

5. Profit!

**Optional but recommended: Track request status, show a loading spinner**
1. add a requests reducer that will track all async actions:

  ```javascript
  import { createCombinedAsyncReducer } from '@nerdwallet/redux-easy-async';
  // createCombinedAsyncReducer takes an array of async actions and returns
  // a reducer that tracks them
  const requestsReducer = createCombinedAsyncReducer([fetchPost]);
  // now you have a reducer with keys for each each action passed to it
  // `createCombinedAsyncReducer()`:
  // {
  //  FETCH_USER: {
  //    hasPendingRequests: false,
  //    pendingRequests: 0,
  //  }
  // }
  ```

2. Add the requests reducer to your main reducer somewhere:

  ```javascript
  import { combineReducers } from 'redux';

  const rootReducer = combineReducers({
    requests: requestsReducer,
    // ...the other reducers for your app here
  });
  ```

3. Show loading spinner in a component somewhere:

  ```javascript
  // assuming you have the state of the request store, e.g:
  //  const requests = store.getState().requests;
  //  -- or --
  //  const { requests } = this.props;
  //    
  const isLoading = requests.FETCH_USER.hasPendingRequests;
  return (
    <div>
      { isLoading && <div>Show a loading spinner</div> }
      { !isLoading && <div>Show user data</div> }
    </div>);
  ```

## Fully Working examples

The examples directory includes fully working examples which you can run locally and test out Redux Easy Async.

1. Install dependencies for the example you want to try (with npm or yarn):

  ```sh
  > cd examples/basic
  > npm install (or yarn install)
  ```

2. Start the server
  ```
  > npm start (or yarn start)
  ```

3. Go to `http://localhost:4001/` in your browser.

## Motivation

## API

### createAsyncConstants

Creates an object with constant keys `NAME`, `START_TYPE`, `SUCCESS_TYPE`, `FAIL_TYPE` in the
format that [createAsyncAction](#createasyncaction) expects

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the base name for this constant, e.g. `"GET_USER"`

**Examples**

```javascript
const GET_USER = createAsyncConstants('GET_USER');
// {
//   NAME: 'GET_USER', // general name for action
//   START_TYPE: 'START_GET_USER', // start type of the this async action
//   SUCCESS_TYPE: 'SUCCESS_GET_USER', // success type of the this async action
//   FAIL_TYPE: 'FAIL_GET_USER' // fail type of the this async action
// }
```

Returns **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** returns an object with keys: `NAME`, `START_TYPE`, `SUCCESS_TYPE`, and
`FAIL_TYPE`

### createAsyncAction

**Parameters**

-   `type` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))** can either be a string type (e.g. \`"GET_POSTS"``) or a
    an object created with [createAsyncConstants](#createasyncconstants).
-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** action creator function that will be
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default {})** [description]

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** actionCreator

### createAsyncMiddleware

Creates an instance of middleware necessary to handle dispatched async actions created with
[createAsyncAction](#createasyncaction).

**Parameters**

-   `options` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default {})** middleware options
    -   `options.requestOptions` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** if you wish to pass addtional options to all actions'
        `makeRequest` functions: e.g. `makeRequest(state, options)`.
    -   `options.middlewareMainType` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** the action type the
        middleware will listen for. You most likely don't want to modify this unless for some reason
        you want multiple instances of async middleware. (optional, default `"REDUX_EASY_ASYNC_MAIN_TYPE"`)

**Examples**

```javascript
import { createAsyncMiddleware } from 'redux-easy-async';
const asyncMiddleware = createAsyncMiddleware();

...

// Now add to your middlewares whereever your store is created.
// Typically this looks something like:
// const middlewares = [asyncMiddleware, ...other middlewares]
```

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** redux middleware for handling async actions



## Meta

Your Name – [@YourTwitter](https://twitter.com/dbader_org) – YourEmail@example.com

Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/yourname/github-link](https://github.com/dbader/)

[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics

### Acknowledgments
- redux docs
- redux act

Todo
- get some images
- add error logging in middleware?
- track request meta in middleware?
- add Spanish version of readme?
