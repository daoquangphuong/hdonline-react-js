var Communication = require('../../core/communication');
var socketIoClient = require('socket.io-client');
var generalConfig = require('../../../../config/general');

var Client = function () {
    var self = this;
    self.q = require('q');
    self.create = require('../../core/create');
    self.debug = false;
    self.config = {
        namespace: 'user-interface'
    };
    self.initial();
};

var client = Client.prototype;

client.log = function () {
    var self = this;
    if (self.debug) {
        console.log.apply(null, arguments);
    }
};

client.initial = function () {
    var self = this;
    self.socket_server = generalConfig.api_socket_url + '/' + self.config.namespace;
    self.socket = socketIoClient(self.socket_server);
    self.register_base_event();
};

client.register_base_event = function () {
    var self = this;
    self.clientReady = false;
    self.com = new Communication(self.socket);
    self.socket.on('connect', function () {
        self.connected = true;
        console.log('>>> Connecting success : ' + self.socket_server);
        console.log('>>> Remove all event');
        self.socket.removeAllListeners();
        console.log('>>> Register Base event');
        self.register_base_event();
        console.log('>>> Oauth');
        self.oauth()
            .then(function () {
                console.log('>>> Register main event');
                self.register_main_event();
            })
            .then(function () {
                console.log('>>> Ok Ready !!!');
                console.log('');
            })
            .catch(function (err) {
                if (alert) {
                    alert('ERROR');
                }
                console.log(err);
            });
    });
    self.socket.on('connect_error', function () {
        console.log('>>> Can not connect to server :' + self.socket_server);
    });
    self.socket.on('disconnect', function () {
        self.connected = false;
        console.log('>>> Disconnect from server :' + self.socket_server);
    });
};

client.oauth = function () {
    var self = this;
    return self.q.Promise(function (resolve, reject) {
        self.socket.emit('oauth', {});
        self.socket.on('oauth invalid', function (packet) {
            reject(packet);
        });
        self.socket.on('oauth valid', function () {
            resolve();
        })
    })
};

client.register_main_event = function () {
    var self = this;
    self.clientReady = true;
    self.com.on('newStatus', function (subInfo) {
        var store = require('./store');
        store.trigger('newStatus', subInfo);
    })
};

client.waitReady = function () {
    var self = this;
    return self.q.Promise(function (resolve) {
        var loop = function () {
            setTimeout(function () {
                if (self.clientReady) {
                    return resolve()
                }
                loop();
            }, 10);
        };
        loop();
    })
};

client.init = function () {
    var self = this;
    return self.q.when()
        .then(function () {
            var store = require('./store');
            self.com.emitCmd('init')
                .then(function (data) {
                    store.trigger('init', data);
                })
                .catch(function (err) {
                    alert('emitCmd init error');
                    console.log(err);
                })
        });
};

module.exports = new Client();