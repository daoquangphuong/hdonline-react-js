'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _srcValidationFactory = require('../src/validationFactory');

var _srcValidationFactory2 = _interopRequireDefault(_srcValidationFactory);

var _joiValidationStrategy = require('joi-validation-strategy');

var _joiValidationStrategy2 = _interopRequireDefault(_joiValidationStrategy);

var validator = _srcValidationFactory2['default'](_joiValidationStrategy2['default']);

describe('Validation Factory', function () {
  describe('validation()', function () {
    describe('edge cases', function () {
      it('should use `schema` keys on empty schema', function (done) {
        validator.validate({}, undefined, undefined, function (result) {
          _chai.expect(result).to.eql({});
          done();
        });
      });

      it('should use `schema` keys when schema provided', function (done) {
        validator.validate({
          username: _joi2['default'].string()
        }, undefined, undefined, function (result) {
          _chai.expect(result).to.eql({});
          done();
        });
      });

      it('should use `data` keys on empty data', function (done) {
        validator.validate(undefined, {}, undefined, function (result) {
          _chai.expect(result).to.eql({});
          done();
        });
      });

      it('should use `data` keys when data provided', function (done) {
        validator.validate(undefined, {
          username: 'foo'
        }, undefined, function (result) {
          _chai.expect(result).to.eql({});
          done();
        });
      });
    });

    describe('of entire form', function () {
      it('should handle mix of valid, invalid and undefined inputs', function (done) {
        var schema = {
          username: _joi2['default'].string().required(),
          age: _joi2['default'].number(),
          bonus: _joi2['default'].boolean() };
        // data is undefined
        var data = {
          username: '', // invalid
          password: 'qwerty', // valid required
          age: 10, // valid optional
          something: 'xyz' // schema is undefined
        };
        validator.validate(data, schema, undefined, function (result) {
          _chai.expect(result).to.deep.eql({
            username: ['"username" is not allowed to be empty']
          });
          done();
        });
      });

      it('should return multiple errors for multiple failed validations', function (done) {
        var schema = {
          password: _joi2['default'].string().alphanum().min(6)
        };
        var data = {
          password: '???'
        };
        validator.validate(data, schema, undefined, function (result) {
          _chai.expect(result['password']).to.deep.eql(['"password" must only contain alpha-numeric characters', '"password" length must be at least 6 characters long']);
          done();
        });
      });

      it('should use labels from Joi Schema', function (done) {
        var schema = {
          username: _joi2['default'].string().alphanum().min(3).max(30).required().label('Username'),
          password: _joi2['default'].string().regex(/[a-zA-Z0-9]{3,30}/)
        };
        var data = {};
        validator.validate(data, schema, undefined, function (result) {
          _chai.expect(result['username']).to.deep.eql(['"Username" is required']);
          done();
        });
      });

      it('should return array of items when validating an arry', function (done) {
        var schema = {
          list: _joi2['default'].array().items(_joi2['default'].string().required(), _joi2['default'].string().required())
        };
        var data = {
          list: ['only one item']
        };
        validator.validate(data, schema, undefined, function (result) {
          _chai.expect(result['list']).to.deep.eql(['"list" does not contain 1 required value(s)']);
          done();
        });
      });
    });

    describe('of specified key', function () {
      it('should validate specified key only', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {};

        validator.validate(data, schema, {
          key: 'username'
        }, function (result) {
          _chai.expect(result['username']).to.deep.eql(['"username" is required']);
          done();
        });
      });

      it('should not validate other fields', function (done) {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          username: _joi2['default'].string().required(),
          password: _joi2['default'].string().required()
        };
        var data = {
          password: 'qwerty'
        };

        validator.validate(data, schema, {
          key: 'password'
        }, function (result) {
          _chai.expect(result).to.have.keys(['password']);
          _chai.expect(result['password']).to.be.undefind;
          done();
        });
      });

      it('should handle Joi refs', function (done) {
        // TODO: see https://github.com/hapijs/joi/pull/484
        var schema = {
          password: _joi2['default'].string().required(),
          verifyPassword: _joi2['default'].any().valid(_joi2['default'].ref('password')).options({
            language: {
              any: {
                allowOnly: 'don\'t match password'
              }
            }
          }).required()
        };
        var data = {
          password: 'qwerty',
          verifyPassword: 'qerty'
        };

        validator.validate(data, schema, {
          key: 'verifyPassword'
        }, function (result) {
          _chai.expect(result['verifyPassword']).to.deep.eql(['"verifyPassword" don\'t match password']);
          done();
        });
      });
    });
  });

  describe('getValidationMessages()', function () {
    describe('key is defined', function () {
      it('should be empty for valid input', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.getValidationMessages(errors, 'username');
          _chai.expect(result).to.be.empty;
          done();
        });
      });

      it('should decode for HTML entity encoder', function (done) {
        var label = '使用者名稱';
        var schema = {
          username: _joi2['default'].string().required().label(label)
        };
        var data = {
          username: ''
        };
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.getValidationMessages(errors, 'username');
          _chai.expect(result).to.deep.equal(['"' + label + '" is not allowed to be empty']);
          done();
        });
      });

      it('should be have message for invalid input field', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {};
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.getValidationMessages(errors, 'username');
          _chai.expect(result).to.deep.equal(['"username" is required']);
          done();
        });
      });
    });

    describe('key is undefined', function () {
      it('should be empty for valid input', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.getValidationMessages(errors);
          _chai.expect(result).to.be.empty;
          done();
        });
      });

      it('should be filled for invalid input', function (done) {
        var label = '使用者名稱';
        var schema = {
          username: _joi2['default'].string().required().label(label)
        };
        var data = {};
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.getValidationMessages(errors);
          _chai.expect(result.length).to.equal(1);
          _chai.expect(result[0]).to.deep.equal(['"' + label + '" is required']);
          done();
        });
      });
    });
  });

  describe('isValid()', function () {
    describe('key is defined', function () {
      it('should be true for valid input', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.isValid(errors, 'username');
          _chai.expect(result).to.be['true'];
          done();
        });
      });

      it('should be false for invalid input', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {};
        validator.validate(data, schema, undefined, function (errors) {
          var result = validator.isValid(errors, 'username');
          _chai.expect(result).to.be['false'];
          done();
        });
      });
    });

    describe('key is undefined', function () {
      it('should be true for valid input', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {
          username: 'bar'
        };
        validator.validate(data, schema, {}, function (errors) {
          var result = validator.isValid(errors);
          _chai.expect(result).to.be['true'];
          done();
        });
      });

      it('should be false for invalid input', function (done) {
        var schema = {
          username: _joi2['default'].string().required()
        };
        var data = {};
        validator.validate(data, schema, {}, function (errors) {
          var result = validator.isValid(errors);
          _chai.expect(result).to.be['false'];
          done();
        });
      });
    });
  });
});