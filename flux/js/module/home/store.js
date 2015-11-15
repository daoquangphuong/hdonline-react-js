"use strict";
(function () {
    var Freezer = require('freezer-js');

    var create = require('../../core/create');

    var store = new Freezer({
        tab: 'Status'
    });

    store.on('init', function (data) {
        var bankerFilter = {};
        var serverNameFilter = {};
        var sub = create.map(data.sub, ['_id'], null, function (property, level, child, value) {
            if (!value.store.serverName) {
                serverNameFilter['noServer'] = true;
            }
            else {
                serverNameFilter[value.store.serverName] = true;
            }
            bankerFilter[value.banker_id] = true;
            return true;
        });
        var banker = create.map(data.banker, ['_id']);
        store.get()
            .set('sub', sub)
            .set('banker', banker)
            .set('bankerFilter', Object.keys(bankerFilter))
            .set('serverNameFilter', Object.keys(serverNameFilter));
        console.log(store.get());
    });

    store.on('newStatus', function (subInfo) {
        var sub = store.get().sub;
        if (sub) {
            sub.set(subInfo._id, subInfo);
        }
    });

    store.on('selectTab', function (tab) {
        store.get().set('tab', tab);
    });

    store.on('beforeAll', function () {
        //console.log(arguments);
    });

    store.on('afterAll', function () {
        //console.log(arguments);
    });

    module.exports = store;
}).call();