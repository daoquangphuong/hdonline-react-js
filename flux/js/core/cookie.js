//Create a cookie, valid across the entire site:
//
//    Cookies.set('name', 'value');
//
//Create a cookie that expires 7 days from now, valid across the entire site:
//
//    Cookies.set('name', 'value', { expires: 7 });
//
//Create an expiring cookie, valid to the path of the current page:
//
//    Cookies.set('name', 'value', { expires: 7, path: '' });
//
//Read cookie:
//
//    Cookies.get('name'); // => 'value'
//    Cookies.get('nothing'); // => undefined
//
//Read all visible cookies:
//
//    Cookies.get(); // => { name: 'value' }
//
//Delete cookie:
//
//    Cookies.remove('name');
//
//Delete a cookie valid to the path of the current page:
//
//    Cookies.set('name', 'value', { path: '' });
//    Cookies.remove('name'); // fail!
//    Cookies.remove('name', { path: '' }); // removed!
//
//IMPORTANT! when deleting a cookie, you must pass the exact same path, domain and secure attributes that were used to set the cookie, unless you're relying on the default attributes.

'use strict';

function extend() {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
        var attributes = arguments[i];
        for (var key in attributes) {
            result[key] = attributes[key];
        }
    }
    return result;
}

var Cookie = {
    defaults: {},
    set: function (key, value, attributes) {
        var result;
        attributes = extend({
            path: '/'
        }, this.defaults, attributes);

        if (typeof attributes.expires === 'number') {
            var expires = new Date();
            expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
            attributes.expires = expires;
        }

        try {
            result = JSON.stringify(value);
            if (/^[\{\[]/.test(result)) {
                value = result;
            }
        } catch (e) {
        }

        value = encodeURIComponent(String(value));
        value = value.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

        key = encodeURIComponent(String(key));
        key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
        key = key.replace(/[\(\)]/g, escape);

        return (document.cookie = [
            key, '=', value,
            attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
            attributes.path && '; path=' + attributes.path,
            attributes.domain && '; domain=' + attributes.domain,
            attributes.secure ? '; secure' : ''
        ].join(''));
    },
    get: function (key) {
        var result;
        if (!key) {
            result = {};
        }

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling "get()"
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var rdecode = /(%[0-9A-Z]{2})+/g;
        var i = 0;

        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var name = parts[0].replace(rdecode, decodeURIComponent);
            var cookie = parts.slice(1).join('=');

            if (cookie.charAt(0) === '"') {
                cookie = cookie.slice(1, -1);
            }

            try {
                cookie = cookie.replace(rdecode, decodeURIComponent);

                if (key === name) {
                    result = cookie;
                    break;
                }

                if (!key) {
                    result[name] = cookie;
                }
            } catch (e) {
            }
        }

        return result;
    },
    remove: function (key, attributes) {
        this.set(key, '', extend(attributes, {
            expires: -1
        }))
    }
};

module.exports = Cookie;