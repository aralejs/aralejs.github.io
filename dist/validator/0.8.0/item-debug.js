define("#validator/0.8.0/item-debug", ["$","./utils","widget","./async","./rule"], function(require, exports, module) {
    var $ = require('$'),
        utils = require('./utils'),
        Widget = require('widget'),
        async = require('./async'),
        Rule = require('./rule');

    var setterConfig = {
        setter: function(val) {
            return typeof val != 'function' ? utils.helper(val) : val;
        }
    };
    var Item = Widget.extend({
        attrs: {
            rule: '',
            display: null,
            triggerType: null,
            required: false,
            checkNull: true,
            onItemValidate: setterConfig,
            onItemValidated: setterConfig
        },

        setup: function() {
            if (this.get('required')) {
                if (!this.get('rule') || this.get('rule').indexOf('required') < 0) {
                    this.set('rule', 'required ' + this.get('rule'));
                }
            }
        },

        execute: function(callback) {

            this.trigger('itemValidate', this.element);

            var rules = utils.parseRules(this.get('rule')),
                that = this;

            if (!rules) return this;

            _metaValidate(this.element, rules, this.get('display'), function(err, msg) {
                if (err) {
                    var message = that.get('errormessage') || that.get('errormessage' + upperFirstLetter(err)) || msg;
                } else {
                    var message = msg;
                }
                that.trigger('itemValidated', err, message, that.element);
                callback && callback(err, message, that.element);
            });

            function upperFirstLetter(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }

            return this;
        }
    });


    function _metaValidate(ele, rules, display, callback) {

        if (!$.isArray(rules))
            throw new Error('No validation rule specified or not specified as an array.');
        
        var tasks = [];

        $.each(rules, function(i, item) {

            var obj = utils.parseRule(item),
                ruleName = obj.name,
                param = obj.param;

            var rule = Rule.getOperator(ruleName);
            if (!rule)
                throw new Error('Validation rule with name "' + ruleName + '" cannot be found.');

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
