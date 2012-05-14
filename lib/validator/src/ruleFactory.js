define(function(require, exports, module) {
    var rules = {},
        messages = {},
		$ = require('jquery'),
        handlebars = require('handlebars');

    function addRule(name, rule) {
        if (rules[name]) {
            throw 'The rule with the same name has existed and cannot be overridden!';
        }

        switch($.type(rule)) {
            case 'regexp':
                rules[name] = function(opts, commit) {
                    var result = rule.test($(opts.element).val());
                    commit(result, _getMsg(name, opts, result));
                };
                break;
            case 'function':
                rules[name] = function(opts, commit) {
                    var result = rule(opts);
                    commit(result, _getMsg(name, opts, result));
                    //commit(result, messages[name][result ? 'success' : 'failure']);
                };
                break;
            default:
                throw 'Second arg must be a regexp or a function.';

        }
    }

    function _getMsg(ruleName, opts, b) {
        var msgtpl;

        if (opts.message) { // user specifies a message
            if ($.isPlainObject(opts.message)) {
                msgtpl = opts.message[b ? 'success' : 'failure'];
            } else {//just string
                msgtpl = b ? '' : opts.message
            }
        } else { // use default
            msgtpl = messages[ruleName][b ? 'success' : 'failure'];
        }

        return msgtpl ? handlebars.compile(msgtpl)(opts) : msgtpl;
    }

    function addAsyncRule (name, rule) {
        if (rules[name]) {
            throw 'The rule with the same name has existed and cannot be overridden!';
        }

        rules[name] = rule;
    }

    function addCombinedRule(name, combination) {
        if (rules[name]) {
            throw 'The rule with the same name has existed and cannot be overridden!';
        }
    }

    function addMessage(name, msg) {
        if ($.isPlainObject(msg)) {
            messages[name] = msg;
        } else {
            messages[name] = {
                failure: msg
            };
        }
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

    //options.mix and options.max must be specified
    addRule('lengthBetween', function(options) {
        var element = $(options.element);
        var l = element.val().length;
        return l >= options.min && l <= options.max;
    });

    addMessage('required', '{{display}}不能为空');
    addMessage('lengthBetween', '{{display}}长度必须在{{min}}和{{max}}之间');

    module.exports = {
        addRule: addRule,
        addAsyncRule: addAsyncRule,
        addMessage: addMessage,
        getRule: getRule
    };

});
