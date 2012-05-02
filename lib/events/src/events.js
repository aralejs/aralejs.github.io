/* @author lifesinger@gmail.com */

define(function() {

    // Events
    // -----------------
    // Thanks to Backbone.Events:
    // https://github.com/documentcloud/backbone/blob/master/backbone.js

    // Regular expression used to split event strings
    var eventSplitter = /\s+/;


    // A module that can be mixed in to *any object* in order to provide it
    // with custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = new Events();
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    function Events() {
    }


    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    Events.prototype.on = function(events, callback, context) {
        if (!callback) return this;
        events = events.split(eventSplitter);

        var calls = this.__callbacks || (this.__callbacks = {});
        var event, list, node;

        // Create an linked list.
        while (event = events.shift()) {
            list = calls[event];

            // Insert a new node to the tail.
            if (list) {
                node = list.tail = list.tail.next = {};
            } else {
                node = {};
                calls[event] = { next: node, tail: node };
            }

            // Set properties.
            node.callback = callback;
            node.context = context;
        }

        return this;
    };


    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Event.prototype.off = function(events, callback, context) {
        var event, calls, node, cb, ctx;

        // No events, or removing *all* events.
        if (!(calls = this.__callbacks)) return this;
        if (!(events || callback || context)) {
            delete this.__callbacks;
            return this;
        }

        events = events ? events.split(eventSplitter) : keys(calls);

        // Loop through the listed events and contexts, splicing them out of
        // the linked list of callbacks.
        while (event = events.shift()) {
            node = calls[event];
            delete calls[event];
            if (!node || !(callback || context)) continue;

            // Create a new list, omitting the indicated callbacks.
            while (node = node.next) {
                cb = node.callback;
                ctx = node.context;
                if ((callback && cb !== callback) ||
                        (context && ctx !== context)) {
                    this.on(event, cb, ctx);
                }
            }
        }

        return this;
    };


    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Event.prototype.trigger = function(events) {
        var event, node, calls, args, rest;
        if (!(calls = this.__callbacks)) return this;

        events = events.split(eventSplitter);
        rest = Array.prototype.slice.call(arguments, 1);

        // For each event, walk through the linked list of callbacks twice,
        // first to trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {

            if (node = calls[event]) {
                while (node = node.next) {
                    node.callback.apply(node.context || this, rest);
                }
            }

            if (node = calls['all']) {
                args = rest.unshift(event);
                while (node = node.next) {
                    node.callback.apply(node.context || this, args);
                }
            }
        }

        return this;
    };


    // Helpers
    var keys = Object.keys;

    if (!keys) {
        var hasDontEnumBug = !{toString: ''}.propertyIsEnumerable('toString');
        var DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ];

        keys = function(o) {
            var result = [];

            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < DontEnums.length; i++) {
                    if (o.hasOwnProperty(DontEnums[i])) {
                        result.push(DontEnums[i]);
                    }
                }
            }

            return result;
        }
    }


    return Events;
});
