define(function(require, exports, module) {
    var $ = require('jquery'),
        parser = require('./parser'),
        Widget = require('widget'),
        async = require('async'),
        Rule = require('./rule');

    var Item = Widget.extend({
        attrs: {
            rule: null,
            display: null,
            triggerType: null
        },

        setup: function() {
        },

        execute: function(callback) {
            this.trigger('itemValidate', this.element);

            var rules = parser.parseRules(this.get('rule')),
                that = this;

            if (!rules) return this;

            _metaValidate(this.element, rules, this.get('display'), function(err, msg) {
                that.trigger('itemValidated', err, msg, that.element);
                callback && callback(err, msg, that.element);
            });

            return this;
        }
    });


    function _metaValidate(ele, rules, display, callback) {

        if (!$.isArray(rules))
            throw 'No validation rule specified or not specified as an array.'
        
        var tasks = [];

        $.each(rules, function(i, item) {

            var obj = parser.parseRule(item),
                ruleName = obj.name,
                param = obj.param;

            var rule = Rule.getOperator(ruleName);
            if (!rule)
                throw 'Validation rule with name "' + ruleName + '" cannot be found.';

            var options = $.extend({}, param, {
                element: ele,
                display: (param && param.display) || display || $(ele).attr('name'),
                rule: ruleName
            });

            tasks.push(function(cb) {
                rule(options, cb);
            });
        });

        async.series(tasks, function(err, results) {
            callback && callback(err, results[results.length - 1]);
        });
    }

    module.exports = Item;
});
