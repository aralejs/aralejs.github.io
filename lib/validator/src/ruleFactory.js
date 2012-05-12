define(function(require, exports, module) {
    var rules = {},
        messages = {},
		$ = require('jquery');

    function addRule(name, rule) {
        if (rules[name]) {
            throw 'The rule with the same name has existed and cannot be overridden!';
        }

        switch($.type(rule)) {
            case 'regexp':
                rules[name] = function(opts, commit) {
                    var value = $(opts.element).val();
                    commit(rule.test(value), messages[name]);
                };
                break;
            case 'function':
                rules[name] = function(opts, commit) {
                    commit(rule(opts), messages[name]);
                };
                break;
            default:
                throw 'Second arg must be a regexp or a function.';

        }
    }

    function addAsyncRule (name, rule) {
        if (rules[name]) {
            throw 'addRule(): The rule with the same name has existed and cannot be overridden!';
        }

        rules[name] = rule;
    }

    function addCombinedRule(name, combination) {
        if (rules[name]) {
            throw 'addRule(): The rule with the same name has existed and cannot be overridden!';
        }
    }

    function addMessage(name, msg) {
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
        addRule(name, rule);
    });

    addRule('required', function(options) {
        var element = $(options.element);
        
        var t = element.attr('type');
        switch (t) {
            case 'checkbox':
            case 'radio':
                var checked = false;
                element.each(function(i, item) {
                    if ($(item).attr('checked')) {
                        checked = true;
                        return false;
                    }
                });
                return checked;
            default:
                return Boolean(element.val());
        }
    });

    addMessage('required', '必填');

    addRule('lengthBetween', function(options) {
        options.min = 1;
        options.max = 3
        var element = $(options.element);
        var l = element.val().length;
        return l >= options.min && l <= options.max;
    });

    addMessage('lengthBetween', '长度不对');

    module.exports = {
        addRule: addRule,
        addAsyncRule: addAsyncRule,
        addMessage: addMessage,
        getRule: getRule
    };

});
