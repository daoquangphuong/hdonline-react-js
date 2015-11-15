'use strict';

exports.__esModule = true;
exports['default'] = decode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var _lodashGet = require('lodash.get');

var _lodashGet2 = _interopRequireDefault(_lodashGet);

var _defined = require('./defined');

var _defined2 = _interopRequireDefault(_defined);

function decode(list, key) {
  if (_defined2['default'](list, key)) {
    var value = _lodashGet2['default'](list, key);
    if (Array.isArray(value)) {
      return value.map(_he2['default'].decode);
    }
    return value ? _he2['default'].decode(value) : '';
  }
}

module.exports = exports['default'];