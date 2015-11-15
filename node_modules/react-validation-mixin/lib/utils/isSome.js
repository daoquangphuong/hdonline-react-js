"use strict";

exports.__esModule = true;
exports["default"] = isSome;

function isSome(item) {
  for (var _len = arguments.length, tests = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    tests[_key - 1] = arguments[_key];
  }

  if (Array.isArray(tests)) {
    return tests.some(function (test) {
      return item === test;
    });
  }
  return false;
}

module.exports = exports["default"];