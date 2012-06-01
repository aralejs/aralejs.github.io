define("#base/0.9.12/attribute-debug", [], function(require, exports) {

    // Attribute
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters


    // 负责 attributes 的初始化
    // attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
    exports.initAttrs = function(config) {
        var specialProps = this.propsInAttrs || [];

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

        // Convert `on/before/afterXxx` config to event handler.
        parseEventsFromAttrs(this, attrs);

        // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题
        this.attrs = attrs;

        // 让属性的初始值生效
        for (var key in attrs) {
            if (!attrs.hasOwnProperty(key)) continue;
            var attr = attrs[key];

            // 在 set 里，有可能调用到 getter / setter 方法，在这两个方法里，很可能
            // 会引用尚未初始化的变量，比如 this.element. 这时采取忽略就好。因为这种
            // 情况下的属性，一般并不需要初始化。
            try {

                // 如果同时有 value 和 setter，先要调用一下 setter，以保证
                // 关联属性的值正确。比如只有纯 setter / getter 的 xy 属性。
                if (attr.hasOwnProperty('value') && attr.setter) {
                    attr.setter.call(this, attr.value, key);
                }

                // 设置之，如果有改变，则触发事件
                this.set(key, this.get(key));
            }
            catch (ex) {
                // 虽然可忽略，但还是尽可能让开发者知晓
                if (typeof console === 'object' && console.log) {
                    console.log('A caught exception occurs: ' + ex);
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

        // ready 表示组件的初始状态是否已 OK
        // 在 ready 之前，所有属性的设置操作都是静默的
        var ready = this.__ready;
        var silent = ready ? options.silent : true;

        var now = this.attrs;
        var changed = this.__changedAttrs || (this.__changedAttrs = {});

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

            // 获取设置前的 prev 值
            // ready 之前，实例上属性的 prev 值都未定义
            var prev = ready ? this.get(key) : null;

            // 获取需要设置的 val 值
            // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
            if (isPlainObject(prev) && isPlainObject(val)) {
                val = merge(merge({}, prev), val);
            }

            // set finally
            now[key].value = val;

            // invoke change event
            if (!isEqual(prev, val)) {
                if (silent) {
                    // 如果已经有了，说明是对同一属性的多次静默设置。后续在调用 change
                    // 方法时，只触发一次 change:attr 事件。因此只要更新 val
                    // 值，prev 应该是第一次静默 set 时的值
                    if (changed[key]) {
                        changed[key][0] = val;
                    }
                    // 没有时，将当前环境保存起来
                    else {
                        changed[key] = [val, prev];
                    }
                }
                else {
                    this.trigger('change:' + key, val, prev, key);
                }
            }
        }

        return this;
    };


    // Call this method to manually fire a `"change"` event for triggering
    // a `"change:attribute"` event for each changed attribute.
    exports.change = function() {
        var changed = this.__changedAttrs;

        if (changed) {
            for (var key in changed) {
                if (changed.hasOwnProperty(key)) {
                    var args = changed[key];
                    this.trigger('change:' + key, args[0], args[1], key);
                }
            }
            delete this.__changedAttrs;
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

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
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


    var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
    var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;

    function parseEventsFromAttrs(host, attrs) {
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var value = attrs[key].value, m;

                if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                    host[m[1]](getEventName(m[2]), value);
                    delete attrs[key];
                }
            }
        }
    }

    // Converts `Show` to `show` and `ChangeTitle` to `change:title`
    function getEventName(name) {
        var m = name.match(EVENT_NAME_PATTERN);
        var ret = m[1] ? 'change:' : '';
        ret += m[2].toLowerCase() + m[3];
        return ret;
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


    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
    function isEmptyAttrValue(o) {
        return o == null || // null, undefined
                (isString(o) || isArray(o)) && o.length === 0 || // '', []
                isPlainObject(o) && isEmptyObject(o); // {}
    }

    // 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
    function isEqual(a, b) {
        if (a === b) return true;

        if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;

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
