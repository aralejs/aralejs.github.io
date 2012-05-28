define("#base/0.9.2/attrs-debug", ["./util"], function(require, exports) {

    // Attrs
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters


    var Util = require('./util');


    // 负责 attributes 的初始化
    // attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
    exports.initAttrs = function(config) {
        // Keep existed attrs.
        if (!this.hasOwnProperty('attrs')) {
            this.attrs = {};
        }
        var attrs = this.attrs;

        // Only merge all inherited attributes once.
        if (!attrs.__defaults) {
            attrs.__defaults = Util.getInherited(this, 'attrs', normalize);
            Util.merge(attrs, attrs.__defaults);
        }

        var options = { silent: true };

        for (var key in attrs) {
            // only merge recognized attributes, and delete it from config
            // after merged.
            if (config && config.hasOwnProperty(key)) {
                this.set(key, config[key], options);
                delete config[key];
            }

            // automatically register `_onChangeX` method as
            // 'change:x' handler.
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
        if (Util.isString(key)) {
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
            var attr = now[key] || ( now[key] = {} );
            val = attrs[key];

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
            if (Util.isPlainObject(prev) && Util.isPlainObject(val)) {
                val = Util.merge(Util.merge({}, prev), val);
            }
            now[key].value = val;

            // invoke change event
            if (!silent && this.trigger && prev !== val) {
                this.trigger('change:' + key, val, prev, key);
            }
        }
    };



    // Helpers
    // -------

    var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'validator'];

    // normalize `attrs` to
    //
    //   {
    //      value: 'xx',
    //      getter: fn,
    //      setter: fn,
    //      validator: fn
    //   }
    //
    function normalize(attrs) {
        // clone it
        attrs = Util.merge({}, attrs);

        for (var key in attrs) {
            var attr = attrs[key];

            if (Util.isPlainObject(attr) &&
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

});
