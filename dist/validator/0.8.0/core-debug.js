define("#validator/0.8.0/core-debug", ["$","./async","widget","./parser","./item","daparser","./rule"], function(require, exports, module) {

    var $ = require('$'),
        async = require('./async'),
        Widget = require('widget'),
        parser = require('./parser'),
        Item = require('./item'),
        DAParser = require('daparser');

    var validators = [];

    var helpers = {};

    var Validator = Widget.extend({
        attrs: {
            triggerType: 'blur',
            checkOnSubmit: true,    //是否在表单提交前进行校验，默认进行校验。
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

            validators.push(this);
        },

        Statics: $.extend({}, require('./rule'), {
            autoRender: function(cfg) {
                var attrs = processAttr(cfg);
                findHelpers(attrs, ['onItemValidate', 'onItemValidated', 'onFormValidate', 'onFormValidated']);

                var validator = new Validator(attrs);

                $('input, textarea, select', validator.element).each(function(i, input) {

                    if (!validator.query(input)) {
                        input = $(input);

                        var options = {};

                        var type = input.attr('type');
                        if (type == 'radio' || type == 'checkbox') {
                            options.element = $('[type=' + type + '][name=' + input.attr('name') + ']', validator.element);
                        } else {
                            options.element = input;
                        }

                        var obj = parser.parseDom(input);
                        var attrs = processAttr(DAParser.parseElement(input));
                        $.extend(options, attrs, obj);

                        findHelpers(options, ['onItemValidate', 'onItemValidated']);
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

            helper: function(name, fn) {
                if (fn) {
                    helpers[name] = fn;
                    return this;
                }

                return helpers[name];
            }
        }),


        addItem: function(cfg) {
            var item = new Item($.extend({triggerType: this.get('triggerType'), checkNull: this.get('checkNull')}, cfg));
            this.items.push(item);

            item.set('_handler', function() {
                if (!item.get('required') && !item.element.val()) return;
                if (!item.get('checkNull') && !item.element.val()) return;
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

            this.trigger('formValidate');

            var complete = function(err) {
                that.trigger('formValidated', Boolean(err));
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

            Validator.superclass.destroy.call(this);
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

    function processAttr(obj) {

        $.each(obj, function(i, v) {
            if (v == 'true')
                obj[i] = true;
            else if (v == 'false')
                obj[i] = false;
        });

        return obj;
    }

    function findHelpers(obj, keys) {
        $.each(keys, function(i, key) {
            obj[key] = Validator.helper(obj[key]);
        });
    }

    module.exports = Validator;
});
