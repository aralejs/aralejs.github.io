define(function(require, exports, module) {
    var $ = require('$'),
        Rule = require('./rule');

    var u_count = 0;
    function unique() {
        return '__anonymous__' + (u_count++);
    }

    function parseRule(str) {
        //eg. valueBetween{min: 1, max: 2}
        var match = str.match(/([^{}:\s]*)(\{[^\{\}]*\})?/);

        return {
            name: match[1],
            param: parseJSON(match[2])
        };
    };

    // convent string such as {a: 1, b: 2}, {"a":1, b: '2'} to object
    function parseJSON(str) {
        if (!str)
            return null;

        var NOTICE = 'Invalid option object "' + str + '".';

        // remove braces
        str = str.slice(1, -1);

        var result = {};

        var arr = str.split(',');
        $.each(arr, function(i, v) {
            arr[i] = $.trim(v);
            if (!arr[i])
                throw new Error(NOTICE);

            var arr2 = arr[i].split(':');

            var key = $.trim(arr2[0]),
                value = $.trim(arr2[1]);

            if (!key || !value)
                throw new Error(NOTICE);

            result[getValue(key)] = $.trim(getValue(value));
        });

        // 'abc' -> 'abc'  '"abc"' -> 'abc'
        function getValue(str) {
            if (str[0] == '"' && str[str.length - 1] == '"' || str[0] == "'" && str[str.length - 1] == "'") {
                return eval(str);
            }
            return str;
        }

        return result;
    }

    function parseRules(str) {
        if (!str) return null;

        return str.match(/[a-zA-Z0-9\-\_]+(\{.*\})?/g);
    };

    function parseDom(field) {
        var field = $(field);

        var result = {};
        var arr = [];

        //parse required attribute
        var required = field.attr('required');
        if (required) {
            arr.push('required');
            result.required = true;
        }

        //parse type attribute
        var type = field.attr('type');
        if (type && type != 'submit' && type != 'cancel' && type != 'checkbox' && type != 'radio' && type != 'select' && type != 'select-one' && type != 'file') {

            if (!Rule.getRule(type)) {
                throw new Error('Form field with type "' + type + '" not supported!');
            }

            arr.push(type);
        }

        //parse min attribute
        var min = field.attr('min');
        if (min) {
            arr.push('min{"min":"' + min + '"}');
        }

        //parse max attribute
        var max = field.attr('max');
        if (max) {
            arr.push('max{max:' + max + '}');
        }

        //parse minlength attribute
        var minlength = field.attr('minlength');
        if (minlength) {
            arr.push('minlength{min:' + minlength + '}');
        }

        //parse maxlength attribute
        var maxlength = field.attr('maxlength');
        if (maxlength) {
            arr.push('maxlength{max:' + maxlength + '}');
        }

        //parse pattern attribute
        var pattern = field.attr('pattern');
        if (pattern) {
            var regexp = new RegExp(pattern),
                name = unique();
            Rule.addRule(name, regexp);
            arr.push(name);
        }

        //parse data-rule attribute to get custom rules
        var rules = field.attr('data-rule');
        rules = rules && parseRules(rules);
        if (rules)
            arr = arr.concat(rules);

        result.rule = arr.length == 0 ? null : arr.join(' ');

        return result;
    };

    var helpers = {};
    function helper(name, fn) {
        if (fn) {
            helpers[name] = fn;
            return this;
        }

        return helpers[name];
    }

    module.exports = {
        parseRule: parseRule,
        parseRules: parseRules,
        parseDom: parseDom,
        helper: helper
    };

});
