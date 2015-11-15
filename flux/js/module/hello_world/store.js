"use strict";
(function () {
    var Freezer = require('freezer-js');

    var store = new Freezer({});

    store.on('say', function (message) {
        store.get().set('message', message);
    });

    store.on('beforeAll', function () {
        //console.log(arguments);
    });

    store.on('afterAll', function () {
        //console.log(arguments);
    });

    module.exports = store;
}).call();