"use strict";
(function () {
    var React = require('react');
    var reactRouter = require('react-router');

    //component
    var RouteHandler = reactRouter.RouteHandler;

    module.exports = React.createClass({
        render: function () {
            return (
                <div className="wrapper">
                    <div id="container" className="container">
                        <RouteHandler />
                    </div>
                </div>
            );
        }
    });

}).call();

