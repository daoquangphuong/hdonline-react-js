'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodashIsempty = require('lodash.isempty');

var _lodashIsempty2 = _interopRequireDefault(_lodashIsempty);

var _lodashGet = require('lodash.get');

var _lodashGet2 = _interopRequireDefault(_lodashGet);

var _utils = require('./utils');

exports['default'] = function (strategy) {
  var _strategy = typeof strategy === 'function' ? strategy() : strategy;
  _invariant2['default'](_utils.defined(_strategy), 'Validation strategy not provided. A user provided strategy is expected.');
  _invariant2['default'](typeof _strategy !== 'function', 'Validation strategy improperly initialized. Refer to documentation of the provided strategy.');
  return _extends({
    getValidationMessages: function getValidationMessages(errors, key) {
      if (errors === undefined) errors = {};

      if (_lodashIsempty2['default'](errors)) {
        return [];
      }
      if (key === undefined) {
        return Object.keys(errors).map(_utils.decode.bind(this, errors));
      }
      return _utils.decode(errors, key);
    },
    isValid: function isValid(errors, key) {
      if (!_utils.defined(key)) return _lodashIsempty2['default'](errors);
      return _lodashIsempty2['default'](_lodashGet2['default'](errors, key));
    }
  }, _strategy);
};

module.exports = exports['default'];