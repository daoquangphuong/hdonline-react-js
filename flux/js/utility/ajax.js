var jQuery = require('jquery');
var q = require('q');
var cookie = require('../core/cookie');
var misc = require('./../core/misc');
var config = require('../../../config/general');

function saveToken(data) {
    cookie.set('access_token', data.access_token);
    cookie.set('expires_in', data.expires_in);
    cookie.set('refresh_token', data.refresh_token);
    cookie.set('token_type', data.token_type);
    cookie.set('isLogin', '1');
}

module.exports = {
    OAUTH2: function (username, password) {
        return q.Promise(function (resolve, reject) {
            jQuery
                .ajax({
                    url: config.api_url + '/oauth2/token',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        grant_type: 'password',
                        username: username,
                        password: password,
                        client_id: 1,
                        client_secret: 'jashdfjkh1#!$%#^2342@#$@35'
                    }
                })
                .done(function (data, textStatus, jqXHR) {
                    saveToken(data);
                    return resolve(true);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    var res = jqXHR.responseJSON;
                    if (res) {
                        return reject({message: res.error_description || res});
                    }
                    reject({message: 'Ajax:' + textStatus});
                })
        })
    },
    REFRESH_TOKEN: function () {
        var self = this;
        self.is_refresh_token = true;
        if (self.is_refresh_token) {
            var loop = setTimeout(function () {
                if (!self.is_refresh_token) {
                    return q.when(self.refresh_token_result);
                }
                loop();
            }, 100)
        }
        self.refresh_token_result = false;
        return q.Promise(function (resolve, reject) {
            jQuery
                .ajax({
                    url: config.api_url + '/oauth2/token',
                    method: 'POST',
                    dataType: 'json',
                    data: {
                        grant_type: 'refresh_token',
                        refresh_token: cookie.get('refresh_token'),
                        client_id: 1,
                        client_secret: 'jashdfjkh1#!$%#^2342@#$@35'
                    }
                })
                .done(function (data) {
                    self.refresh_token_result = true;
                    saveToken(data);
                    return resolve(true);
                })
                .fail(function (jqXHR, textStatus) {
                    var res = jqXHR.responseJSON;
                    if (res) {
                        return reject({message: res.error_description || res});
                    }
                    reject({message: 'Ajax:' + textStatus});
                })
                .always(function () {
                    self.is_refresh_token = false;
                })
        })
    },
    POST: function (path, params) {
        return q.Promise(function (resolve, reject) {
            // check token
            var access_token = cookie.get('access_token');
            var expires_in = cookie.get('expires_in');
            var refresh_token = cookie.get('refresh_token');
            var token_type = cookie.get('token_type');
            jQuery
                .ajax({
                    url: config.api_url + path,
                    method: 'POST',
                    dataType: 'json',
                    data: params,
                    headers: {'Authorization': 'Bearer ' + access_token}
                })
                .done(function (data, textStatus, jqXHR) {
                    if (data.status) {
                        return resolve(data.res);
                    }
                    else {
                        reject(data.res);
                    }
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    var res = jqXHR.responseJSON;
                    if (res) {
                        if (res.error == 'is_admin_arena') {
                            cookie.set('isAdmin', '0');
                            misc.route('/');
                            return;
                        }
                        if (res.error == 'need_check_secure') {
                            cookie.set('isCheckSecure', '0');
                            misc.route('/oauth/secure');
                            return;
                        }
                        if (res.error == 'need_reset') {
                            cookie.set('isReset', '0');
                            misc.route('/oauth/reset');
                            return;
                        }
                        if (res.error == 'invalid_token') {
                            if (refresh_token) {
                                return module.exports.REFRESH_TOKEN()
                                    .then(function (result) {
                                        // resend
                                        if (result) {
                                            return module.exports.POST(url, params)
                                        }
                                        reject({message: 'refresh_token fail'});
                                    }, function (err) {
                                        cookie.set('isLogin', '0');
                                        misc.route('/oauth');
                                        reject(err);
                                    });
                                // send refresh token
                            }
                            cookie.set('isLogin', '0');
                            misc.route('/oauth');
                        }
                        return reject({message: res.error_description || res});
                    }
                    reject({message: 'Ajax:' + textStatus});
                })
        })
    }
};