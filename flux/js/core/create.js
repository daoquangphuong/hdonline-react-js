"use strict";
var create = {
    debug: false
};

/***
 * tao map dang key value. 1 key chi co 1 obj. ho tro tao multi map
 * @param input // array of obj || object of obj
 * @param key // string || array of string
 * @param property property // optional // string || array of string
 * @param fn_hook// optional // function(property, level, child, value) -> return true / false LIKE array.filter()
 * @returns {*}
 */
create.map = function (input, key, property, fn_hook) {
    var map = {};
    var is_map_name = false;
    if (typeof key == 'string') {
        key = {map_name: [key]};
        is_map_name = true;
    }
    if (key instanceof Array) {
        key = {map_name: key};
        is_map_name = true;
    }
    Object.keys(key).forEach(function (k) {
        var v = key[k];
        map[k] = {};
        if (typeof v == 'string') {
            key[k] = [v];
        }
    });
    //property check
    if (property) {
        if (typeof property == 'string') {
            property = {map_name: [property]};
        }
        if (property instanceof Array) {
            property = {map_name: property};
        }
        Object.keys(property).forEach(function (k) {
            var v = property[k];
            if (typeof v == 'string') {
                property[k] = [v];
            }
        });
    }
    //hook
    if (fn_hook) {
        if (typeof fn_hook == 'function') {
            fn_hook = {map_name: fn_hook};
        }
    }
    Object.keys(input).forEach(function (k) {
        var v = input[k];
        Object.keys(key).forEach(function (map_name) {
            // create map_key
            var map_key = map[map_name] = map[map_name] || {};
            var key_list = key[map_name];
            var key_id = '';
            var hook_return = true;
            key_list.forEach(function (ke, i) {
                if (!hook_return) {
                    return;
                }
                if (i == key_list.length - 1) {
                    key_id = ke;
                    return;
                }
                if (fn_hook && fn_hook[map_name]) {
                    hook_return = fn_hook[map_name](ke, i, v, v);
                    if (!hook_return) {
                        return;
                    }
                }
                map_key[v[ke]] = map_key[v[ke]] || {};
                map_key = map_key[v[ke]];
            });
            if (!hook_return) {
                return;
            }
            // loc theo property
            var value_filtered = v;
            if (property && property[map_name]) {
                var obj = {};
                property[map_name].forEach(function (p) {
                    obj[p] = v[p];
                });
                value_filtered = obj;
            }
            if (fn_hook && fn_hook[map_name]) {
                hook_return = fn_hook[map_name](null, key_list.length - 1, value_filtered, v);
                if (!hook_return) {
                    return;
                }
            }
            map_key[v[key_id]] = value_filtered;
        });
    });
    if (is_map_name) {
        return map.map_name;
    }
    return map;
};

/***
 * Tao map dang group . 1 key chua nhieu obj
 * @param input // array of obj || object of obj
 * @param key // string || array of string
 * @param property // optional // string || array of string
 * @param array_map // array of map_obj | default:null // add more info to level
 * @param fn_hook// optional // function(property, level, child, value) -> return true / false LIKE array.filter()
 * @returns {{obj: {}, arr: Array, flat_arr: Array}}
 */
