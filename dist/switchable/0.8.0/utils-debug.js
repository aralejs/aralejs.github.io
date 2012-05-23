define("#switchable/0.8.0/utils-debug", ["jquery"], function(require, exports, module) {

    var utils = module.exports;
    var $ = require('jquery');

    var toString = Object.prototype.toString;
    var hasOwnProperty = function(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    };

    //需要确定这个会影响那些情况？
    var hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString'));
    var enumProperties = [
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'toString',
        'toLocaleString',
        'valueOf'
    ];

    var OP = Object.prototype;
    var toString = OP.toString;
    var AP = Array.prototype;
    var indexOf = AP.indexOf;
    var lastIndexOf = AP.lastIndexOf;
    var FALSE = false;

    //数组indexOf

    utils.indexOf = indexOf ?
        function(item, arr) {
            return indexOf.call(arr, item);
        } :
        function(item, arr) {
            for (var i = 0, len = arr.length; i < len; ++i) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        };


    var _mix = function(p, r, s, ov, deep) {
        if (ov || !(p in r)) {
            var target = r[p], src = s[p];
            // prevent never-end loop
            if (target === src) {
                return;
            }
            // 来源是数组和对象，并且要求深度 mix
            if (deep && src && (utils.isArray(src) || utils.isPlainObject(src))) {
                // 目标值为对象或数组，直接 mix
                // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                var clone = target && (utils.isArray(target) || utils.isPlainObject(target)) ?
                    target :
                    (utils.isArray(src) ? [] : {});
                r[p] = mix(clone, src, ov, undefined, true);
            } else if (src !== undefined) {
                r[p] = s[p];
            }
        }
    };

    var mix = function(r, s, ov, wl, deep) {
        if (!s || !r) {
            return r;
        }
        if (ov === undefined) {
            ov = true;
        }
        var i = 0, p, len;

        if (wl && (len = wl.length)) {
            for (; i < len; i++) {
                p = wl[i];
                if (p in s) {
                    _mix(p, r, s, ov, deep);
                }
            }
        } else {
            for (p in s) {
                // no hasOwnProperty judge !
                _mix(p, r, s, ov, deep);
            }

            // fix #101
            if (hasEnumBug) {
                for (; p = enumProperties[i++];) {
                    if (ov && hasOwnProperty(s, p)) {
                        r[p] = s[p];
                    }
                }
            }
        }
        return r;
    };

    var isPlainObject = function(o) {
        /**
         * note by yiminghe
         * isPlainObject(node=document.getElementById("xx")) -> false
         * toString.call(node) : ie678 == '[object Object]',other =='[object HTMLElement]'
         * 'isPrototypeOf' in node : ie678 === false ,other === true
         * refer http://lifesinger.org/blog/2010/12/thinking-of-isplainobject/
         */
        return o && toString.call(o) === '[object Object]' && 'isPrototypeOf' in o;
    };

    //下面处理类型的判断。
    var class2type = {};

    var _type = function(o) {
        return o == null ?
            String(o) :
            class2type[toString.call(o)] || 'object';
    };

    $.each('Boolean Number String Function Array Date RegExp Object'.split(' '),
        function(index, name, lc) {
            // populate the class2type map
            class2type['[object ' + name + ']'] = (lc = name.toLowerCase());

            // add isBoolean/isNumber/...
            utils['is' + name] = function(o) {
                return _type(o) == lc;
        }
    });

    /**
     * Executes the supplied function in the context of the supplied
     * object 'when' milliseconds later. Executes the function a
     * single time unless periodic is set to true.
     * @param fn {Function|String} the function to execute or the name of the method in
     *        the 'o' object to execute.
     * @param when {Number} the number of milliseconds to wait until the fn is executed.
     * @param {Boolean} [periodic] if true, executes continuously at supplied interval
     *        until canceled.
     * @param {Object} [context] the context object.
     * @param [data] that is provided to the function. This accepts either a single
     *        item or an array. If an array is provided, the function is executed with
     *        one parameter for each array item. If you need to pass a single array
     *        parameter, it needs to be wrapped in an array [myarray].
     * @return {Object} a timer object. Call the cancel() method on this object to stop
     *         the timer.
     */
    var later = function(fn, when, periodic, context, data) {
        when = when || 0;
        var m = fn,
            d = $.makeArray(data),
            f,
            r;

        if (utils.isString(fn)) {
            m = context[fn];
        }

        if (!m) {
            //console.error('method undefined');
            //TODO 需要错误处理
        }

        f = function() {
            m.apply(context, d);
        };

        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

        return {
            id: r,
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    };

    /**
     * Applies prototype properties from the supplier to the receiver.
     * @param   {Object} r received object.
     * @param   {...Object} s1 object need to  augment.
     *          {boolean} [ov=true] whether overwrite existing property.
     *          {String[]} [wl] array of white-list properties.
     * @return  {Object} the augmented object.
     */
    var augment = function(r, s1) {
        var args = [].slice.call(arguments, 0),
            len = args.length - 2,
            i = 1,
            ov = args[len],
            wl = args[len + 1];
        if (!util.isArray(wl)) {
            ov = wl;
            wl = undefined;
            len++;
        }
        if (!util.isBoolean(ov)) {
            ov = undefined;
            len++;
        }

        for (; i < len; i++) {
            args[i] && mix(r.prototype, args[i].prototype || args[i], ov, wl);
        }
        return r;
    };
     /**
     * buffers a call between a fixed time
     * @param {function} fn
     * @param {object} [context]
     * @param {Number} ms
     * @return {function} Returns a wrapped function that calls fn buffered.
     */
    utils.buffer = function(fn, ms, context) {
        ms = ms || 150;

        if (ms === -1) {
            return (function() {
                fn.apply(context || this, arguments);
            });
        }
        var bufferTimer = null;

        function f() {
            f.stop();
            bufferTimer = later(fn, ms, FALSE, context || this, arguments);
        }

        f.stop = function() {
            if (bufferTimer) {
                bufferTimer.cancel();
                bufferTimer = 0;
            }
        };

        return f;
    };

    utils.later = later;
    utils.mix = mix;
    utils.isPlainObject = isPlainObject;
    utils.augment = augment;
});
