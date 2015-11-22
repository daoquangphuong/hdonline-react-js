process.chdir('extension');
process.on('uncaughtException', function (err) {
    console.log('JPM error', err.stack);
});
var jpm_utils = require("jpm/lib/utils");
var jpm_post = require("jpm/lib/post");
jpm_utils.getManifest().then(function (mainfest) {
    jpm_post(mainfest, {postUrl: 'http://localhost:8877/'})
});