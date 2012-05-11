define("#base/0.9.1/options-debug", [], function(require, exports) {

    // Options
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class.Extras


    var EVENT_PATTERN = /^on[A-Z]/;


    exports.setOptions = function(options) {
        // Options is already parsed.
        if (this.hasOwnProperty('options')) return;

        // Get all default options from parent prototype.
        var optionsQueue = [options];
        var proto = this.constructor.prototype;

        while (proto) {
            proto.options && optionsQueue.unshift(proto.options);
            proto = proto.constructor.superclass;
        }

        // Merge and clone options.
        this.options = {};
        for (var i = 0, len = optionsQueue.length; i < len; i++) {
            this.options = merge(this.options, optionsQueue[i]);
        }

        // Parse `onXxx` option to event handler.
        if (this.on) {
            options = this.options;

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
