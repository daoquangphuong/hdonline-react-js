'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Signup = require('./Signup');

var _Signup2 = _interopRequireDefault(_Signup);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _joiValidationStrategy = require('joi-validation-strategy');

var _joiValidationStrategy2 = _interopRequireDefault(_joiValidationStrategy);

var _srcComponentsValidationMixin = require('../../src/components/validationMixin');

var _srcComponentsValidationMixin2 = _interopRequireDefault(_srcComponentsValidationMixin);

var Signup = _srcComponentsValidationMixin2['default'](_joiValidationStrategy2['default'])(_Signup2['default']);

describe('Validation Mixin', function () {
  it('wraps components displayName correctly', function () {
    _chai.expect(Signup.displayName).to.equal('Validation(Signup)');
  });
  it('validates field on blur', function () {
    var signup = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Signup, null));
    var email = _reactDom.findDOMNode(signup.refs.component.refs.email);

    _reactAddonsTestUtils2['default'].Simulate.blur(email);
    _chai.expect(signup.isValid('email')).to.equal(false);
    _reactAddonsTestUtils2['default'].Simulate.change(email, {
      target: {
        value: 'invalid.email.com'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.blur(email);
    _chai.expect(signup.isValid('email')).to.equal(false);

    _reactAddonsTestUtils2['default'].Simulate.change(email, {
      target: {
        value: 'valid@email.com'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.blur(email);
    _chai.expect(signup.isValid('email')).to.equal(true);
  });

  it('ensure previous invalid fields remain invalid', function () {
    var signup = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Signup, null));
    var email = _reactDom.findDOMNode(signup.refs.component.refs.email);
    var username = _reactDom.findDOMNode(signup.refs.component.refs.username);

    _reactAddonsTestUtils2['default'].Simulate.blur(email);
    _chai.expect(signup.isValid('username')).to.equal(true);
    _chai.expect(signup.isValid('email')).to.equal(false);

    _reactAddonsTestUtils2['default'].Simulate.blur(username);
    _chai.expect(signup.isValid('username')).to.equal(false);
    _chai.expect(signup.isValid('email')).to.equal(false);
  });

  it('ensure submit on invalid form is invalid', function (done) {
    var signup = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Signup, null));
    var form = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithTag(signup, 'form');

    //need to mock for submit
    signup.refs.component.props.validate(function () {
      _chai.expect(signup.isValid()).to.equal(false);
      done();
    });
  });

  it('ensure submit on valid form is valid', function (done) {
    var signup = _reactAddonsTestUtils2['default'].renderIntoDocument(_react2['default'].createElement(Signup, null));
    var form = _reactAddonsTestUtils2['default'].findRenderedDOMComponentWithTag(signup, 'form');

    var firstName = _reactDom.findDOMNode(signup.refs.component.refs.firstName);
    var lastName = _reactDom.findDOMNode(signup.refs.component.refs.lastName);
    var email = _reactDom.findDOMNode(signup.refs.component.refs.email);
    var username = _reactDom.findDOMNode(signup.refs.component.refs.username);
    var password = _reactDom.findDOMNode(signup.refs.component.refs.password);
    var verifyPassword = _reactDom.findDOMNode(signup.refs.component.refs.verifyPassword);
    var tv = _reactDom.findDOMNode(signup.refs.component.refs.tv);

    _reactAddonsTestUtils2['default'].Simulate.change(firstName, {
      target: {
        value: 'foo'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.change(lastName, {
      target: {
        value: 'boo'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.change(email, {
      target: {
        value: 'foo@boo.com'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.change(username, {
      target: {
        value: 'seaweed'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.change(password, {
      target: {
        value: 'Luxury123'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.change(verifyPassword, {
      target: {
        value: 'Luxury123'
      }
    });

    _reactAddonsTestUtils2['default'].Simulate.change(tv, {
      target: {
        value: 'tv'
      }
    });

    //need to mock for submit
    signup.refs.component.props.validate(function () {
      _chai.expect(signup.isValid()).to.equal(true);
      done();
    });
  });
});