/* @author kangpangpang@gmail.com */
define(function(require, exports) {
    function Events() {
        if (!( this instanceof Events)) {
            return new Events();
        }
        this._events= {};
    }

    Events.prototype = {
        on: function(type, listener) {
            if (!listener) {
                return this;
            }
            if (!this._events) {
                this._events = {};
            }
            if (!this._events[type]) {
                this._events[type] = [];
            }
            this._events[type].push(listener); 
            return this;
        },
        off: function(type, listener) {
            if ('function' !== typeof listener) {
                throw new Error('off only takes instances of Function');
            }
            if (!this._events || !this._events[type]) {
                return this;
            }
            var listeners = this._events[type];
            var position = -1;
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    position = i;
                    break;
                } 
            }
            if (position < 0) {
                return this;
            }
            listeners.splice(position, 1);
            return this;
        },
        once: function(type, listener) {
            var that = this;
            var temp = function() {
                that.off(type, temp);
                listener.apply(this, arguments);
            };     
            this.on(type, temp);
            return this;
        },
        trigger: function(type) {
            if (!this._events || !this._events[type]) {
                return false;
            }
            var listeners = this._events[type];  
            var args = [].slice.call(arguments, 1);;
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].apply(this, args);
            }
            return true;
        }
    };
    Events.constructor = Events;
    exports.Events = Events;
});


