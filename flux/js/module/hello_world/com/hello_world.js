"use strict";
(function () {
    var React = require('react');
    var reactRouter = require('react-router');
    // store
    var store = require('../store');
    // component
    var MessageBox = require('./message_box');

    module.exports = React.createClass({
        onUpdate: function () {
            var self = this;
            self.forceUpdate();
        },
        componentDidMount: function () {
            var self = this;
            store.on('update', self.onUpdate);
        },
        componentWillUnmount: function () {
            var self = this;
            store.off('update', self.onUpdate);
        },
        say: function () {
            unsafeWindow.console.log('dang lay du lieu');
            var $ = require('jquery');
            $.get('http://hdonline.vn')
                .done(function (res) {
                    console.log(res);
                })
                .fail(function (err) {
                    console.log(arguments);
                })
                .always(function () {
                    console.log('done');
                });
            store.trigger('say', 'Hello World !');
        },
        render: function () {
            var self = this;
            var state = store.get();
            return (
                <div>
                    <h1 className="text-primary">This Is Example</h1>
                    <button className="btn btn-info" onClick={self.say}>{'CLICK'}</button>
                    <MessageBox message={state.message}/>
                </div>
            );
        }
    });

}).call();