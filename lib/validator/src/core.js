define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        Base = require('base'),
        parser = require('./parser');

    var ruleFactory = null;

    var Validator = Base.extend({
        options: {
            triggerType: ['blur'],
            checkOnSubmit: true
        },

        initialize: function(id, options) {
            if (!id) {
                throw 'The form to be validated must be specified.';
            } else if ($.type(id) == 'string') {
                this.element = $('#' + id);
            } else {
                this.element = $(id);
            }

            if (this.element.prop('tagName') != 'FORM') {
                throw 'The form specified cannot be found.';
            }

            this.setOptions(options);

            this.items = {};

            if(this.options.checkOnSubmit) {
                this.element.submit(function(e) {
                    e.preventDefault();
                    console.log('submit');
                });
            }
        },

        Statics: {
            registerRules: function(rules) {
                ruleFactory = rules;
            }
        },

        configItem: function(name, cfg) {
            var item = new Item(name, $.extend(null, {triggerType: this.options.triggerType}, cfg));
            this.items[name] = item;
        }
    });

    var Item = Base.extend({
        options: {
            //name: null,
            //rules: null,
            //display: null,
            //triggerType: null,
            //after
        },

        initialize: function(name, cfg) {
            var ele = $('[name=' + name +']');
            if (ele.length == 1) {
                ele = ele[0];
            } else if (ele.length == 0) {
                throw 'Element with name "' + name + '" is not found.' ;
            } else {
                ele = ele.get();
            }

            this.element = ele;
            this.setOptions(cfg);

            var triggerType = this.options.triggerType;

            if (triggerType) {
                var that = this;
                var handler = function() {
                    that.execute();
                }
                $(ele).bind(triggerType.join(' '), handler);
            }
        },

        execute: function() {
            _metaValidate(this.element, this.options);
        }
    });


    function _metaValidate(ele, cfg) {
        var rules = cfg.rules;
        if (!$.isArray(rules))
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

    function validateForm() {
    }

    Validator.registerRules(require('./ruleFactory'));

    //exports.registerRules = registerRules;
    //exports.configItem = configItem;

    module.exports = Validator;
});
