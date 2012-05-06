/* @author lifesinger@gmail.com */

define(function() {

    // Class
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class
    //  - http://ejohn.org/blog/simple-javascript-inheritance/
    //  - https://github.com/ded/klass
    //  - http://documentcloud.github.com/backbone/#Model-extend
    //  - https://github.com/joyent/node/blob/master/lib/util.js
    //  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js


    // The base Class implementation (does nothing)
    function Class() {
    }


    // Create a new Class.
    //
    //    var FlyRedPig = Class.create({
    //        Extends: Animal,
    //        Implements: Flyable,
    //        initialize: function() {
    //            this.superclass.initialize.apply(this, arguments);
    //        },
    //        Statics: {
    //            COLOR: 'red'
    //        }
    //    });
    //
    Class.create = function(parent, properties) {
        if (typeof parent !== 'function') {
            properties = parent;
            parent = null;
        }

        properties || (properties = {});
        parent || (parent = properties['Extends'] || Class);
        properties['Extends'] = parent;

        // The created class constructor
        function SubClass() {
            // Call the parent constructor.
            parent.apply(this, arguments);

            // All construction is actually done in the `initialize` method.
            if (this['initialize']) {
                this['initialize'].apply(this, arguments);
            }
        }

        // Inherit class (static) properties from parent.
        if (parent === Class) {
            SubClass.extend = Class.extend;
        } else {
            mix(SubClass, parent);
        }

        // Add instance properties to the subclass.
        for (var key in properties) {
            implement.call(SubClass, key, properties[key]);
        }

        return SubClass;
    };


    function implement(key, value) {
        if (Class.Mutators.hasOwnProperty(key)) {
            Class.Mutators[key].call(this, value);
        } else {
            this.prototype[key] = value;

        }
    }


    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties || (properties = {});
        properties['Extends'] = this;

        return Class.create(properties);
    };


    // Mutators define special properties.
    Class.Mutators = {
        'Extends': function(parent) {
            // Set the prototype chain to inherit from `parent`.
            var proto = this.prototype = createProto(parent.prototype);

            // Enforce the constructor to be what we expect.
            proto.constructor = this;

            // Set a convenience property in case the parent's prototype is
            // needed later.
            this['superclass'] = parent.prototype;
        },

        'Implements': function(items) {
            isArray(items) || (items = [items]);
            var proto = this.prototype, item;

            while (item = items.shift()) {
                mix(proto, item.prototype || item);
            }
        },

        'Statics': function(staticProperties) {
            mix(this, staticProperties);
        }
    };


    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {
    }

    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = Object.__proto__ ?
            function(proto) {
                return { __proto__: proto };
            } :
            function(proto) {
                Ctor.prototype = proto;
                return new Ctor();
            };


    // Helpers
    // ------------

    function mix(r, s) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            r[p] = s[p];
        }
    }


    var toString = Object.prototype.toString;
    var isArray = Array.isArray;

    if (!isArray) {
        isArray = function(val) {
            return toString.call(val) === '[object Array]';
        };
    }


    return Class;
});
