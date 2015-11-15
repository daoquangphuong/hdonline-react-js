"use strict";
(function () {
    var React = require('react');
    var reactBootstrap = require('react-bootstrap');
    var classNames = require('classnames');
    // component
    var Alert = reactBootstrap.Alert;

    var SubInfo = React.createClass({
        render: function () {
            var self = this;
            var state = self.props.state;
            var subInfo = self.props.subInfo;
            var username = subInfo.username;
            var status = subInfo.store.status;
            var message = '';
            var more = [];
            if (status) {
                message += ' ' + status.message;
                if (status.more) {
                    more = Object.keys(status.more).map(function (typeReport) {
                        return (
                            <p key={typeReport}>
                                <strong className="text-uppercase">{typeReport}</strong>
                                : {status.more[typeReport].message}
                            </p>
                        )
                    })
                }
            }
            var col_xs = classNames({
                'col-xs-12': true,
                'col-md-4': state == 'notify' || state == 'resolve',
                'col-md-12 ': state == 'reject',
                'col-md-3': state == 'idle'
            });
            return (
                <span className={col_xs}>
                    <strong className="text-uppercase" title={JSON.stringify(subInfo,null,4)}>{username}</strong>
                    <span className="small">{message}{more}</span>
                </span>
            );
        }
    });

    module.exports = React.createClass({
        render: function () {
            var self = this;
            var state = self.props.state;
            var sub = self.props.sub || [];
            var bsStyle = classNames({
                'info': state == 'notify',
                'success': state == 'resolve',
                'danger': state == 'reject',
                'warning': state == 'idle'
            });


            return (
                <Alert bsStyle={bsStyle}>
                    <div className="row">
                        {sub.map(function (item) {
                            return <SubInfo key={item._id} state={state} subInfo={item}/>
                        })}
                    </div>
                </Alert>
            );
        }
    });

}).call();