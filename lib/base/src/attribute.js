define(function(require, exports) {

    // Attribute
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters


    // 负责 attributes 的初始化
    // attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
    exports.initAttrs = function(config) {
        var specialProps = this.propertiesInConfig || [];

        // Get all inherited attributes.
        var attrs = getInheritedAttrs(this, specialProps);

        // Merge user-specific attributes from config.
        if (config) {
            merge(attrs, normalize(config));
        }

        // Automatically register `_onChangeX` method as 'change:x' handler.
        for (key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var eventKey = getChangeEventKey(key);
                if (this[eventKey]) {
                    this.on('change:' + key, this[eventKey]);
                }
            }
        }

        // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs, 为了避免
        // this.attrs 从 prototype 上拿，这里必须将其初始化为空对象
        this.attrs = {};

        // Set attributes.
        var options = { silent: true };
        var now = this.attrs;
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                now[key] = attrs[key];

                // 将 value 置空，以便 set 时能触发事件
                var val = now[key].value;
                delete now[key].value;

                // 在 set 里，有可能调用到 getter / setter 方法，在这两个方法里，很可能
                // 会引用尚未初始化的变量，比如 this.element. 这时采取忽略就好。因为这种
                // 情况下的属性，一般并不需要初始化。
                try {
                    this.set(key, val, options);
                } catch (ex) {
                }
            }
        }

        // 将 this.attrs 上的 special properties 放回 this 上
        copySpecialProps(specialProps, this, this.attrs, true);
    };


    // Get the value of an attribute.
    exports.get = function(key) {
        var attr = this.attrs[key] || {};
        var val = attr.value;
        return attr.getter ? attr.getter.call(this, val, key) : val;
    };


    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    exports.set = function(key, val, options) {
        var attrs = {};

        // set("key", val, options)
        if (isString(key)) {
            attrs[key] = val;
        }
        // set({ "key": val, "key2": val2 }, options)
        else {
            attrs = key;
            options = val;
        }

        options || (options = {});
        var now = this.attrs;
        var silent = options.silent;
        var pending = now.__pending || (now.__pending = {});

        for (key in attrs) {
            if (!attrs.hasOwnProperty(key)) continue;

            var attr = now[key] || (now[key] = {});
            val = attrs[key];

            if (attr.readOnly) {
                throw 'This attribute is readOnly: ' + key;
            }

            // invoke validator
            if (attr.validator) {
                var ex = attr.validator.call(this, val, key);
                if (ex !== true) {
                    if (options.error) {
                        options.error.call(this, ex);
                    }
                    continue;
                }
            }

            // invoke setter
            if (attr.setter) {
                val = attr.setter.call(this, val, key);
            }

            // set finally
            var prev = this.get(key);
            if (isPlainObject(prev) && isPlainObject(val)) {
                val = merge(merge({}, prev), val);
            }
            now[key].value = val;

            // invoke change event
            if (!isEqual(prev, val)) {
                if (silent) {
                    pending[key] = [val, prev];
                } else {
                    this.trigger('change:' + key, val, prev, key);
                }
            }
        }

        return this;
    };


    // Call this method to manually fire a `"change"` event for triggering
    // a `"change:attribute"` event for each changed attribute.
    exports.change = function() {
        var pending = this.attrs.__pending;

        if (pending) {
            for (var key in pending) {
                if (pending.hasOwnProperty(key)) {
                    var args = pending[key];
                    this.trigger('change:' + key, args[0], args[1], key);
                }
            }

            delete this.attrs.__pending;
        }

        return this;
    };


    // Helpers
    // -------

    var toString = Object.prototype.toString;

    var isArray = Array.isArray || function(val) {
        return toString.call(val) === '[object Array]';
    };

    function isString(val) {
        return toString.call(val) === '[object String]';
    }

    function isPlainObject(o) {
        return o &&
            // 排除 boolean/string/number/function 等
            // 标准浏览器下，排除 window 等非 JS 对象
            // 注：ie8- 下，toString.call(window 等对象)  返回 '[object Object]'
                toString.call(o) === '[object Object]' &&
            // ie8- 下，排除 window 等非 JS 对象
                ('isPrototypeOf' in o);
    }

    function isEmptyObject(o) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) return false;
        }
        return true;
    }

    function merge(receiver, supplier) {
        var key, value;

        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                value = supplier[key];

                // 只 clone 数组和 plain object，其他的保持不变
                if (isArray(value)) {
                    value = value.slice();
                }
                else if (isPlainObject(value)) {
                    value = merge(receiver[key] || {}, value);
                }

                receiver[key] = value;
            }
        }

        return receiver;
    }

    var keys = Object.keys;

    if (!keys) {
        keys = function(o) {
            var result = [];

            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        }
    }


    var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter',
        'validator', 'readOnly'];

    // normalize `attrs` to
    //
    //   {
    //      value: 'xx',
    //      getter: fn,
    //      setter: fn,
    //      validator: fn,
    //      readOnly: boolean
    //   }
    //
    function normalize(attrs) {
        // clone it
        attrs = merge({}, attrs);

        for (var key in attrs) {
            var attr = attrs[key];

            if (isPlainObject(attr) &&
                    hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
                continue;
            }

            attrs[key] = {
                value: attr
            };
        }

        return attrs;
    }


    function hasOwnProperties(object, properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
            if (object.hasOwnProperty(properties[i])) {
                return true;
            }
        }
        return false;
    }


    function getChangeEventKey(key) {
        return '_onChange' + key.charAt(0).toUpperCase() + key.substring(1);
    }


    function copySpecialProps(specialProps, receiver, supplier, isAttr) {
        for (var i = 0, len = specialProps.length; i < len; i++) {
            var key = specialProps[i];

            if (key in supplier && supplier.hasOwnProperty(key)) {
                var val = supplier[key];
                receiver[key] = isAttr ? val.value : val;
            }
        }
    }


    function getInheritedAttrs(instance, specialProps) {
        var inherited = [];
        var proto = instance.constructor.prototype;

        while (proto) {
            // 不要拿到 prototype 上的
            if (!proto.hasOwnProperty('attrs')) {
                proto.attrs = {};
            }

            // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
            copySpecialProps(specialProps, proto.attrs, proto);

            // 为空时不添加
            if (!isEmptyObject(proto.attrs)) {
                inherited.unshift(proto.attrs);
            }

            // 向上回溯一级
            proto = proto.constructor.superclass;
        }

        // Merge and clone default values to instance.
        var result = {};
        for (var i = 0, len = inherited.length; i < len; i++) {
            result = merge(result, normalize(inherited[i]));
        }

        return result;
    }


    // 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
    function isEqual(a, b) {
        if (a === b) return true;

        // 对于 attrs 的 value 来说，null 和 undefined 等同
        if (a == null || b == null) return a == b;

        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className != toString.call(b)) return false;

        switch (className) {

            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
                // Primitives and their corresponding object wrappers are
                // equivalent; thus, `"5"` is equivalent to `new String("5")`.
                return a == String(b);

            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive. An `equal`
                // comparison is performed for other numeric values.
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values.
                // Dates are compared by their millisecond representations.
                // Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a == +b;

            // RegExps are compared by their source patterns and flags.
            case '[object RegExp]':
                return a.source == b.source &&
                        a.global == b.global &&
                        a.multiline == b.multiline &&
                        a.ignoreCase == b.ignoreCase;

            // 简单判断数组包含的 primitive 值是否相等
            case '[object Array]':
                var aString = a.toString();
                var bString = b.toString();

                // 只要包含非 primitive 值，为了稳妥起见，都返回 false
                return aString.indexOf('[object') === -1 &&
                        bString.indexOf('[object') === -1 &&
                        aString === bString;
        }

        if (typeof a != 'object' || typeof b != 'object') return false;

        // 简单判断两个对象是否相等，只判断第一层
        if (isPlainObject(a) && isPlainObject(b)) {

            // 键值不相等，立刻返回 false
            if (!isEqual(keys(a), keys(b))) {
                return false;
            }

            // 键相同，但有值不等，立刻返回 false
            for (var p in a) {
                if (a[p] !== b[p]) return false;
            }

            return true;
        }

        // 其他情况返回 false, 以避免误判导致 change 事件没发生
        return false;
    }

});
