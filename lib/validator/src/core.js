define(function(require, exports, module) {

    var $ = require('jquery'),
        async = require('async'),
        Widget = require('widget'),
        parser = require('./parser'),
        Item = require('./item');

    var validators = [];

    var helpers = {};

    var Validator = Widget.extend({
        attrs: {
            triggerType: 'blur',
            checkOnSubmit: true,
            stopOnError: false,     //校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true,       //When all validation passed, submit the form automatically.
            checkNull: true         //除提交前的校验外，input的值为空时是否校验。
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

        Statics: $.extend({}, require('./rule'), {
            autoRun: function() {
                var forms = $('form[data-enable-validate=true]');

                forms.each(function(i, form) {

                    var validator = new Validator({element: form});
                    validators.push(validator);

                    $(':input', form).each(function(i, input) {

                        if (!validator.query(input)) {
                            input = $(input);

                            var options = {};

                            var type = input.attr('type');
                            if (type == 'radio' || type == 'checkbox') {
                                options.element = $(':' + input.attr('type') + '[name=' + input.attr('name') + ']', validator.element);
                            } else {
                                options.element = input;
                            }

                            var obj = parser.parseDom(input);
                            var attrs = getAttrsFromDataset(validator.dataset, input);
                            $.extend(options, attrs, obj);

                            options.onItemValidate = Validator.helper(obj.onItemValidate);
                            options.onItemValidated = Validator.helper(obj.onItemValidated);
                            validator.addItem(options);
                        }
                    });
                });
            },

            query: function(selector) {
                var target = $(selector);
                var result = null;

                $.each(validators, function(i, validator) {
                    if (target.is(validator.element)) {
                        result = validator;
                        return false;
                    } else {
                        var item = validator.query(target);
                        if (item) {
                            result = item;
                            return false;
                        }
                    }
                });

                return result;
            },

            helper: function(name, fn) {
                if (fn) {
                    helpers[name] = fn;
                    return this;
                }

                return helpers[name];
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

        query: function(selector) {
            var target = $(selector);
            if (target.length == 0 || !this.element.find(target)) {
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

    function getAttrsFromDataset(dataset, input) {
        var result = {};

        $.each(dataset, function(key, obj) {
            $.each(obj, function(msg, selector) {
                if (input.is($(selector))) {
                    result[key] = msg;
                    return false;
                }
            });
        });

        return result;
    }

    module.exports = Validator;
});
