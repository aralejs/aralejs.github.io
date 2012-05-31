define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        Widget = require('widget'),
        parser = require('./parser'),
        Item = require('./item');

    var validators = [];

    var Validator = Widget.extend({
        attrs: {
            triggerType: {
                value: ['blur'],
                setter: function(value) {
                    return $.type(value) == 'string' ? [value] : value;
                }
            },
            checkOnSubmit: true,
            stopOnError: false,     //校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true        //When all validation passed, submit the form automatically.
        },

        setup: function() {
            //disable html5 form validation
            this.element.attr('novalidate', 'novalidate');

            //this.initAttrs(config);

            this.items = [];

            var that = this;

            if(this.get('checkOnSubmit')) {
                this.element.submit(function(e) {
                    e.preventDefault();
                    that.execute(function(err) {
                        if (!err) {
                            that.get('autoSubmit') && that.element.get(0).submit();
                        }
                    });
                });
            }
        },

        Statics: $.extend(null, require('./rule'), {
            autoRun: function() {
                var forms = $('form[data-enable-validate=true]');
                forms.each(function(i, form) {
                    var validator = new Validator(form);
                    validators.push(validator);
                    $(':input', form).each(function(i, input) {
                        if (!validator.getItem(input)) {
                            var rules = parser.parseDom(input);
                            if (rules) {
                                validator.addItem(input, {rule: rules.join(' ')});
                            }
                        }
                    });
                });
            },

            getForm: function(selector) {
                var target = $(selector);
                var validator = null;
                $.each(validators, function(i, v) {
                    if (target.is(v.element)) {
                        validator = v;
                        return false;
                    }
                });
                return validator;
            }
        }),

        addItem: function(selector, cfg) {
            var item = new Item(selector, $.extend(null, {triggerType: this.get('triggerType')}, cfg));
            this.items.push(item);

            item.on('all', function(eventName) {
                this.trigger.apply(this, [].slice.call(arguments, 0));
            }, this);

            return this;
        },

        removeItem: function(selector) {
            var target = $(selector),
                items = this.items;

            var j;
            $.each(this.items, function(i, item) {
                if (target.is(item.element)) {
                    j = i;
                    item.remove();
                    return false;
                }
            });
            j !== undefined && this.items.splice(j, 1);

            return this;
        },

        execute: function(callback) {
            var that = this;

            this.trigger('formValidate');

            if (this.get('stopOnError')) {
                var tasks = {};
                $.each(this.items, function(i, item) {
                    tasks[i] = function(cb) {
                        item.execute(cb);
                    };
                });
                async.parallel(tasks, function(err) {
                    that.trigger('formValidated', Boolean(err));
                    callback && callback(Boolean(err));
                });
            } else {
                async.forEach(this.items, function(item, cb) {
                    item.execute(cb);
                }, function(err) {
                    that.trigger('formValidated', Boolean(err));
                    callback && callback(Boolean(err));
                });
            }

            return this;
        },

        destroy: function() {
            this.element.unbind('submit');
            //TODO unbind items
        },

        getItem: function(selector) {
            var target = $(selector);
            if (target.length == 0) {
                return null;
            } else {
                var result = null;
                $.each(this.items, function(i, item) {
                    if (target.is(item.element)) {
                        result = item;
                        return false;
                    }
                });
                return result;
            }
        }
    });

    module.exports = Validator;
});
