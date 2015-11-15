"use strict";
(function () {
    var React = require('react');
    var reactBootstrap = require('react-bootstrap');
    // component
    var Panel = reactBootstrap.Panel;
    var PanelGroup = reactBootstrap.PanelGroup;
    var Status = require('../status/status');

    //var serverInfo = React.createClass({
    //    render: function () {
    //        var self = this;
    //        self.filterServerName();
    //        return (
    //            <div>
    //                <List state="notify" sub={self.subNotify}/>
    //                <List state="reject" sub={self.subReject}/>
    //                <List state="resolve" sub={self.subResolve}/>
    //                <List state="idle" sub={self.subIdle}/>
    //            </div>
    //        );
    //    }
    //});

    module.exports = React.createClass({
        filterServerName: function () {
            var self = this;
            self.server = {};
            var sub = self.props.sub;
            if (sub) {
                Object.keys(sub).forEach(function (_id) {
                    var subInfo = sub[_id];
                    var serverName = subInfo.store.serverName || 'No Server';
                    self.server[serverName] = self.server[serverName] || [];
                    self.server[serverName].push(subInfo);
                });
            }
        },
        render: function () {
            var self = this;
            self.filterServerName();
            return (
                <PanelGroup>
                    {Object.keys(self.server).map(function (serverName) {
                        return <Panel key={serverName} bsStyle="primary" header={serverName}>
                            <Status
                                sub={self.server[serverName]}
                            />
                        </Panel>
                    })}
                </PanelGroup>
            );
        }
    });

}).call();