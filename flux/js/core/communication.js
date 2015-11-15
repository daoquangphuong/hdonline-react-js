"use strict";
var sendSetImmediate = function (callback) {
    if (typeof setImmediate == 'function') {
        return setImmediate(callback);
    }
    return setTimeout(callback, 0);
};

var Communication = function (process, hook) {
    var self = this;
    self.q = require('q');
    self.process = process;
    self.event = {};
    self.cmd = {};
    self.promise = {};
    self.process.on('message', function (data) {
        var emit = data.emit;
        var packet = data.packet;
        var cmd = data.cmd;
        var id = data.id;
        var type = data.type;
        if (hook && typeof hook == 'function') {
            return sendSetImmediate(function () {
                hook(data);
            })
        }
        if (emit && typeof self.event[emit] == 'function') {
            return sendSetImmediate(function () {
                self.event[emit].call(null, packet);
            })
        }
        if (cmd && id) {
            if (type) {
                return sendSetImmediate(function () {
                    if (
                        self.promise[cmd] &&
                        self.promise[cmd][id] &&
                        self.promise[cmd][id][type] &&
                        typeof self.promise[cmd][id][type] == 'function'
                    ) {
                        self.promise[cmd][id][type].call(null, packet);
                        if (type == 'resolve' || type == 'reject') {
                            delete self.promise[cmd][id];
                        }
                    }
                });
            }
            return sendSetImmediate(function () {
                self.cmd[cmd].call(null, packet)
                    .progress(function (notify) {
                        self.process.send({cmd: cmd, id: id, type: 'notify', packet: notify});
                    })
                    .then(function (data) {
                        self.process.send({cmd: cmd, id: id, type: 'resolve', packet: data});
                    })
                    .catch(function (err) {
                        var newError = {};
                        if (typeof err == 'object') {
                            Object.keys(err).forEach(function (key) {
                                newError[key] = err[key];
                            });
                            newError.message = err.message;
                            newError.stack = err.stack;
                        }
                        else {
                            newError = err;
                        }
                        self.process.send({cmd: cmd, id: id, type: 'reject', packet: newError});
                    })
                    .done()
            });
        }
    })
};

var communication = Communication.prototype;

communication.clearAllListener = function (exceptEvent, exceptCmd) {
    var self = this;
    if (!exceptEvent) {
        self.event = {};
    }
    if (!exceptCmd) {
        self.cmd = {};
    }
};

communication.emit = function (emit, packet) {
    var self = this;
    self.process.send({emit: emit, packet: packet});
};

communication.on = function (on, func) {
    var self = this;
    self.event[on] = func;
};

communication.onCmd = function (on, func) {
    var self = this;
    self.cmd[on] = func;
};

communication.emitCmd = function (cmd, packet) {
    var self = this;
    return self.q.Promise(function (resolve, reject, notify) {
        self.promise[cmd] = self.promise[cmd] || {};
        var id;
        do {
            id = Math.random();
        } while (!id || self.promise[cmd].hasOwnProperty(id));
        self.promise[cmd][id] = {
            resolve: resolve,
            reject: reject,
            notify: notify
        };
        self.process.send({cmd: cmd, id: id, packet: packet});
    });
};

module.exports = Communication;