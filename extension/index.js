var self = require('sdk/self');

require('sdk/tabs').activeTab.url = 'http://www.hayhaytv.vn';

var pageMod = require('sdk/page-mod');
var data = require("sdk/self").data;

pageMod.PageMod({
  include: /https?:\/\/www.hayhaytv.vn\/?.*/,
  contentScriptWhen: 'start',
  contentScriptFile: [
    data.url('js/app.js')
  ],
  attachTo: ['existing', 'top', 'frame']
});
