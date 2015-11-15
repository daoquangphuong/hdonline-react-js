"use strict";
module.exports = function () {
    var react = require('react');
    var oldCreateClass = react.createClass;
    var pureRenderMixin = require('react-addons-pure-render-mixin');
    react.createClass = function (spec) {
        spec.mixins = spec.mixins || [];
        if (!spec.noPureRenderMixin && !spec.shouldComponentUpdate) {
            var hasShouldComponentUpdate = spec.mixins.some(function (mixin) {
                return mixin.hasOwnProperty('shouldComponentUpdate');
            });
            if (!hasShouldComponentUpdate) {
                spec.mixins.push(pureRenderMixin);
            }
        }
        Object.keys(spec).forEach(function (funcName) {
            if (typeof spec[funcName] == 'function') {
                var oldFunc = spec[funcName];
                spec[funcName] = function () {
                    try {
                        return oldFunc.apply(this, arguments);
                    } catch (e) {
                        console.log('React Hook Detect Error: ');
                        console.error(e);
                    }
                };
            }
        });
        return oldCreateClass.call(this, spec);
    };
};