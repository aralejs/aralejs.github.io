/* @author lifesinger@gmail.com */

define(function(require, exports) {

    // Options
    // ------------------
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
                if (typeof value === 'function' && EVENT_PATTERN.test(value)) {
                    this.on(key.substring(2), value);
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
            if (value === Object(value)) {
                value = merge({}, value);
            }
            r[key] = value;
        }

        if (s2) {
            merge(r, s2);
        }

        return r;
    }

});
