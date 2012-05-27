define(function(require, exports) {

    // Attrs
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters


    var Util = require('./util');


    exports.setAttrs = function(userValues) {
        // Keep existed attrs.
        if (!this.hasOwnProperty('attrs')) {
            this.attrs = {};
        }

        var attrs = this.attrs;
        Util.merge(attrs, Util.getInheritedValues(this, 'attrs'));
        Util.merge(attrs, userValues);
        normalize(attrs);
    };


    // Get the value of an attribute.
    exports.get = function(key) {
        var attr = this.attrs[key];
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
        // set({ "key": val }, options)
        else {
            attrs = key;
            options = val;
        }

        var now = this.attrs;
        var silent = options.silent;

        for (key in attrs) {
            var attr = now[key];
            val = attrs[key];

            // invoke validator
            if (attr.validator &&
                    !attr.validator.call(this, val, key)) {
                continue;
            }

            // invoke setter
            if (attr.setter) {
                val = attr.setter.call(this, val, key);
            }

            // set finally
            var previous = this.get(key);
            now[key].value = val;

            // invoke change event
            if (!silent && this.trigger) {
                this.trigger('change:' + key, previous, val, key);
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
    }


    function hasOwnProperties(object, properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
            if (object.hasOwnProperty(properties[i])) {
                return true;
            }
        }
        return false;
    }

});
