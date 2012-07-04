define(function(require, exports, module) {
    var $ = require('$'),
        utils = require('./utils'),
        Widget = require('widget'),
        async = require('./async'),
        Rule = require('./rule');

    var setterConfig = {
        value: function() {},
        setter: function(val) {
            return typeof val != 'function' ? utils.helper(val) : val;
        }
    };
    var Item = Widget.extend({
        attrs: {
            rule: '',
            display: null,
            triggerType: {
                setter: function(val) {
                    var element = $(this.get('element')),
                        type = element.attr('type');
                    
                    var b = element.get(0).tagName.toLowerCase().indexOf('select') > -1 || type == 'radio' || type == 'checkbox';
                    if (b && (val.indexOf('blur') > -1 || val.indexOf('key') > -1))
                        return 'change';
                    return val;
                }
            },
            required: false,
            checkNull: true,
            errormessage: null,
            onItemValidate: setterConfig,
            onItemValidated: setterConfig,
            showMessage: setterConfig,
            hideMessage: setterConfig
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

            if (!rules) {
                callback && callback(null, '', this.element);
                return this;
            }

            _metaValidate(this.element, this.get('required'), rules, this.get('display'), function(err, msg) {
                if (err) {
                    var message = that.get('errormessage') || that.get('errormessage' + upperFirstLetter(err)) || msg;
                } else {
                    var message = msg;
                }
                that.trigger('itemValidated', err, message, that.element);
                callback && callback(err, message, that.element);
            });

            return this;
        }
    });

    function upperFirstLetter(str) {
        str = String(str);
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function _metaValidate(ele, required, rules, display, callback) {

        if (!required) {
            var truly = false;
            var t = ele.attr('type');
            switch (t) {
                case 'checkbox':
                case 'radio':
                    var checked = false;
                    ele.each(function(i, item) {
                        if ($(item).prop('checked')) {
                            checked = true;
                            return false;
                        }
                    });
                    truly = checked;
                    break;
                default:
                    truly = Boolean(ele.val());
            }

            if (!truly) {
                callback && callback(null, null);
                return;
            }
        }

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
