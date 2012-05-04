/* @author lifesinger@gmail.com */

define(function() {

    // Events
    // -----------------
    // Thanks to:
    //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
    //  - https://github.com/joyent/node/blob/master/lib/events.js

    var EVENT_SPLITTER = /\s+/;


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
        events = events.split(EVENT_SPLITTER);

        var cache = this.__events || (this.__events = {});
        var event, list;

        while (event = events.shift()) {
            list = cache[event] || (cache[event] = []);
            list.push(callback, context);
        }

        return this;
    };


    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Events.prototype.off = function(events, callback, context) {
        var cache, event, list, newest, i, len, cb, ctx;

        // No events, or removing *all* events.
        if (!(cache = this.__events)) return this;
        if (!(events || callback || context)) {
            delete this.__events;
            return this;
        }

        events = events ? events.split(EVENT_SPLITTER) : keys(cache);

        // Loop through the listed events and contexts, splicing them out of
        // the linked list of callbacks.
        while (event = events.shift()) {
            list = cache[event];
            if (!list) continue;

            if (!(callback || context)) {
                delete cache[event];
                continue;
            }

            newest = [];
            for (i = 0, len = list.length; i < len; i += 2) {
                cb = list[i];
                ctx = list[i + 1];

                if ((callback && cb !== callback) ||
                        (context && ctx !== context)) {
                    newest.push(cb, ctx);
                }
            }
            cache[event] = newest;
        }

        return this;
    };


    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Events.prototype.trigger = function(events) {
        var cache;
        if (!(cache = this.__events)) return this;
        events = events.split(EVENT_SPLITTER);

        var rest = Array.prototype.slice.call(arguments, 1);
        var event, lists = [], list, i, len, args;

        // Clone all callback lists.
        var all = cache['all'];
        all && (all = all.slice());

        while (event = events.shift()) {
            cache[event] && lists.push(cache[event].slice(), rest);
            all && lists.push(all, [event].concat(rest));
        }

        // For each event, walk through the linked list of callbacks twice,
        // first to trigger the event, then to trigger any `"all"` callbacks.
        while (list = lists.shift()) {
            args = lists.shift();
            for (i = 0, len = list.length; i < len; i += 2) {
                list[i].apply(list[i + 1] || this, args);
            }
        }

        return this;
    };


    // Helpers
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


    return Events;
});
