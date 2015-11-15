"use strict";
(function () {
    var React = require('react');
    // component
    var List = require('./list');

    module.exports = React.createClass({
        filterSubState: function () {
            var self = this;
            self.subState = {};
            var sub = self.props.sub;
            if (sub) {
                Object.keys(sub).forEach(function (_id) {
                    var subInfo = sub[_id];
                    var state = subInfo.store.state || 'idle';
                    self.subState[state] = self.subState[state] || [];
                    self.subState[state].push(subInfo);
                });
            }
        },
        render: function () {
            var self = this;
            self.filterSubState();
            return (
                <div>
                    {Object.keys(self.subState).map(function (state) {
                        return <List key={state} state={state} sub={self.subState[state]}/>
                    })}
                </div>
            );
        }
    });

}).call();