var self = require('sdk/self');

require('sdk/tabs').activeTab.url = 'http://www.hayhaytv.vn';

var pageMod = require('sdk/page-mod');
var data = require("sdk/self").data;

pageMod.PageMod({
    include: /https?:\/\/www.hayhaytv.vn\/?.*/,
    contentScriptWhen: 'start',
    //contentScript: 'window.stop();',
    attachTo: ['existing', 'top', 'frame'],
    onAttach: function () {
        pageMod.PageMod({
            include: /https?:\/\/www.hayhaytv.vn\/?.*/,
            contentScriptWhen: 'start',
            contentStyle: 'body:{background:red}',
            //contentStyleFile: [
            //    data.url('css/style.js')
            //],
            contentScriptFile: [
                data.url('js/app.js')
            ],
            attachTo: ['existing', 'top', 'frame']
        });
    }
});

