'use strict';

var ReactDOM = require('react-dom');
var React = require('react');
var { Provider } = require('react-redux');

var store = require('./redux/store');
var Recordset = require('./components/Recordset');

ReactDOM.render(
    <Provider store={store}>
        <Recordset />
    </Provider>,
    document.getElementById('recordset')
);
