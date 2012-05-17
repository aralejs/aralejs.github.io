define(function(require, exports, module) {
    var $ = require('jquery'),
        ruleFactory = require('./ruleFactory');


    var u_count = 0;
    function unique() {
        return '__anonymous__' + (u_count++);
    }

    exports.parseRule = function(str) {
        //valueBetween{min: 1, max: 2}
        var match = str.match(/([^{}:\s]*)(\{.*\})?/);

        return {
            name: match[1],
            param: $.parseJSON(match[2])
        };
    };

    exports.parseDom = function(field) {
        var field = $(field);

        var results = [];

        var required = field.attr('required');
        if (required) {
            results.push('required');
        }

        var type = field.attr('type');
        if (type) {
            if (type == 'submit' || type == 'cancel')
                return;

            if (!ruleFactory.getRule(type)) {
                throw 'Form field with type "' + type + '" not supported!';
            }

            results.push(type);
        }

        var pattern = field.attr('pattern');
        if (pattern) {
            var regexp = new RegExp(pattern),
                name = unique();
            ruleFactory.addRule(name, regexp);
            results.push(name);
        }

        var rules = field.attr('data-rules');
        rules = rules && rules.match(/[a-zA-Z\-\_]+(\{.*\})?/g);

        if(rules)
            results = results.concat(rules);
        console.log('results', results);
        return results;
    };

});
