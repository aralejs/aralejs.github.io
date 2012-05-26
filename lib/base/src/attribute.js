define(function(require, exports, module) {

    // Attribute
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters


    // A module that can be mixed in to *any object* in order to provide it
    // with attribute support.
    //
    //     var object = new Attribute();
    //     object.set('title', '...');
    //     object.get('title');
    //
    function Attribute() {
    }


    // Get the value of an attribute.
    Attribute.prototype.get = function(key) {
        return (this.attributes || {})[key];
    };


    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    Attribute.prototype.set = function(key, value, options) {
        var attr = {};

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (typeof key === 'string') {
            attr[key] = value;
        } else {
            attr = key;
            options = value;
        }

        var attrs = this.attributes || (this.attributes = {});

        for (var k in attr) {
            var v = attr[key];

            attrs[k] = v;

        }

    };


    module.exports = Attribute;


    // Helpers
    // -------

    function getValue(attrs, key) {
        var attr = attrs[key];

        // attr is: { value: 'xxx', ... }
        if (isPlainObject(attr) && attr.hasOwnProperty('value')) {
            return attr.value;
        }

        return attr;
    }


    function setValue(attrs, key, val) {
        var attr = attrs[key];

        // attr is: { value: 'xxx', ... }
        if (isPlainObject(attr) && attr.hasOwnProperty('value')) {
            attr.value = val;
        }

        attrs[key] = val;
    }


    var toString = Object.prototype.toString;

    function isPlainObject(o) {
        return o &&
            // 排除 boolean/string/number/function 等
            // 标准浏览器下，排除 window 等非 JS 对象
            // 注：ie8- 下，toString.call(window 等对象)  返回 '[object Object]'
                toString.call(o) === '[object Object]' &&
            // ie8- 下，排除 window 等非 JS 对象
                ('isPrototypeOf' in o);
    }

});
