window.moment = require('moment');
window._ = require('lodash');
window.Cookies = require('js-cookie'); // @See https://github.com/js-cookie/js-cookie

import 'core-js/es6/array';
import 'core-js/es6/promise';
import 'core-js/es6/object';

require.ensure([], ()=>{
    require('./app');
});
