"use strict";
(function () {
    var reactHook = require('./core/react_hook');
    reactHook();
    var React = require('react');
    var ReactDOM = require('react-dom');
    var reactRouter = require('react-router');

    //component

    var Layout = require('./module/layout/com/layout');
    var HelloWorld = require('./module/hello_world/com/hello_world');
    var Route = reactRouter.Route;

    var routeSetup = (
        <Route handler={Layout}>
            <Route path="hello_world" handler={HelloWorld}/>
            <Route path="*" handler={HelloWorld}/>
        </Route>
    );

    reactRouter.run(routeSetup, reactRouter.HistoryLocation, function (Root) {
        ReactDOM.render(<Root/>, document.getElementById('app'));
    });

}).call();
