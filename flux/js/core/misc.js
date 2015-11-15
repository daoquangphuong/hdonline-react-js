'use strict';
module.exports = {
    redirect: function (path) {
        window.location.href = window.location.protocol + '//' + window.location.host + path;
    },
    route: function (hash_path) {
        window.location.hash = '#' + hash_path
    }
};