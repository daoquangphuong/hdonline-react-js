'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lodashSet = require('lodash.set');

var _lodashSet2 = _interopRequireDefault(_lodashSet);

var Signup = _react2['default'].createClass({
  displayName: 'Signup',
  validatorTypes: {
    auth: {
      firstName: _joi2['default'].string().required().label('First Name'),
      lastName: _joi2['default'].string().allow(null).label('Last Name')
    },
    email: _joi2['default'].string().email().label('Email Address'),
    username: _joi2['default'].string().alphanum().min(3).max(30).required().label('Username'),
    password: _joi2['default'].string().regex(/[a-zA-Z0-9]{3,30}/).label('Password'),
    verifyPassword: _joi2['default'].any().valid(_joi2['default'].ref('password')).required().label('Password Confirmation'),
    referral: _joi2['default'].any().valid('tv', 'radio'),
    rememberMe: _joi2['default'].boolean()
  },
  getValidatorData: function getValidatorData() {
    return this.state;
  },
  getInitialState: function getInitialState() {
    return {
      auth: {
        firstName: null,
        lastName: null
      },
      email: null,
      username: null,
      password: null,
      verifyPassword: null,
      rememberMe: 'off',
      referral: null,
      feedback: null
    };
  },
  render: function render() {
    return _react2['default'].createElement(
      'section',
      { className: 'row' },
      _react2['default'].createElement(
        'h3',
        null,
        'Signup'
      ),
      _react2['default'].createElement(
        'form',
        { onSubmit: this.handleSubmit, className: 'form-horizontal' },
        _react2['default'].createElement(
          'fieldset',
          null,
          _react2['default'].createElement(
            'div',
            { className: this.getClasses('auth.firstName') },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'firstName' },
              'First Name'
            ),
            _react2['default'].createElement('input', { type: 'text', id: 'firstName', ref: 'firstName', value: this.state.auth.firstName, onChange: this.onChange('auth.firstName'), onBlur: this.props.handleValidation('auth.firstName'), className: 'form-control', placeholder: 'First Name' }),
            this.props.getValidationMessages('auth.firstName').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: this.getClasses('auth.lastName') },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'lastName' },
              'Last Name'
            ),
            _react2['default'].createElement('input', { type: 'text', id: 'lastName', ref: 'lastName', value: this.state.auth.lastName, onChange: this.onChange('auth.lastName'), onBlur: this.props.handleValidation('auth.lastName'), className: 'form-control', placeholder: 'Last Name' })
          ),
          _react2['default'].createElement(
            'div',
            { className: this.getClasses('email') },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'email' },
              'Email'
            ),
            _react2['default'].createElement('input', { type: 'email', id: 'email', ref: 'email', value: this.state.email, onChange: this.onChange('email'), onBlur: this.props.handleValidation('email'), className: 'form-control', placeholder: 'Email' }),
            this.props.getValidationMessages('email').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: this.getClasses('username') },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'username' },
              'Username'
            ),
            _react2['default'].createElement('input', { type: 'text', id: 'username', ref: 'username', value: this.state.username, onChange: this.onChange('username'), onBlur: this.props.handleValidation('username'), className: 'form-control', placeholder: 'Username' }),
            this.props.getValidationMessages('username').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: this.getClasses('password') },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'password' },
              'Password'
            ),
            _react2['default'].createElement('input', { type: 'password', id: 'password', ref: 'password', value: this.state.password, onChange: this.onChange('password'), onBlur: this.props.handleValidation('password'), className: 'form-control', placeholder: 'Password' }),
            this.props.getValidationMessages('password').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: this.getClasses('verifyPassword') },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'verifyPassword' },
              'Verify Password'
            ),
            _react2['default'].createElement('input', { type: 'password', id: 'verifyPassword', ref: 'verifyPassword', value: this.state.verifyPassword, onChange: this.onChange('verifyPassword'), onBlur: this.props.handleValidation('verifyPassword'), className: 'form-control', placeholder: 'Verify Password' }),
            this.props.getValidationMessages('verifyPassword').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: 'form-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'referral' },
              'How did you hear about us?'
            ),
            _react2['default'].createElement(
              'label',
              { htmlFor: 'tv', className: 'radio-inline' },
              _react2['default'].createElement('input', { type: 'checkbox', id: 'tv', ref: 'tv', name: 'referral', value: 'tv', checked: this.state.referral === 'tv', onChange: this.onRadioChange('referral') }),
              ' ',
              'tv'
            ),
            _react2['default'].createElement(
              'label',
              { htmlFor: 'radio', className: 'radio-inline' },
              _react2['default'].createElement('input', { type: 'checkbox', id: 'radio', ref: 'radio', name: 'referral', value: 'radio', checked: this.state.referral === 'radio', onChange: this.onRadioChange('referral') }),
              ' ',
              'radio'
            ),
            this.props.getValidationMessages('referral').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: 'form-group' },
            _react2['default'].createElement(
              'label',
              { htmlFor: 'rememberMe' },
              'Remember me',
              ' ',
              _react2['default'].createElement('input', { type: 'checkbox', id: 'rememberMe', ref: 'rememberMe', value: 'on', checked: this.state.rememberMe === 'on', onChange: this.onCheckboxChange('rememberMe') })
            ),
            this.props.getValidationMessages('rememberMe').map(this.renderHelpText)
          ),
          _react2['default'].createElement(
            'div',
            { className: 'form-group' },
            _react2['default'].createElement(
              'h3',
              null,
              this.state.feedback
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'text-center form-group' },
            _react2['default'].createElement(
              'button',
              { type: 'submit', className: 'btn btn-large btn-primary' },
              'Sign up'
            ),
            ' ',
            _react2['default'].createElement(
              'button',
              { onClick: this.handleReset, className: 'btn btn-large btn-info' },
              'Reset'
            )
          )
        )
      )
    );
  },
  renderHelpText: function renderHelpText(message) {
    return _react2['default'].createElement(
      'span',
      { className: 'help-block' },
      message
    );
  },
  getClasses: function getClasses(field) {
    return _classnames2['default']({
      'form-group': true,
      'has-error': !this.props.isValid(field)
    });
  },
  onChange: function onChange(field) {
    var _this = this;

    return function (event) {
      _this.setState(_lodashSet2['default'](_this.state, field, event.target.value));
    };
  },
  onCheckboxChange: function onCheckboxChange(field) {
    var _this2 = this;

    return function (event) {
      var state = {};
      state[field] = _this2.state[field] === 'on' ? 'off' : 'on';
      _this2.setState(state, _this2.props.handleValidation(field));
    };
  },
  onRadioChange: function onRadioChange(field) {
    var _this3 = this;

    return function (event) {
      var state = {};
      state[field] = event.target.value;
      _this3.setState(state, _this3.props.handleValidation(field));
    };
  },
  handleReset: function handleReset(event) {
    event.preventDefault();
    this.props.clearValidations();
    this.setState(this.getInitialState());
  },
  handleSubmit: function handleSubmit(event) {
    var _this4 = this;

    event.preventDefault();
    var onValidate = function onValidate(error) {
      if (error) {
        _this4.setState({
          feedback: 'Form is invalid do not submit'
        });
      } else {
        _this4.setState({
          feedback: 'Form is valid send to action creator'
        });
      }
    };
    this.props.validate(onValidate);
  }
});

module.exports = Signup;