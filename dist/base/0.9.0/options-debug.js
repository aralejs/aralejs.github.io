define("#base/0.9.0/options-debug", [], function(require, exports) {

    // Options
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class.Extras


    var EVENT_PATTERN = /^on[A-Z]/;


    exports.setOptions = function(options) {
        var key, value;

        // Merge and clone options.
        options = this.options = merge({}, this.options, options);

        // Parse `onXxx` option to event listener.
        if (this.on) {
            for (key in options) {
                value = options[key];
                if (typeof value === 'function' && EVENT_PATTERN.test(key)) {
                    this.on(getEventName(key), value);
                    delete options[key];
                }
            }
        }

        return this;
    };


    // Helpers

    function merge(r, s1, s2) {
        var key, value;

        for (key in s1) {
            value = s1[key];
            if (typeof value === 'object') {
                value = merge({}, r[key], value);
            }
            r[key] = value;
        }

        if (s2) {
            merge(r, s2);
        }

        return r;
    }


    // Convert `onChangeTitle` to `changeTitle`
    function getEventName(name) {
        return name.charAt(2).toLowerCase() + name.substring(3);
    }

});
