'use strict';
var React = require('react');
var q = require('q');
var Language = require('../module/language/com/language');

var Modal = require('../module/modal/com/modal');


// require using with validator mixin
module.exports = {
    alert: function (content, title) {
        return q.Promise(function (resolve) {
            var tmp = <p className="text-center">{content}</p>
            var popup = React.render(<Modal type='alert' bsSize="small" title={title ? title : <Language lang="thong bao"/>} content={tmp}
                                            callback={resolve}/>, document.getElementById('alert'));
            popup.open();
        })
    },
    confirm: function (content, title) {
        return q.Promise(function (resolve) {
            var tmp = <p className="text-center">{content}</p>
            var popup = React.render(<Modal type='confirm' bsSize="small" title={title? title : <Language lang="xac nhan"/>} content={tmp}
                                            callback={resolve}/>, document.getElementById('confirm'));
            popup.open();
        })
    },
    dialog: function (content, title, options) {
        return q.Promise(function (resolve) {
            if (!options) options = {};
            var popup = React.render(<Modal title={title} content={content} {...options}
                                            callback={resolve}/>, document.getElementById('popup'));
            popup.open();
        })
    },

    page_dialog: function (content, title) {
        return q.Promise(function (resolve) {
            var popup = React.render(<Modal className="modal-page" title={title} content={content}
                                            callback={resolve}/>, document.getElementById('popup-page'));
            popup.open();
        })
    }
};