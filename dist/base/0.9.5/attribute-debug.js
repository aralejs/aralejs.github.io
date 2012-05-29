define("#base/0.9.5/attribute-debug", [], function(require, exports) {

    // Attribute
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters


    // 负责 attributes 的初始化
    // attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
    exports.initAttrs = function(config) {
        // Keep existed attrs.
        if (!this.hasOwnProperty('attrs')) {
            this.attrs = {};
        }
        var attrs = this.attrs;

        // Merge all inherited attributes.
        merge(attrs, getInheritedValues(this, 'attrs'));

        // Merge config attributes.
        var options = { silent: true };
        if (config) {
            for (var key in config) {
                this.set(key, config[key], options);
            }
        }

        // Automatically register `_onChangeX` method as 'change:x' handler.
        for (key in attrs) {
            var eventKey = getChangeEventKey(key);
            if (this[eventKey]) {
                this.on('change:' + key, this[eventKey]);
            }
        }
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

        for (key in attrs) {
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
            if (!silent && this.trigger/* && prev !== val*/) {
                this.trigger('change:' + key, val, prev, key);
            }
        }
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

    function merge(receiver, supplier) {
        var key, value;

        for (key in supplier) {
            value = supplier[key];

            if (isArray(value)) {
                value = value.slice();
            }
            else if (isPlainObject(value)) {
                value = merge(receiver[key] || {}, value);
            }

            receiver[key] = value;
        }

        return receiver;
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


    function getInheritedValues(instance, key) {
        var defaults = [];
        var proto = instance.constructor.prototype;

        while (proto) {
            proto[key] && defaults.unshift(proto[key]);
            proto = proto.constructor.superclass;
        }

        // Merge and clone default values to instance.
        var result = {};
        for (var i = 0, len = defaults.length; i < len; i++) {
            result = merge(result, normalize(defaults[i]));
        }

        return result;
    }

});
