define("#base/0.9.2/util-debug", [], function(require, exports) {

    var toString = Object.prototype.toString;


    var isArray = Array.isArray || function(val) {
        return toString.call(val) === '[object Array]';
    };


    exports.isString = function(val) {
        return toString.call(val) === '[object String]';
    };


    exports.isPlainObject = function(o) {
        return o &&
            // 排除 boolean/string/number/function 等
            // 标准浏览器下，排除 window 等非 JS 对象
            // 注：ie8- 下，toString.call(window 等对象)  返回 '[object Object]'
                toString.call(o) === '[object Object]' &&
            // ie8- 下，排除 window 等非 JS 对象
                ('isPrototypeOf' in o);
    };


    exports.merge = function(receiver, supplier) {
        var key, value;

        for (key in supplier) {
            value = supplier[key];

            if (isArray(value)) {
                value = value.slice();
            }
            else if (exports.isPlainObject(value)) {
                value = exports.merge(receiver[key] || {}, value);
            }

            receiver[key] = value;
        }

        return receiver;
    };


    exports.getInherited = function(instance, key, normalize) {
        var defaults = [];
        var proto = instance.constructor.prototype;

        while (proto) {
            proto[key] && defaults.unshift(proto[key]);
            proto = proto.constructor.superclass;
        }

        // Merge and clone default values to instance.
        var result = {};
        normalize || (normalize = same);
        for (var i = 0, len = defaults.length; i < len; i++) {
            result = exports.merge(result, normalize(defaults[i]));
        }

        return result;
    }

    function same(o) {
        return o;
    }

});
