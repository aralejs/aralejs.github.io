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
    //     object.on('expand', function() { alert('expanded'); });
    //     object.trigger('expand');
    //
    function Events() {
    }


    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    Events.prototype.on = function(events, callback, context) {
        if (!callback) return this;
        events = events.split(eventSplitter);

        var cache = this.__events || (this.__events = {});
        var event, list, node, tail;

        // Create an immutable callback list, allowing traversal during
        // modification. The tail is an empty object that will always be
        // used as the next node.
        while (event = events.shift()) {
            list = hasOwnProperty(cache, event) ? cache[event] : null;

            node = list ? list.tail : {};
            node.next = tail = {};
            node.context = context;
            node.callback = callback;
            cache[event] = {tail: tail, next: list ? list.next : node};
        }

        return this;
    };


    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Events.prototype.off = function(events, callback, context) {
        var cache, event, node, tail, cb, ctx;

        // No events, or removing *all* events.
        if (!(cache = this.__events)) return this;
        if (!(events || callback || context)) {
            delete this.__events;
            return this;
        }

        events = events ? events.split(eventSplitter) : keys(cache);

        // Loop through the listed events and contexts, splicing them out of
        // the linked list of callbacks.
        while (event = events.shift()) {
            node = cache[event];
            delete cache[event];
            if (!node || !(callback || context)) continue;

            // Create a new list, omitting the indicated callbacks.
            tail = node.tail;
            while ((node = node.next) !== tail) {
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
    Events.prototype.trigger = function(events) {
        var cache, event, node, tail, all, rest, args;
        if (!(cache = this.__events)) return this;

        events = events.split(eventSplitter);
        rest = Array.prototype.slice.call(arguments, 1);
        all = cache.all;

        // For each event, walk through the linked list of callbacks twice,
        // first to trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {

            if (node = cache[event]) {
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, rest);
                }
            }

            if (node = all) {
                args = [event].concat(rest);
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, args);
                }
            }
        }

        return this;
    };


    // Helpers
    function hasOwnProperty(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    }


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
            var result = [], name,i;

            for (var p in o) {
                if (hasOwnProperty(o, p)) {
                    result.push(p);
                }
            }

            if (hasDontEnumBug) {
                for(i=0;name=DontEnums[i++];){
                    if (hasOwnProperty(o, name)) {
                        result.push(name);
                    }
                }
            }

            return result;
        }
    }


    return Events;
});
