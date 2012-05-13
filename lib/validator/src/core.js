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

            var options = $.extend({}, param, {
                element: ele,
                display: (param && param.display) || (cfg && cfg.display) || $(ele).attr('name')
            });
            //console.log('options', options);

            tasks.push(function (callback) {
                rule(options, function(b, msg) {
                    callback(b ? null : ruleName, msg);
                });
            });
        });

        async.series(tasks, function(error, results) {
            //console.log(error, results);
            cfg.after && cfg.after(!error, results[results.length - 1]);
        });
    }

    function configItem(name, cfg) {
        var ele = $('[name=' + name +']');
        if (ele.length == 1) {
            ele = ele[0];
        } else if (ele.length == 0) {
            throw 'Element with name "' + name + '" is not found.' ;
        } else {
            ele = ele.get();
        }

        if (cfg.triggerType) {
            var handler = function() {
                _metaValidate(ele, cfg);
            }
            $(ele).bind(cfg.triggerType.join(' '), handler);
        }
    }

    function validateForm() {
    }

    registerRules(require('./ruleFactory'));

    exports.registerRules = registerRules;
    exports.configItem = configItem;
});
