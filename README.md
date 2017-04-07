# Redux Easy Async

> Redux Easy Async makes handling asynchronous actions, such as API requests,
> simple, reliable, and powerful.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

![alt tag](https://image.ibb.co/gpFfqa/Screen_Shot_2017_04_06_at_1_54_21_PM.png)
animated gif should be here

## Table of Contents

<!-- toc -->

- [Overview](#overview)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
  * [Track status of requests, show a loading spinner](#track-status-of-requests-show-a-loading-spinner)
- [Working examples](#working-examples)
- [Motivation](#motivation)
- [API](#api)
  * [createAsyncAction](#createasyncaction)
  * [createAsyncMiddleware](#createasyncmiddleware)
  * [createSingleAsyncReducer](#createsingleasyncreducer)
  * [createMultipleAsyncReducer](#createmultipleasyncreducer)
  * [createAsyncConstants](#createasyncconstants)
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

### Track status of requests, show a loading spinner

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
    //    pendingRequests: 0,
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

None.

## API

### createAsyncAction

**Parameters**

-   `type` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))** can either be a string (e.g. \`"GET_POSTS"``) or a
    a constants object created with [createAsyncConstants](#createasyncconstants).
-   `fn` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** action creator function that returns an object with action configuration.
    See example below for configuration options. Only `makeRequest is required`.
-   `options` **\[[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default {})** [description]

**Examples**

_All configuration options for async action_

```javascript
import { createAsyncAction } from '@nerdwallet/redux-easy-async';

const myAction = createAsyncAction('MY_ACTION', () => {
  {
    // function that makes the actual request. Return value must be a promise. In this example
    // `fetch()` returns a promise. **REQUIRED**
    makeRequest: () => fetch('/api/posts'),

    // additional meta that will be passed to the start, success, and fail actions if any.
    // meta will have `actionName` and `asyncType`("start", "success", or "fail"). Success and
    // fail action meta will also have a `requestTime`. *OPTIONAL*
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

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** actionCreator

### createAsyncMiddleware

Creates an instance of middleware necessary to handle dispatched async actions created with
[createAsyncAction](#createasyncaction).

**Parameters**

-   `options` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)](default {})** options to create middleware with.
    -   `options.requestOptions` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** options that will be passed to all actions'
        `makeRequest` functions: e.g. `makeRequest(state, requestOptions)`.
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

### createSingleAsyncReducer

Creates a reducer that automatically tracks the status of a SINGLE async actions created with
[createAsyncAction](#createasyncaction). Unless you are only ever going to have one async action you most
likely want to use: [createMultipleAsyncReducer](#createmultipleasyncreducer).

**Parameters**

-   `type` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function))** of async action to track. Type can be one of the following:
    a string (e.g. \`"GET_POSTS"``), a constants object created with [createAsyncConstants](#createasyncconstants), or
    an async action created with [createAsyncAction](#createasyncaction).

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Redux reducer.

### createMultipleAsyncReducer

Creates a requests reducer that automatically tracks the status of MULTIPLE async actions created
with [createAsyncAction](#createasyncaction).

**Parameters**

-   `types` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function))>** an array of async actions to track. Types can be
    one of the following: a string (e.g. \`"GET_POSTS"``), a constants object created with
    [createAsyncConstants](#createasyncconstants), or an async action created with [createAsyncAction](#createasyncaction).

**Examples**

```javascript
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
//      pendingRequests: 0,
//   },
//   {
//    FETCH_USER: {
//      hasPendingRequests: false,
//      pendingRequests: 0,
//   }
//   {
//    FETCH_COMMENTS: {
//      hasPendingRequests: false,
//      pendingRequests: 0,
//   }
// }
```

Returns **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Redux reducer

### createAsyncConstants

Creates an object with constant keys `NAME`, `START_TYPE`, `SUCCESS_TYPE`, `FAIL_TYPE` in the
format that [createAsyncAction](#createasyncaction), [createMultipleAsyncReducer](#createmultipleasyncreducer), and
[createSingleAsyncReducer](#createsingleasyncreducer) accept.

**Parameters**

-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the base name for this constant, e.g. `"GET_USER"`

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

## Meta

Author: [Evan Hobbs](https://github.com/evanhobbs) - [NerdWallet](https:www.nerdwallet.com)

License: MIT - `LICENSE` for more information.

Todo

-   images/logo
-   finish Motivation section.
-   add error logging in middleware?
-   track request meta in middleware?
