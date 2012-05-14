define("#base/0.9.1/options-debug", [], function(require, exports) {

    // Options
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class.Extras


    var EVENT_PATTERN = /^on[A-Z]/;


    exports.setOptions = function(customOptions) {
        // Keep existed options.
        if (!this.hasOwnProperty('options')) {
            this.options = {};
        }

        var options = this.options;

        // Only merge all default options one time.
        if (!options.__defaults) {
            merge(options, options.__defaults = getDefaultOptions(this));
        }

        merge(options, customOptions);

        // Parse `onXxx` option to event handler.
        if (this.on) {
            for (var key in options) {
                var value = options[key];
                if (typeof value === 'function' && EVENT_PATTERN.test(key)) {
                    this.on(getEventName(key), value);
                    delete options[key];
                }
            }
        }

        return this;
    };


    // Helpers


    // Get all default options from ancestors.
    function getDefaultOptions(instance) {
        var defaults = [];
        var proto = instance.constructor.prototype;

        while (proto) {
            proto.options && defaults.unshift(proto.options);
            proto = proto.constructor.superclass;
        }

        // Merge and clone options to instance.
        var result = {};
        for (var i = 0, len = defaults.length; i < len; i++) {
            result = merge(result, defaults[i]);
        }

        return result;
    }


    function merge(receiver, supplier) {
        var key, value;

        for (key in supplier) {
            value = supplier[key];
            if (typeof value === 'object') {
                value = merge(receiver[key] || {}, value);
            }
            receiver[key] = value;
        }

        return receiver;
    }


    // Convert `onChangeTitle` to `changeTitle`
    function getEventName(name) {
        return name.charAt(2).toLowerCase() + name.substring(3);
    }

});
