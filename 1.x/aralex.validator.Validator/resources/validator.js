/**
 * @name aralex.validator.Validator
 * @class
 * Validator是表单校验组件，内置了常用的多种校验规则（email, cnphone, number, maxlength等)，并且支持自定义校验规则，解决个性化校验需求。支持多种校验触发方式(blur,keyup,keyup等)，并且全局配置与局部配置结合可以满足单个表单触发方式的个性化定制。<br/>
 * 我们还为您提供了更加方便使用的ClassicValidator，它封装了更多的提示行为。
 * @author <a href="mailto:shuai.shao@alipay.com">邵帅</a>
 * @extends aralex.Widget
 * @param {Object} cfg 配置.
 * @return {aralex.validator.Validator} validator组件对象.
 * @example
 var validator = new aralex.validator.Validator({
         formId: "the-form-id",
         triggerMethod: ["keyup", "blur"],
         rules:{
             "input[name='name']": {
                 type: ["alpha", ["lengthBetween", 2, 8]],
                 desc: "姓名",
                 required: true
             }
         },
         beforeValidate: function(){},
         afterValidate: function($ele, bValid, msg) {},
         afterValidateAll: function(bValid){},
         onSuccess: function() {},
         beforeSubmit: function() {}
     });
 */
var aralexBase = require('aralex.base');
module.exports = arale.declare('aralex.validator.Validator', [aralexBase.Widget], {
        /** @lends aralex.validator.Validator.prototype */

        /**
         * 规则工厂
         * @ignore
         */
        ruleFactory: exports.ruleFactory,

        /**
         * 错误信息工厂
         * @ignore
         */
        msgFactory: exports.MsgFactory,

        /**
         * 需要验证的表单的id, 也可以只写id，保留formId时为了尊重上一版的习惯
         * @type {string}
         */
        formId: '',

        /**
         * 触发校验表单项的事件，可以是一个数组，也可以是一个字符串，支持"click", "blur", "keyup"等<br/>
         * 分为全局配置和局部配置，如果存在局部配置，局部配置会覆盖全局配置，以支持更加灵活的可定制性
         * @type {string | Array}
         * @default "blur"
         */
        triggerMethod: ['blur'],

        /**
         * 是否在submit前校验，默认校验
         * @type Boolean
         * @default true
         */
        checkOnSubmit: true,


        /**
         * 全部校验通过后是否阻止提交
         * @type Boolean
         * @default false
         */
        stopSubmit: false,

        /**
         * 校验成功后触发
         * @type Function
         * @default null
         */
        onSuccess: null,

        /**
         * 校验失败后触发
         * @type Function
         * @default null
         */
        onFail: null,

        /**
         * 配置当blur为校验触发事件时，校验项为空时是否校验
         * @type Boolean
         * @default false
         */
        checkNull: false,


        /**
         * 表单项校验规则配置
         * @type Object
         * @default null
         * @example
         * rules:{
             *      "input[name='name']": {
                 *      type: ["alpha", ["lengthBetween", 2, 8]],
                 *       desc: "姓名",
                 *      required: true
                 * },
             * "input[name='mobile']": {
                 *      type: ["cnMobile"],
                 *      desc: "手机号"
                 *      required: true,
                 *      skipHidden: true //当隐藏时不校验，默认是校验的
                 * },
             * "input[type='radio']": {
                 *      required: true
                 * }
             */
        rules: null,

        /**
         * @ignore
         */
        init: function() {
            this.rules = {};
        },

        /** @ignore **/
        beforeCreate: function() {
            this.id = this.formId;
        },

        /**
         * ajax请求验证有没有完成
         * @ignore
         */
        _ajaxComplete: true,

        /**
         * ajax验证是否正确与否
         * @ignore
         */
        _ajaxValid: true,

        /**
         * 在检验整个表单时，当出现错误时是否还继续校验
         */
        stopOnError: false,

        /**
         * 事件绑定
         * @ignore
         */
        bind: function() {
            //connect句柄
            this._handlers = [];
            //subscribe句柄
            this._shandlers = [];

            var that = this;
            //global Triggers 触发事件全局配置
            var gTriggers = arale.isString(this.triggerMethod) ? [this.triggerMethod] : this.triggerMethod,
                gCheckNull = this.checkNull;
            for (var item in this.rules) {
                var eles = $$(item, this.domNode);
                var cfg = this.rules[item];
                var triggers = cfg.triggerMethod ? cfg.triggerMethod : gTriggers;
                if (arale.isString(triggers)) {triggers = [triggers];}
                for (var i = 0, l = triggers.length; i < l; i++) {
                    if (eles[0] && (eles[0].attr('type') == 'radio' || eles[0].attr('type') == 'checkbox')) {break;}
                    $A(eles).each(function($ele) {
                            var effectiveCheckNull = (typeof cfg.checkNull == 'undefined') ? gCheckNull: cfg.checkNull;
                            var t = this;
                            //$ele[triggers[i]](function(e){
                            var h = $E.connect($ele, triggers[i], function(e) {
                                    if (e.type == 'blur' && !effectiveCheckNull && !$ele.attr('value')) {
                                        return;
                                    }
                                    var valid = that.validate($ele, t);
                                });
                            that._handlers[that._handlers.length] = h;
                        }, cfg);
                }
            }
            var handler = $E.connect(this.domNode, 'submit', function(e) {
                    e.preventDefault();
                    if (that.checkOnSubmit) {
                        var bValid = that.validateAll();

                        if (bValid && !that.stopSubmit) {
                            if (that._ajaxComplete) {
                                if (that._ajaxValid) {
                                    that.submit();
                                }
                            } else {
                                that._waittingSubmit = true;
                                //zhe'l这里设置2秒后如果ajax校验没有返回，则waitingSubmit重新为false。这是防止
                                //一种情况：当第一次提交时，只有ajax校验没有通过。然后修改ajax校验字段后，由于
                                //waitingSubmit没有重置为false，而意外自动提交。
                                setTimeout(function() {
                                        that._waittingSubmit = false;
                                    }, 2000);
                            }
                        }
                    } else {
                        if (!that.stopSubmit) {
                            that.submit();
                        }
                    }
                });
            this._handlers[this._handlers.length] = handler;

            var sh = $E.subscribe(this._getEventTopic('ajaxValidate', 'before'), function($ele) {
                    that._ajaxComplete = false;
                });
            this._shandlers[this._shandlers.length] = sh;
            sh = $E.subscribe(this._getEventTopic('ajaxValidate', 'after'), function($ele, valid) {
                    that._ajaxComplete = true;
                    that._ajaxValid = valid;
                    if (valid) {
                        if (that._waittingSubmit) {
                            that.submit();
                        }
                    }
                });
            this._shandlers[this._shandlers.length] = sh;
        },

        /**
         * 解除事件绑定
         */
        unbind: function() {
            $A(this._handlers).each(function(h) {$E.disConnect(h);});
            $A(this._shandlers).each(function(h) {$E.unsubscribe(h);});
        },


        /**
         * 直接提交表单
         */
        submit: function() {
            this.domNode.node.submit();
        },

        /**
         * 阻止表单提交
         * @type Function
         * returns void
         */
        stop: function() {
            this.stopSubmit = true;
        },

        /**
         * 验证所有表单项
         */
        validateAll: function() {
            $E.publish(this._getEventTopic('validateAll', 'before'));
            var that = this;
            var b = true;
            for (var item in this.rules) {
                var eles = $$(item);
                var cfg = this.rules[item];

                var bValid;

                //如果是radio类型，则只校验是否有被选中
                if (eles[0] && (eles[0].attr('type') == 'radio' || eles[0].attr('type') == 'checkbox')) {
                    bValid = this.valid_(eles[0], cfg);
                } else {
                    if(this.stopOnError) {
                        bValid = !$A(eles).some(function($ele, i) {
                            return !that.valid_($ele, cfg);
                        });
                    } else {
                        bValid = $A(eles).every(function($ele, i) {
                            return that.valid_($ele, cfg);
                        });
                    }
                }
                b = (b && bValid);
                if(this.stopOnError && !bValid) {break;}
            }
            $E.publish(this._getEventTopic('validateAll', 'after'), [b]);
            return b;
        },

        /**
         * @private
         */
        valid_: function($ele, cfg) {
            return (cfg.skipHidden && this.eleIsHidden_($ele)) || this.validate($ele, cfg);
        },

        /** @private */
        eleIsHidden_: function(_el) {
            if (!_el) return true;
            _el = _el.node || _el;
            return !_el.offsetHeight;
        },

        /**
         * @ignore
         */
        postCreate: function() {
            /**
             * 表单项校验事件
             * @name validate
             * @event
             * @memberOf aralex.validator.Validator
             * @param {HTMLElement} ele-before-1 被校验的表单项.
             * @param {Object} rulecfg-before-2 校验配置项.
             * @param {HTMLElement} ele-after-1 被校验的表单项.
             * @param {Boolean} valid-after-2 是否校验通过.
             * @param {String} msg-after-3 提示信息.
             */
            this.defaultFn('validate');

            this.defaultFn('ajaxValidate');

            /**
             * 表单(全部表单项)校验事件
             * @name validateAll
             * @event
             * @memberOf aralex.validator.Validator
             * @param {Boolean} valid-after-1 是否校验通过.
             */
            this.defaultFn('validateAll');

            /**
             * 表单提交事件
             * @name submit
             * @event
             * @memberOf aralex.validator.Validator
             */
            this.aroundFn('submit');

            this.after('validateAll', function(bValid) {
                    if (bValid) {
                        this.onSuccess && this.onSuccess(this.domNode.node);
                    } else {
                        this.onFail && this.onFail(this.domNode.node);
                    }
                });
        },

        /**
         * 校验执行器，可订阅
         * @param {Node | HTMLElement} $ele 要校验的表单元素.
         * @param {Object} rulecfg 校验配置.
         * @return {Boolean} 是否校验通过.
         */
        validate: function($ele, rulecfg) {
            $ele = $($ele);
            $E.publish(this._getEventTopic('validate', 'before'), [$ele.node, rulecfg]);
            var msg = '',
            valid = false,
            thatcfg,
            v = $ele.attr('value');
            //当表单项不是必填项时，若为空，则验证通过，否则需要验证
            var that = this;
            var rules = rulecfg.type;
            if (arale.isString(rules)) {rules = [rules];}
            var unrequired = !$A(rules).some(function(v, i) {
                    return arale.isString(v) && v.indexOf('required') > -1;
                });
            if (unrequired && this._isNull($ele)) {
                valid = true;
            } else {
                valid = (!rules) ? true : !$A(rules).some(function(cfg) {
                        var ruleName = arale.isArray(cfg) ? cfg[0] : cfg;
                        var rule = that.ruleFactory.getRule(that._fixRuleName(ruleName));
                        msg = that.msgFactory.getMsg(ruleName);
                        thatcfg = [rulecfg.desc || ''];
                        if (arale.isArray(cfg)) {
                            for (var k = 1, l = cfg.length; k < l; k++) {
                                thatcfg[thatcfg.length] = cfg[k];
                            }
                        }
                        var b = arale.isFunction(rule) ? that._funcValidate($ele, cfg) : that._regValidate($ele, rule);
                        return !b;
                    });
            }
            $E.publish(this._getEventTopic('validate', 'after'), [$ele.node, valid, rulecfg.errorMsg || this._dealMsg(msg, thatcfg, $ele)]);
            return valid;
        },

        /** @private */
        _fixRuleName: function(s) {
            return s.indexOf('required') > -1 ? 'required' : s;
        },

        /** @private */
        _isNull: function($ele) {
            var t = $ele.attr('type');
            switch (t) {
            case 'checkbox':
            case 'radio':
                var n = $ele.attr('name');
                var eles = $$(t + '[name=' + '"' + n + '"]', this.domNode);
                return !$A(eles).some(function(item) {
                        return item.attr('checked');
                    });
            default:
                var v = $ele.node.value;
                if (!$S(v).trim()) {return true;}
                return false;
            }
        },

        /** @private */
        _dealMsg: function(msg, cfg, $ele) {
            if (arale.isString(msg)) {
                var i = 0;
                while (msg && typeof cfg[i] !== 'undefined') {
                    msg = msg.replace(/%s/, cfg[i++]);
                }
            } else if (arale.isFunction(msg)) {
                var args = [$ele];
                msg = msg.apply(this, $A(args).extend(cfg));
            }
            return msg;
        },

        /**
         * 函数式校验执行器
         * @private
         */
        _funcValidate: function($ele, rulecfg) {
            var args = [$ele];
            if (arale.isArray(rulecfg)) {
                var ruleName = rulecfg[0];
                for (var i = 1, l = rulecfg.length; i < l; i++) {
                    args[args.length] = rulecfg[i];
                }
            } else {
                var ruleName = rulecfg;
                args[args.length] = $ele;
            }
            ruleName = this._fixRuleName(ruleName);
            var rule = this.ruleFactory.getRule(ruleName);
            return rule.apply(this, args);
        },

        /**
         * 正则校验执行器
         * @private
         */
        _regValidate: function($ele, rule) {
            var p = $ele.attr('placeholder');
            var v = $ele.node.value;
            var str = (p && v == p) ? '' : v;
            return rule.test(str);
        }

});

/**
 * 2011.4.19    增加配置stopOnError，默认全部检验时会提示所有错误信息。设为true后会只提示第一个出错
 */
