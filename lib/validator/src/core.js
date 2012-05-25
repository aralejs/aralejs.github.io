define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        Base = require('base'),
        parser = require('./parser'),
        Item = require('./item');

    var validators = [];

    var Validator = Base.extend({
        options: {
            triggerType: ['blur'],
            checkOnSubmit: true,
            stopOnError: false,     //校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true        //When all validation passed, submit the form automatically.
        },

        initialize: function(form, options) {
            this.element = $(form);

            if (this.element.length != 1 || this.element.prop('tagName') != 'FORM') {
                throw 'One and only one form must be specified.';
            }

            //disable html5 form validation
            this.element.attr('novalidate', 'novalidate');

            this.setOptions(options);

            if ($.type(this.options.triggerType) == 'string') {
                this.setOptions({triggerType: [this.options.triggerType]});
            }

            this.items = [];

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

        Statics: $.extend(null, require('./rule'), {
            parsePage: function() {
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
            var item = new Item(selector, $.extend(null, {triggerType: this.options.triggerType}, cfg));
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

            if (this.options.stopOnError) {
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

    Validator.parsePage();
    module.exports = Validator;
});
