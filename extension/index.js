var self = require('sdk/self');

var httpSniffer = require('./lib/httpSniffer');
httpSniffer.sniffer.push({
    regex: {pattern: 'https?:\/\/www\.hayhaytv\.vn\/', option: 'im'},
    break: true,
    response: {
        new: function () {
            return self.data.load('layout.html');
        }
    }
});
httpSniffer.register();

require('sdk/tabs').activeTab.url = 'http://www.hayhaytv.vn';

var pageMod = require('sdk/page-mod');

pageMod.PageMod({
    include: /https?:\/\/www.hayhaytv.vn\/?.*/,
    contentScriptWhen: 'end',
    attachTo: ['existing', 'top', 'frame'],
    contentStyleFile: [
        self.data.url('css/style.css')
    ],
    contentScriptFile: [
        self.data.url('js/app.js')
    ]
});

