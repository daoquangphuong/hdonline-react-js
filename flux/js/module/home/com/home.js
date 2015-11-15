"use strict";
(function () {
    var React = require('react');
    var reactBootstrap = require('react-bootstrap');
    // store
    var store = require('../store');
    // component
    var Tabs = reactBootstrap.Tabs;
    var Tab = reactBootstrap.Tab;
    var ServerName = require('./server_name/server_name');

    module.exports = React.createClass({
        onUpdate: function () {
            var self = this;
            self.forceUpdate();
        },
        componentWillMount: function () {
            var client = require('../client');
            client.waitReady()
                .then(function () {
                    client.init();
                });
        },
        componentDidMount: function () {
            var self = this;
            store.on('update', self.onUpdate);
        },
        componentWillUnmount: function () {
            var self = this;
            store.off('update', self.onUpdate);
        },
        selectTab: function (tab) {
            store.trigger('selectTab', tab);
        },
        render: function () {
            var self = this;
            var state = store.get();
            return (
                <div>
                    <Tabs activeKey={state.tab} onSelect={self.selectTab} bsStyle="pills">
                        <Tab eventKey="Status" title="Status">
                            <ServerName
                                tab={state.tab}
                                banker={state.banker}
                                sub={state.sub}
                            />
                        </Tab>
                        <Tab eventKey="Log" title="Log">Log</Tab>
                    </Tabs>
                </div>
            );
        }
    });

}).call();