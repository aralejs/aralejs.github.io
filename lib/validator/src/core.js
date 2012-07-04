define(function(require, exports, module) {

    var $ = require('$'),
        async = require('./async'),
        Widget = require('widget'),
        utils = require('./utils'),
        Item = require('./item');

    var validators = [];

    var setterConfig = {
        value: function() {},
        setter: function(val) {
            return typeof val != 'function' ? utils.helper(val) : val;
        }
    };

    var Core = Widget.extend({

        attrs: {
            triggerType: 'blur',
            checkOnSubmit: true,    //是否在表单提交前进行校验，默认进行校验。
            stopOnError: false,     //校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true,       //When all validation passed, submit the form automatically.
            checkNull: true,         //除提交前的校验外，input的值为空时是否校验。
            onItemValidate: setterConfig,
            onItemValidated: setterConfig,
            onFormValidate: setterConfig,
            onFormValidated: setterConfig,
            showMessage: setterConfig, // specify how to display error messages
            hideMessage: setterConfig // specify how to hide error messages
        },

        setup: function() {

            //disable html5 form validation
            this.element.attr('novalidate', 'novalidate');

            //Validation will be executed according to configurations stored in items.
            this.items = [];

            var that = this;

            //If checkOnSubmit is true, then bind submit event to execute validation.
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

            this.on('formValidate', function() {
                var that = this;
                $.each(this.items, function(i, item) {
                    that.query(item.element).get('hideMessage').call(that, null, item.element);
                });
            });

            this.on('itemValidated', function(err, message, element) {
                if (err)
                    this.query(element).get('showMessage').call(this, message, element);
                else
                    this.query(element).get('hideMessage').call(this, message, element);
            });

            validators.push(this);
        },

        Statics: $.extend({helper: utils.helper}, require('./rule'), {
            autoRender: function(cfg) {

                var validator = new this(cfg);

                $('input, textarea, select', validator.element).each(function(i, input) {

                    input = $(input);
                    var type = input.attr('type');

                    if (type == 'button' || type == 'submit' || type == 'reset') {
                        return true;
                    }

                    var options = {};

                    if (type == 'radio' || type == 'checkbox') {
                        options.element = $('[type=' + type + '][name=' + input.attr('name') + ']', validator.element);
                    } else {
                        options.element = input;
                    }


                    if (!validator.query(options.element)) {

                        var obj = utils.parseDom(input);

			if (!obj.rule) return true;

                        $.extend(options, obj);

                        validator.addItem(options);
                    }
                });
            },

            query: function(selector) {
                var target = $(selector);
                var result = null;

                $.each(validators, function(i, validator) {
                    if (target.get(0) == validator.element.get(0)) {
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

            validate: function(options) {
                var element = $(options.element);
                var validator = new Core({
                    element: element.parents('form')
                });

                validator.addItem(options);
                validator.query(element).execute();
                validator.destroy();
            }
        }),


        addItem: function(cfg) {

            var item = new Item($.extend({
                triggerType: this.get('triggerType'),
                checkNull: this.get('checkNull'),
                showMessage: this.get('showMessage'),
                hideMessage: this.get('hideMessage')
            }, cfg));

            this.items.push(item);

            item.set('_handler', function() {
                if (!item.get('checkNull') && !item.element.val()) return;
                item.execute();
            });
            this.element.on(item.get('triggerType'), '[' + DATA_ATTR_NAME + '=' + stampItem(item) + ']', item.get('_handler'));

            item.on('all', function(eventName) {
                this.trigger.apply(this, [].slice.call(arguments));
            }, this);

            return this;
        },

        removeItem: function(selector) {
            var target = selector instanceof Item ? selector.element : $(selector),
                items = this.items,
                that = this;

            var j;
            $.each(this.items, function(i, item) {
                if (target.get(0) == item.element.get(0)) {
                    j = i;
                    that.element.off(item.get('triggerType'), '[' + DATA_ATTR_NAME + '=' + stampItem(item) + ']', item.get('_handler'));
                    item.destroy();
                    return false;
                }
            });
            j !== undefined && this.items.splice(j, 1);

            return this;
        },

        execute: function(callback) {
            var that = this;

            this.trigger('formValidate', this.element);

            var complete = function(err) {
                that.trigger('formValidated', that.element, Boolean(err));
                callback && callback(Boolean(err));
            };

            if (this.get('stopOnError')) {
                var tasks = {};
                $.each(this.items, function(i, item) {
                    tasks[i] = function(cb) {
                        item.execute(cb);
                    };
                });
                async.series(tasks, complete);
            } else {
                async.forEach(this.items, function(item, cb) {
                    item.execute(cb);
                }, complete);
            }

            return this;
        },

        destroy: function() {
            this.element.unbind('submit');
            var that = this;
            $.each(this.items, function(i, item) {
                that.removeItem(item);
            });
            var j;
            $.each(validators, function(i, validator) {
                if (validator == this) {
                    j = i;
                    return false;
                }
            });
            validators.splice(j, 1);

            Core.superclass.destroy.call(this);
        },

        query: function(selector) {
            var target = $(selector);
            if (target.length == 0 || $(target, this.element).length == 0) {
                return null;
            } else {
                var result = null;
                $.each(this.items, function(i, item) {
                    if (target.get(0) == item.element.get(0)) {
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

    module.exports = Core;
});
