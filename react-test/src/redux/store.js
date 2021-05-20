'use strict';

var reduxTK = require('@reduxjs/toolkit');

var refReducer = require('./features/referenceSlice');

module.exports = reduxTK.configureStore({
  reducer: {
    reference: refReducer
  }
});
