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

            //disable html5 form validation
            this.element.attr('novalidate', 'novalidate');

            this.setOptions(options);

            if ($.type(this.options.triggerType) == 'string') {
                this.setOptions({triggerType: [this.options.triggerType]});
            }

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

        Statics: $.extend(null, require('./rule'), {
            parsePage: function() {
                var forms = $('form[data-enable-validate=true]');
                forms.each(function(i, form) {
                    var validator = new Validator(form);
                    validators.push(validator);
                    $(':input', form).each(function(i, input) {
                        var name = $(input).attr('name');
                        if (!validator.items[name]) {
                            var rules = parser.parseDom(input);
                            console.log(name, 'rules', rules);
                            if (rules) {
                                if (name) {
                                    validator.addItem(name, {rule: rules});
                                } else {
                                    throw 'A filed to be validated must have name attribute to work with validator.';
                                }
                            }
                        }
                    });
                });
            },

            getForm: function(selector) {
                var target = $(selector).get(0);

                if (!target)
                    throw 'No form found with selector "' + selector + '"';

                var validator = null;
                $.each(validators, function(i, item) {
                    if (item.element.get(0) == target) {
                        validator = item;
                        return false;
                    }
                });
                return validator;
            }
        }),

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
        },

        destroy: function() {
            this.element.unbind('submit');
        },

        getItem: function(name) {
            if (!name) return null;

            return this.items[name];
        }
    });


    module.exports = Validator;
});
