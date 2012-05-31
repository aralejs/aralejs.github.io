define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        Widget = require('widget'),
        parser = require('./parser'),
        Item = require('./item');

    var validators = [];

    var Validator = Widget.extend({
        attrs: {
            triggerType: 'blur',
            checkOnSubmit: true,
            stopOnError: false,     //校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true,       //When all validation passed, submit the form automatically.
            checkNull: true         //除提交前的校验外，input的值为空时是否校验。
        },

        initialize: function(form) {
            console.log(222, Validator);
            if ($.type(form) === 'string') {
                console.log(111);
                return Validator.getForm(form);
            } else {
                console.log(333333333);
                Validator.superclass.initialize.apply(this, [].slice.call(arguments));
            }
        },

        setup: function() {
            //disable html5 form validation
            this.element.attr('novalidate', 'novalidate');

            //Validation will be executed according to configurations stored in items.
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
                    var validator = new Validator({element: form});
                    validators.push(validator);
                    $(':input', form).each(function(i, input) {
                        if (!validator.getItem(input)) {
                            var rules = parser.parseDom(input);
                            if (rules) {
                                validator.addItem({
                                    element: input,
                                    rule: rules.join(' ')
                                });
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


        addItem: function(cfg) {
            var item = new Item($.extend({triggerType: this.get('triggerType')}, cfg));
            this.items.push(item);

            item.set('_handler', function() {
                item.execute();
            });
            this.element.on(item.get('triggerType'), '[' + DATA_ATTR_NAME + '=' + stampItem(item) + ']', item.get('_handler'));

            item.on('all', function(eventName) {
                this.trigger.apply(this, [].slice.call(arguments, 0));
            }, this);

            return this;
        },

        removeItem: function(selector) {
            var target = selector instanceof Item ? selector.element : $(selector),
                items = this.items,
                that = this;

            var j;
            $.each(this.items, function(i, item) {
                if (target.is(item.element)) {
                    j = i;
                    that.element.off(item.get('triggerType'), '[' + DATA_ATTR_NAME + '=' + stampItem(item) + ']', item.get('_handler'));
                    item.destroy();
                    return false;
                }
            });
            j !== undefined && this.items.splice(j, 0);

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
            var that = this;
            $.each(this.items, function(i, item) {
                that.removeItem(item);
            });

            Validator.superclass.destroy.call(this);
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

    var DATA_ATTR_NAME = 'data-validator-set';
    function stampItem(item) {
        var set = item.element.attr(DATA_ATTR_NAME);
        if (!set) {
            set = item.cid;
            item.element.attr(DATA_ATTR_NAME, set);
        }
        return set;
    }

    module.exports = Validator;
});
