define(function(require, exports, module) {
    var $ = require('jquery'),
        Rule = require('./rule');

    var u_count = 0;
    function unique() {
        return '__anonymous__' + (u_count++);
    }

    function parseRule(str) {
        //eg. valueBetween{min: 1, max: 2}
        var match = str.match(/([^{}:\s]*)(\{.*\})?/);

        return {
            name: match[1],
            param: $.parseJSON(match[2])
        };
    };

    function parseRules(str) {
        return str.match(/[a-zA-Z0-9\-\_]+(\{.*\})?/g);
    };

    function parseDom(field) {
        var field = $(field);

        var results = [];

        //parse required attribute
        var required = field.attr('required');
        if (required) {
            results.push('required');
        }

        //parse type attribute
        var type = field.attr('type');
        if (type && type != 'submit' && type != 'cancel' && type != 'checkbox' && type != 'radio') {

            if (!Rule.getRule(type)) {
                throw 'Form field with type "' + type + '" not supported!';
            }

            results.push(type);
        }

        //parse min attribute
        var min = field.attr('min');
        if (min) {
            results.push('min{"min":"' + min + '"}');
        }

        //parse max attribute
        var max = field.attr('max');
        if (max) {
            results.push('max{"max":"' + max + '"}');
        }

        //parse minlength attribute
        var minlength = field.attr('minlength');
        if (minlength) {
            results.push('minlength{"min":"' + minlength + '"}');
        }

        //parse maxlength attribute
        var maxlength = field.attr('maxlength');
        if (maxlength) {
            results.push('maxlength{"max":"' + maxlength + '"}');
        }

        //parse pattern attribute
        var pattern = field.attr('pattern');
        if (pattern) {
            var regexp = new RegExp(pattern),
                name = unique();
            Rule.addRule(name, regexp);
            results.push(name);
        }

        //parse data-rule attribute to get custom rules
        var rules = field.attr('data-rule');
        rules = rules && parseRules(rules);
        if(rules)
            results = results.concat(rules);

        return results.length == 0 ? null : results;
    };

    module.exports = {
        parseRule: parseRule,
        parseRules: parseRules,
        parseDom: parseDom
    };

});
