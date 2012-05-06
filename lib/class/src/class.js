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
    Class.create = function(properties) {
        properties || (properties = {});

        // The default parent class is `Class`.
        var Parent = properties['Extends'] || (properties['Extends'] = Class);

        // The created class constructor
        function Sub() {
            // Call the parent constructor.
            Parent.apply(this, arguments);

            // All construction is actually done in the `initialize` method.
            return (properties['initialize']) ?
                    properties['initialize'].apply(this, arguments) :
                    this;
        }

        // Inherit class (static) properties from parent.
        if (Parent === Class) {
            Sub.extend = Class.extend;
        } else {
            mix(Sub, Parent);
        }

        // Add instance properties to the subclass.
        for (var key in properties) {
            implement.call(Sub, key, properties[key]);
        }

        return Sub;
    };


    function implement(key, value) {
        if (Mutators.hasOwnProperty(key)) {
            value = Mutators[key].call(this, value);
            if (value == null) return;
        }

        this.prototype[key] = value;
    }


    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties['Extends'] = this;
        return Class.create(properties);
    };


    // Mutators define special properties.
    var Mutators = Class.Mutators = {

        'Extends': function(Parent) {
            // Set the prototype chain to inherit from `Parent`.
            var proto = createProto(Parent.prototype);

            // Enforce the constructor to be what we expect.
            proto.constructor = this;

            // Set a convenience property in case the parent's prototype is
            // needed later.
            this['superclass'] = Parent.prototype;
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
