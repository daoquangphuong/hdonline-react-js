'use strict';

module.exports = {
    sep1000: function (somenum, usa) {
        if (isNaN(somenum)) return '';
        var a = Math.abs(somenum);
        var check = String(a).split(/[.,]/);
        check[0] = check[0].replace(/^[-+]/, '');
        if (check[0].length <= 3) {
            return somenum;
        }
        var dec = String(somenum).split(/[.,]/)
            , sep = usa ? ',' : '.'
            , decsep = usa ? '.' : ',';

        return xsep(dec[0], sep) + (dec[1] ? decsep + dec[1] : '');

        function xsep(num, sep) {
            var n = String(num).split('')
                , i = -3;
            while (n.length + i > 0) {
                n.splice(i, 0, sep);
                i -= 4;
            }
            n = n.join('');
            n = n.replace(/^(-,)/, '-');
            return n;
        }
    },

    excerpts: function (input, len) {
        if(input.length > len){
            return input.substring(0, len) + '...';
        }
        return input
    }
};