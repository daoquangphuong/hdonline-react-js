var self = require('sdk/self');

var pageMod = require('sdk/page-mod');
var data = require("sdk/self").data;

pageMod.PageMod({
  include: /https?:\/\/www.hayhaytv.vn\/?.*/,
  contentScriptWhen: 'start',
  contentScriptFile: [
    data.url('content_script/boot.js'),
    data.url('content_script/q.js'),
    data.url('content_script/request.js'),
    data.url('content_script/resource_manage.js'),
    data.url('content_script/main.js')
  ],
  attachTo: ['existing', 'top', 'frame'],
  onAttach: function (worker) {
    worker.port.on('req_resource', function (req) {
      try {
        worker.port.emit('res_resource', {path: req, content: data.load(req)});
      }
      catch (err) {
        worker.port.emit('res_resource', {path: req, content: "NOT FOUND FILE -->> " + req});
      }
    });
    worker.port.on('req_request', function (req) {
      var Request = require("sdk/request").Request;
      req.params.headers = req.params.headers || {};
      req.params.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0';
      req.params.onComplete = function (response) {
        worker.port.emit('res_request', {
          id: req.id,
          response: {
            text: response.text,
            json: response.json,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          }
        })
      };
      Request(req.params)[req.method]();
    });
  }
});