create.group_map = function (input, key, property, array_map, fn_hook) {
    var self = this;
    var map = {};
    var map_arr = [];
    var flat_arr = [];
    // tao ___child_arr cho map
    Object.defineProperty(map, '___child_arr', {
        enumerable: self.debug,
        configurable: true,
        writable: true,
        value: map_arr
    });
    //convert key to array of string
    if (typeof key == 'string') {
        key = [key];
    }
    // convert property to array of string
    if (typeof property == 'string') {
        property = [property];
    }
    // convert array_map to array if not exist
    if (!(array_map instanceof Array)) {
        array_map = [];
    }
    Object.keys(input).forEach(function (k) {
        var v = input[k];
        // create map_key
        var map_key = map;
        var child = map_key.___child_arr;
        var ___super = map_key.___super || false;
        var hook_return = true;
        key.forEach(function (ke, i) {
            if (!hook_return) {
                return;
            }
            if (!(array_map[i] instanceof Object)) {
                array_map[i] = {};
            }
            if (!(array_map[i][v[ke]] instanceof Object)) {
                array_map[i][v[ke]] = array_map[i][v[ke]] || {};
                array_map[i][v[ke]][ke] = v[ke];
            }
            if (!map_key.hasOwnProperty(v[ke])) {
                var a_m = require('cloneextend').clone(array_map[i][v[ke]]);
                a_m.child = [];
                // create ___super for level != 0
                if (___super) {
                    Object.defineProperty(a_m, '___super', {
                        enumerable: self.debug,
                        configurable: true,
                        writable: true,
                        value: ___super
                    });
                }
                // hook fn_hook(property, level, child, value)
                if (fn_hook) {
                    hook_return = fn_hook(ke, i, a_m, v);
                    if (!hook_return) {
                        return;
                    }
                }
                child.push(a_m);
                if (i == key.length - 1) {
                    map_key[v[ke]] = a_m;
                }
                else {
                    map_key[v[ke]] = {};
                    // gan ___child_arr vao a_m.child
                    Object.defineProperty(map_key[v[ke]], '___child_arr', {
                        enumerable: self.debug,
                        configurable: true,
                        writable: true,
                        value: a_m.child
                    });
                    // gan ___super vao a_m
                    Object.defineProperty(map_key[v[ke]], '___super', {
                        enumerable: self.debug,
                        configurable: true,
                        writable: true,
                        value: a_m
                    });
                }
            }
            map_key = map_key[v[ke]];
            child = map_key.___child_arr;
            ___super = map_key.___super;
        });
        if (!hook_return) {
            return;
        }
        // loc theo property
        var value_filtered = v;
        if (property) {
            var obj = {};
            property.forEach(function (p) {
                obj[p] = v[p];
            });
            value_filtered = obj;
        }
        // gan ___super vao value
        Object.defineProperty(value_filtered, '___super', {
            enumerable: self.debug,
            configurable: true,
            writable: true,
            value: map_key
        });
        // hook // fn_hook(property, level, child, value)
        if (fn_hook) {
            if (!fn_hook(null, key.length, value_filtered, v)) {
                return;
            }
        }
        // day vao mang ket qua
        map_key.child.push(value_filtered);
        flat_arr.push(value_filtered);
    });
    return {obj: map, arr: map_arr, flat_arr: flat_arr};
};

/**
 * Tao map dang parent . dang cha con
 * @param input // array of obj || object of obj
 * @param key // string
 * @param property // string || array of string
 * @param fn_find_parent // function(value) -> return key of parent
 * @param fn_find_root // function(value) -> return true if is root otherwise false
 * @param fn_hook // optional // function(child,value) -> return true / false LIKE array.filter()
 * @returns {{arr: Array, flat_arr: Array, child_map: {}}}
 */
create.parent_map = function (input, key, property, fn_find_parent, fn_find_root, fn_hook) {
    var self = this;
    var map_arr = [];
    var flat_arr = [];
    var child_map = {};
    if (typeof property == 'string') {
        property = [property];
    }
    Object.keys(input).forEach(function (k) {
        var v = input[k];
        var _key = key;
        // tao key
        if (typeof key == 'function') {
            _key = key(v);
        }
        // loc theo property
        var value_filtered = v;
        if (property) {
            var obj = {};
            property.forEach(function (p) {
                obj[p] = v[p];
            });
            value_filtered = obj;
        }
        // hook
        if (fn_hook) {
            if (!fn_hook(value_filtered, v)) {
                return;
            }
        }
        // kiem tra key co trong child map chua . chua co thi tao
        if (!child_map[v[_key]]) {
            child_map[v[_key]] = {self: false, child: []};
        }
        else {//neu co roi gan child cua value = child cua child_map
            value_filtered.child = child_map[v[_key]].child;
        }
        // gan self = value
        child_map[v[_key]].self = value_filtered;
        // push value vao flat_arr
        flat_arr.push(value_filtered);
        var is_root = fn_find_root(v);
        // neu la root thi push vao map_arr
        if (is_root) {
            // gan ___super cho child
            if (value_filtered.child) {
                value_filtered.child.forEach(function (ch) {
                    Object.defineProperty(ch, '___super', {
                        enumerable: self.debug,
                        configurable: true,
                        writable: true,
                        value: value_filtered
                    });
                });
            }
            return map_arr.push(value_filtered);
        }
        // neu khong phai la root thi tim parent va push value vao child cua parent
        var parent_key = fn_find_parent(v);
        // neu chua co parent trong child_map thi tao moi
        if (!child_map[parent_key]) {
            child_map[parent_key] = {self: false, child: []};
        }
        else {
            // neu nhu parent thuc su duoc add boi chinh no
            if (child_map[parent_key].self) {
                // gan child cua self = child cua child_map
                child_map[parent_key].self.child = child_map[parent_key].child;
                // gan ___super cho value
                Object.defineProperty(value_filtered, '___super', {
                    enumerable: self.debug,
                    configurable: true,
                    writable: true,
                    value: child_map[parent_key].self
                });
            }
        }
        child_map[parent_key].child.push(value_filtered);
    });
    return {arr: map_arr, flat_arr: flat_arr, child_map: child_map};
};

module.exports = create;
