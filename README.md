## Overview

![alt tag](https://image.ibb.co/gpFfqa/Screen_Shot_2017_04_06_at_1_54_21_PM.png)

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
