define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        Base = require('base'),
        parser = require('./parser');

    var Validator = Base.extend({
        options: {
            triggerType: ['blur'],
            checkOnSubmit: true,
            stopOnError: false,     //校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true        //When all validation passed, submit the form automatically.
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

            var that = this;
            if(this.options.checkOnSubmit) {
                this.element.submit(function(e) {
                    e.preventDefault();
                    that.execute(function(err) {
                        if (!err) {
                            that.options.autoSubmit && that.element.get(0).submit();
                        }
                    });
                });
            }
        },

        //Statics: require('./ruleFactory'),

        addItem: function(name, cfg) {
            var item = new Item(name, $.extend(null, {triggerType: this.options.triggerType}, cfg));
            this.items[name] = item;

            item.on('all', function(eventName) {
                this.trigger.apply(this, [].slice.call(arguments, 0));
            }, this);
        },

        removeItem: function(name) {
            var item = this.items[name];
            item && item.remove();
            delete this.items[name];
        },

        execute: function(callback) {
            var that = this;

            this.trigger('formValidate');

            if (this.options.stopOnError) {
                var tasks = {};
                $.each(this.items, function(name, item) {
                    tasks[name] = function(cb) {
                        item.execute(cb);
                    };
                });
                async.parallel(tasks, function(err) {
                    that.trigger('formValidated', Boolean(err));
                    callback && callback(Boolean(err));
                });
            } else {
                var items = [];
                $.each(this.items, function(name, item) {
                    items.push(item);
                });
                async.forEach(items, function(item, cb) {
                    item.execute(cb);
                }, function(err) {
                    that.trigger('formValidated', Boolean(err));
                    callback && callback(Boolean(err));
                });
            }
        }
    });

    $.extend(Validator, require('./ruleFactory'));

    var Item = Base.extend({
        options: {
            //name: null,
            //rules: null,
            //display: null,
            //triggerType: null,
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
                this.handler = function() {
                    that.execute();
                }
                $(ele).bind(triggerType.join(' '), this.handler);
            }
        },

        execute: function(callback) {
            var opt = this.options;

            var that = this;
            this.trigger('itemValidate', that.element);
            _metaValidate(this.element, opt.rules, opt.display, function(err, msg) {
                that.trigger('itemValidated', err, msg, that.element);
                callback && callback(err, msg, that.element);
            });
        },

        remove: function() {
            var handler = this.handler,
                ele = $(this.element);

            $.each(this.options.triggerType, function(i, item) {
                ele.unbind(item, handler);
            });
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

            var rule = Validator.getOperator(ruleName);
            if (!rule)
                throw 'Validation rule with name "' + ruleName + '" cannot be found.';

            var options = $.extend({}, param, {
                element: ele,
                display: (param && param.display) || display || $(ele).attr('name'),
                ruleName: ruleName
            });

            tasks.push(function(cb) {
                rule(options, cb);
            });
        });

        async.series(tasks, function(err, results) {
            callback && callback(err, results[results.length - 1]);
        });
    }


    module.exports = Validator;
});
