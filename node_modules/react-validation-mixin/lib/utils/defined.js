'use strict';

exports.__esModule = true;
exports['default'] = defined;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isSome = require('./isSome');

var _isSome2 = _interopRequireDefault(_isSome);

function defined() {
  for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  if (Array.isArray(items)) {
    return items.every(function (item) {
      return !_isSome2['default'](item, null, undefined);
    });
  }
  return false;
}

module.exports = exports['default'];