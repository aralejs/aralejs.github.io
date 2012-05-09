/* @author shaoshuai0102@gmail.com */

define(function(require, exports, module) {
    var rules = {},
        messages = {},
		$ = require('jquery');

    function setRule(name, rule) {
        if (rules[name]) {
            throw new Error('setRule(): The rule with the same name has existed and cannot be overridden!');
        }

        switch($.type(rule)) {
            case 'regexp':
                rules[name] = function(opts, commit) {
                    var value = $(opts.element).val();
                    commit(rule.test(value));
                };
                break;
            case 'function':
                rules[name] = function(opts, commit) {
                    commit(rule(opts));
                };
                break;
            default:
                throw new Error('setRule(): Second arg must be a regexp or a function.');

        }
    }

    function setAsyncRule (name, rule) {
        if (rules[name]) {
            throw new Error('setRule(): The rule with the same name has existed and cannot be overridden!');
        }

        rules[name] = rule;
    }

    function setCombinedRule(name, combination) {
        if (rules[name]) {
            throw new Error('setRule(): The rule with the same name has existed and cannot be overridden!');
        }
    }

    function setMessage(name, msg) {
        messages[name] = msg;
    }

    function getRule(name) {
        return rules[name];
    }

    var defaultRules = {

        email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,

        string: /\d$/,

        integer: /^[1-9][0-9]*$/
    };

    $.each(defaultRules, function(name, rule) {
        setRule(name, rule);
    });

    module.exports = {
        setRule: setRule,
        setAsyncRule: setAsyncRule,
        setMessage: setMessage,
        getRule: getRule
    };

});
