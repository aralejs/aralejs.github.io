define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        parser = require('./parser');

    var ruleFactory = null;

    function registerRules(rules) {
        ruleFactory = rules;
        //console.log('registerRules');
    }

    function _metaValidate(ele, cfg) {
        var rules = cfg.rules;
        if (!$.isArray(cfg.rules))
            throw 'No validation rule specified or not specified as an array.'
        
        var tasks = [];

        $.each(rules, function(i, item) {

            var obj = parser.parseRule(item),
                ruleName = obj.name,
                param = obj.param;

            var rule = ruleFactory.getRule(ruleName);
            if (!rule)
                throw 'Validation rule with name "' + ruleName + '" cannot be found.';

            var options = $.extend({}, param, {element: ele});

            tasks.push(function (callback) {
                rule(options, function(b, msg) {
                    callback(b ? null : ruleName, msg);
                });
            });
        });

        async.series(tasks, function(error, results) {
            console.log(error, results);
        });
    }

    function validateItem(name, cfg) {
        var ele = $('[name=' + name +']');
        if (ele.length == 1) {
            ele = ele[0];
        } else if (ele.length == 0) {
            throw 'Element with name "' + name + '" is not found.' ;
        }

        _metaValidate(ele, cfg);
    }

    function validateForm() {
    }

    registerRules(require('./ruleFactory'));

    exports.registerRules = registerRules;
    exports.validateItem = validateItem;
});
