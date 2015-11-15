'use strict';

var _chai = require('chai');

var _srcUtils = require('../../src/utils');

describe('isSome', function () {
  it('ensures strictly equal to single argument', function () {
    var item;
    var result = _srcUtils.isSome(item, undefined);
    _chai.expect(result).to.equal(true);
  });
  it('ensures strictly equal to multiple arguments', function () {
    var item;
    var result = _srcUtils.isSome(item, undefined, null);
    _chai.expect(result).to.equal(true);
  });
  it('ensures returns false when no arguments provided', function () {
    var item;
    var result = _srcUtils.isSome(item);
    _chai.expect(result).to.equal(false);
  });
  it('ensures strictly equal to multiple arguments negative', function () {
    var item = 'a';
    var result = _srcUtils.isSome(item, null, undefined);
    _chai.expect(result).to.equal(false);
  });
});