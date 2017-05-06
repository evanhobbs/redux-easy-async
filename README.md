# Redux Easy Async

> Redux Easy Async makes handling asynchronous actions, such as API requests,
> simple, reliable, and powerful.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/66ca27e3eae44e46900c81feb1921c7d)](https://www.codacy.com/app/evanhobbs/redux-easy-async?utm_source=github.com&utm_medium=referral&utm_content=evanhobbs/redux-easy-async&utm_campaign=badger)
[![Build Status](https://travis-ci.org/evanhobbs/redux-easy-async.svg?branch=master)](https://travis-ci.org/evanhobbs/redux-easy-async)
[![Coverage Status](https://coveralls.io/repos/github/evanhobbs/redux-easy-async/badge.svg?branch=master)](https://coveralls.io/github/evanhobbs/redux-easy-async?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/66ca27e3eae44e46900c81feb1921c7d)](https://www.codacy.com/app/evanhobbs/redux-easy-async?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=evanhobbs/redux-easy-async&amp;utm_campaign=Badge_Grade)

## Table of Contents

<!-- toc -->

- [Overview](#overview)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
  * [Automatially track request status, show a loading spinner](#automatially-track-request-status-show-a-loading-spinner)
- [Working examples](#working-examples)
- [Motivation](#motivation)
- [API](#api)
  * [createAsyncAction(type, fn, [options]) ⇒ function](#createasyncactiontype-fn-options--function)
  * [createAsyncConstants(type) ⇒ object](#createasyncconstantstype--object)
  * [createAsyncMiddleware(options) ⇒ function](#createasyncmiddlewareoptions--function)
  * [createSingleAsyncReducer(type) ⇒ function](#createsingleasyncreducertype--function)
  * [createMultipleAsyncReducer(types) ⇒ function](#createmultipleasyncreducertypes--function)
- [Meta](#meta)

<!-- tocstop -->

## Overview

Redux is fantastic tool for managing application state but since actions, by their
very nature, are synchronous, asynchronous requests (such as to APIs) can be
more challenging. Standard approaches involve a lot of boilerplate, reinventing
the wheel, and opportunity for error. For more info see: [Motivation](#motivation)

Redux Easy Async provides a simple yet powerful approach for creating and
tracking asynchronous actions. Features:

-   Create asynchronous actions (including associated constants for start,
    success, and fail) with a single call.
-   Create reducer(s) that automatically track the status of asynchronous actions,
    i.e. pending, completed. No more dispatching loading actions or storing
    `isFetching` state.
-   Optional configuration to parse API responses pre-reducer, conditionally
    make requests, prevent multiple requests, and more.
-   Makes all your dreams come true and turns you into the person you always
    wanted to be.

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

1.  Add the async middleware to wherever you create your redux store:

    ```javascript
    // assuming have created and imported a root reducer:
    // e.g. import rootReducer from './reducers';
    import { createStore, applyMiddleware } from 'redux';
    import { createAsyncMiddleware } from '@nerdwallet/redux-easy-async';

    const asyncMiddleware = createAsyncMiddleware();
    createStore(rootReducer, applyMiddleware(asyncMiddleware));
    ```

2.  Create an async action:

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

3.  Handle the action in a reducer somewhere:

    ```javascript
    const usersReducer = (state = {}, action) => {
      const { type, payload } = action;
      switch (type) {
        case fetchUser.SUCCESS_TYPE:
          // do something here on succcess
        case fetchUser.FAIL_TYPE:
          // do something here with fail
        default:
          return state;
      }
    };
    ```

4.  Dispatch the action somewhere in your app:

    ```javascript
    dispatch(fetchUser(1));
    ```

5.  Profit!

## Advanced Usage

### Automatially track request status, show a loading spinner

1.  add a requests reducer that will track all async actions:

    ```javascript
    import { createMultipleAsyncReducer } from '@nerdwallet/redux-easy-async';
    // createMultipleAsyncReducer takes an array of async actions and returns
    // a reducer that tracks them
    const requestsReducer = createMultipleAsyncReducer([fetchPost]);
    // now you have a reducer with keys for each each action passed to it
    // {
    //  FETCH_USER: {
    //    hasPendingRequests: false,
    //    pendingRequests: [],
    //  }
    // }
    ```

2.  Add the requests reducer to your main reducer somewhere:

    ```javascript
    import { combineReducers } from 'redux';

    const rootReducer = combineReducers({
      requests: requestsReducer,
      // ...the other reducers for your app here
    });
    ```

3.  Show loading spinner in a component somewhere:

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

## Working examples

The examples directory includes fully working examples which you can run locally and test out Redux Easy Async.

1.  Install dependencies for the example you want to try (with npm or yarn):

    ```sh
    > cd examples/basic
    > npm install (or yarn install)
    ```

2.  Start the server

        > npm start (or yarn start)

3.  Go to `http://localhost:4001/` in your browser.

## Motivation

- http://redux.js.org/docs/advanced/AsyncActions.html
- loading or not loading should just be a status not a seperate loading action

## API


<!-- AUTO_GENERATED_API_SECTION -->
<a name="createAsyncAction"></a>

### createAsyncAction(type, fn, [options]) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - actionCreator  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> \| <code>object</code> |  | can either be a string (e.g. "GET_POSTS") or a a constants object created with [createAsyncConstants](#createAsyncConstants). |
| fn | <code>function</code> |  | action creator function that returns an object with action configuration. See example below for configuration options. Only `makeRequest is required`. |
| [options] | <code>Object</code> |  | additional configuration options |
| [options.middlewareMainType] | <code>Object</code> | <code>REDUX_EASY_ASYNC_MAIN_TYPE</code> | the middleware action type this action will be dispatched with. You most likely don't want to modify this unless for some reason you want multiple instances of [async middleware](#createAsyncMiddleware). |

**Example** *(All configuration options for async action)*  
```js
import { createAsyncAction } from '@nerdwallet/redux-easy-async';

const myAction = createAsyncAction('MY_ACTION', () => {
  return {
    // function that makes the actual request. Return value must be a promise. In this example
    // `fetch()` returns a promise. **REQUIRED**
    makeRequest: () => fetch('/api/posts'),

    // *OPTIONAL*
    // additional meta that will be passed to the start, success, and fail actions if any. All
    // actions will have the following meta:
    //   - `actionName`
    //   - `asyncType`("start", "success", or "fail")
    //   - `requestStartTime`
    //   - `asyncID`: an unique id for each request
    // Success and fail actions will additionally have:
    //   - `requestDuration`
    //   - `resp`: the raw api response. Because of the nature of the promises errors that
    //     cause the makeRequest promise to be rejected will also get caught here as `resp`
    //     and cause a failed request action.
    meta = {},

    // function that takes your redux state and returns true or false whether to proceed with
    // the request. For example: checking if there is already a similar request in progress or
    // the requested data is already cached. *OPTIONAL*
    shouldMakeRequest = (state) => true,

    // `parseStart`, `parseSuccess`, and `parseSuccess` can be useful if you want to modify
    // raw API responses, errors, etc. before passing them to your reducer. The return value
    // of each becomes the payload for start, success, and fail actions. By default response
    // will not be modified.
    //
    // the return value of `parseStart` becomes the payload for the start action. *OPTIONAL*
    parseStart = () => null,
    // the return value of `parseSuccess` becomes the payload for the success action. *OPTIONAL*
    parseSuccess = resp => resp,
    // the return value of `parseFail` becomes the payload for the fail action. *OPTIONAL*
    parseFail = resp => resp,
  }

})
```

* * *

<a name="createAsyncConstants"></a>

### createAsyncConstants(type) ⇒ <code>object</code>
Creates an object with constant keys `NAME`, `START_TYPE`, `SUCCESS_TYPE`, `FAIL_TYPE` in the
format that [createAsyncAction](#createAsyncAction), [createMultipleAsyncReducer](#createMultipleAsyncReducer), and
[createSingleAsyncReducer](#createSingleAsyncReducer) accept.

**Kind**: global function  
**Returns**: <code>object</code> - returns an object with keys: `NAME`, `START_TYPE`, `SUCCESS_TYPE`, and
`FAIL_TYPE`  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | the base name for this constant, e.g. `"GET_USER"` |

**Example**  
```js
const GET_USER = createAsyncConstants('GET_USER');
// {
//   NAME: 'GET_USER', // general name for action
//   START_TYPE: 'START_GET_USER', // start type of the this async action
//   SUCCESS_TYPE: 'SUCCESS_GET_USER', // success type of the this async action
//   FAIL_TYPE: 'FAIL_GET_USER' // fail type of the this async action
// }
```

* * *

<a name="createAsyncMiddleware"></a>

### createAsyncMiddleware(options) ⇒ <code>function</code>
Creates an instance of middleware necessary to handle dispatched async actions created with
[createAsyncAction](#createAsyncAction).

**Kind**: global function  
**Returns**: <code>function</code> - redux middleware for handling async actions  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | options to create middleware with. |
| [options.requestOptions] | <code>object</code> | <code>{}</code> | options that will be passed to all action's `makeRequest` functions: e.g. `makeRequest(state, requestOptions)`. |
| [options.middlewareMainType] | <code>string</code> | <code>&quot;REDUX_EASY_ASYNC_MAIN_TYPE&quot;</code> | the action type the middleware will listen for. You most likely don't want to modify this unless for some reason you want multiple instances of async middleware. |

**Example**  
```js
import { createAsyncMiddleware } from 'redux-easy-async';
const asyncMiddleware = createAsyncMiddleware();

...

// Now add to your middlewares whereever your store is created.
// Typically this looks something like:
// const middlewares = [asyncMiddleware, ...other middlewares]
```

* * *

<a name="createSingleAsyncReducer"></a>

### createSingleAsyncReducer(type) ⇒ <code>function</code>
Creates a reducer that automatically tracks the status of a SINGLE async actions created with
[createAsyncAction](#createAsyncAction). Unless you are only ever going to have one async action you most
likely want to use: [createMultipleAsyncReducer](#createMultipleAsyncReducer).

**Kind**: global function  
**Returns**: <code>function</code> - Redux reducer.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> \| <code>Object</code> \| <code>function</code> | of async action to track. Type can be one of the following: a string (e.g. `"GET_POSTS"``), a constants object created with [createAsyncConstants](#createAsyncConstants), or an async action created with [createAsyncAction](#createAsyncAction). |


* * *

<a name="createMultipleAsyncReducer"></a>

### createMultipleAsyncReducer(types) ⇒ <code>function</code>
Creates a requests reducer that automatically tracks the status of MULTIPLE async actions created
with [createAsyncAction](#createAsyncAction).

**Kind**: global function  
**Returns**: <code>function</code> - Redux reducer  

| Param | Type | Description |
| --- | --- | --- |
| types | <code>Array.&lt;(String\|Object\|function())&gt;</code> | an array of async actions to track. Types can be one of the following: a string (e.g. `"GET_POSTS"``), a constants object created with [createAsyncConstants](#createAsyncConstants), or an async action created with [createAsyncAction](#createAsyncAction). |

**Example**  
```js
import { createAsyncAction, createAsyncConstants } from '@nerdwallet/redux-easy-async';

// Types can async action, constants object, or string:

// string constant
const FETCH_POSTS = 'FETCH_POSTS';

// async action
export const fetchUser = createAsyncAction('FETCH_USER', (id) => {
  return {
    makeRequest: () => fetch(`https://myapi.com/api/user/${id}`),
  };
});

// async constant
const fetchComments = createAsyncConstants('FETCH_COMMENTS');

const requestsReducer = createMultipleAsyncReducer([FETCH_POSTS, fetchUser, fetchComments]);

// Now `requestsReducer` is reducer that automatically tracks each of the asynchronous action
// types.
// {
//   {
//    FETCH_POSTS: {
//      hasPendingRequests: false,
//      pendingRequests: [],
//   },
//   {
//    FETCH_USER: {
//      hasPendingRequests: false,
//      pendingRequests: [],
//   }
//   {
//    FETCH_COMMENTS: {
//      hasPendingRequests: false,
//      pendingRequests: [],
//   }
// }
```

* * *


<!-- AUTO_GENERATED_API_SECTION -->


## Meta

Author: [Evan Hobbs](https://github.com/evanhobbs) - [NerdWallet](https://www.nerdwallet.com)

License: MIT - `LICENSE` for more information.

Todo

-   images/logo
-   finish Motivation section.
-   add error logging in middleware?
-   add more complicated example
