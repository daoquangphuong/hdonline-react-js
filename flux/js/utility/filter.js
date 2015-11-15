'use strict';

module.exports = {
    /***
     * Convert Tree to Flat Array
     * @param tree // tree input (array child) (from create.parent_map)
     * @param key // key of child item
     * @param closeStatusMap // global object to control close/open child
     * @param sortFunc // sortFunc(a,b)  : sort child  like array.sort;
     * @param filterFunc // filter(item) : filter child like array.filter;
     * @param hookFunc // hookFunc(item) : hook child like array.forEach;
     * @returns {Array}
     */
    treeToFlat: function (tree, key, closeStatusMap, hookFunc, sortFunc, filterFunc) {
        var output = [];
        var stack = [{level: 0, data: tree, index: 0}];
        while (stack.length > 0) {
            var elem = stack.pop();
            // if array push child to stack
            if (elem.data instanceof Array) {
                if (typeof sortFunc == 'function') {
                    elem.data.sort(function (a, b) {
                        return sortFunc(a, b, elem.level);
                    });
                }
                if (typeof filterFunc == 'function') {
                    elem.data = elem.data.filter(function (item) {
                        return filterFunc(item, elem.level);
                    });
                }
                elem.data.reverse().forEach(function (item, index) {
                    stack.push({level: elem.level, data: item, super: elem.super, index: elem.data.length - index - 1});
                });
                continue;
            }
            // add some property
            if (elem.super) {
                Object.defineProperty(elem.data, '___super', {
                    enumerable: !!this.debug,
                    configurable: true,
                    writable: true,
                    value: elem.super
                });
                if (!elem.super.hasOwnProperty('___child')) {
                    Object.defineProperty(elem.super, '___child', {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: []
                    });
                }
                elem.super.___child.push(elem.data);
            }
            Object.defineProperty(elem.data, '___index', {
                enumerable: true,
                configurable: true,
                writable: true,
                value: elem.index
            });
            Object.defineProperty(elem.data, '___level', {
                enumerable: true,
                configurable: true,
                writable: true,
                value: elem.level
            });
            Object.defineProperty(elem.data, '___close', {
                enumerable: true,
                configurable: true,
                writable: true,
                value: !!(closeStatusMap && closeStatusMap[elem.data[key]])
            });
            if (typeof hookFunc == 'function') {
                hookFunc(elem.data);
            }
            var hideChild = false;
            var parent = elem.data;
            while (parent.___super) {
                parent = parent.___super;
                if (parent.___close) {
                    hideChild = true;
                    break;
                }
            }
            if (hideChild) {
                continue;
            }
            // if object add to arr
            output.push(elem.data);
            // if has child push it to stack
            if (elem.data.child) {
                stack.push({level: elem.level + 1, data: elem.data.child, super: elem.data});
                delete elem.data.child;
            }
        }
        return output;
    },
    treeRender: function (tree, key, renderFunc) {
        var stack = [{level: 0, data: tree, index: 0}];
        var rows = [];
        while (stack.length > 0) {
            var elem = stack.pop();
            if (!elem.data.hasOwnProperty('rowSpan')) {
                elem.data.rowSpan = 0;
            }
            rows.push(elem);
            if (key[elem.level] && elem.data[key[elem.level]] && elem.data[key[elem.level]].length > 0) {
                var child = elem.data[key[elem.level]];
                for (var i = child.length - 1; i >= 0; i--) {
                    var data = child[i];
                    Object.defineProperty(data, '___super', {
                        enumerable: false,
                        configurable: true,
                        writable: true,
                        value: elem.data
                    });
                    stack.push({
                        level: elem.level + 1,
                        data: data,
                        index: i
                    });
                }
            }
            else {
                elem.data.rowSpan = 1;
                var parent = elem.data.___super;
                while (parent) {
                    parent.rowSpan++;
                    parent = parent.___super;
                }
            }
        }
        var rowList = [];
        while (rows.length > 0) {
            var rowDataMap = {};
            var row = rows.pop();
            rowDataMap[row.level] = row.data;
            while (rows.length > 0 && rows[rows.length - 1].level < row.level) {
                row = rows.pop();
                rowDataMap[row.level] = row.data;
            }
            rowList.push(renderFunc(row.level, rowDataMap));
        }
        return rowList.reverse();
    },
    numberFormat: function (number, fractionSize, leading, trailing, dotMark, commaMark) {
        if (isNaN(number)) return number;
        if (typeof trailing != 'undefined' && trailing !== null) {
            number = parseFloat(number).toFixed(trailing);
        }
        var numberArray;
        if (typeof leading != 'undefined' && leading !== null) {
            numberArray = number.toString().split('.');
            numberArray[0] = Array.apply(null, new Array(leading)).map(function () {
                    return '0';
                }).join('') + numberArray[0];
            numberArray[0] = numberArray[0].slice(-leading);
            number = numberArray.join('.');
        }
        if (typeof fractionSize != 'undefined' && fractionSize !== null) {
            numberArray = number.toString().split('.');
            numberArray[0] = numberArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            number = numberArray.join('.');
        }
        if (typeof dotMark == 'string') {
            number = number.toString().replace(/./, dotMark);
        }
        if (typeof commaMark == 'string') {
            number = number.toString().replace(/,/, commaMark);
        }
        return number;
    }
};


//Won't work below IE9, but totally safe otherwise
!function () {
    function _dynamicSortMultiple(attr) {
        /* dynamicSortMultiple function body comes here */
        var props = arguments;
        return function (obj1, obj2) {
            var i = 0, result = 0, numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
             * as long as we have extra properties to compare
             */
            while (result === 0 && i < numberOfProperties) {
                result = _dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        }
    }

    function _dynamicSort(property) {
        /* dynamicSort function body comes here */
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {

            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    Object.defineProperty(Array.prototype, "sortBy", {
        enumerable: false,
        writable: true,
        value: function () {
            return this.sort(_dynamicSortMultiple.apply(null, arguments));
        }
    });
}();
