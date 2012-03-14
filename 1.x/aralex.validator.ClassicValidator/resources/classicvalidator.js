/**
 * @name aralex.validator.ClassicValidator
 * @class
 * ClassicValidator的使用和Validator的使用基本相同，只是增加了一些行为的钩子。这些钩子建议使用默认值，约定大于配置有利于开发效率的提高。经典校验封装了一系列默认行为，可以满足大部分情况下的需求。这些行为包括：鼠标在校验项移入移出时、校验失败时、ajax请求验证时、有错误提示信息时对表单DOM结构增加各种class以改变提示样式。
 * @author <a href="mailto:shuai.shao@alipay.com">邵帅</a>
 * @extends aralex.validator.Validator
 * @param {Object} cfg 配置
 * @returns {aralex.validator.ClassicValidator} ClassicValidator组件对象
 * @example
var validator = new aralex.validator.ClassicValidator({
	itemClass: "ui-fm-item",
	notifyClass: "ui-fm-explain",
	errorClass: "ui-fm-error",
	focusClass: "ui-fm-focus",
 
	formId: "validate-form",
	rules: {
		"input[name='phone']": {type: ["cnMobile"],required: true},
		"input[name='hobby']": {required: true}
	}
});
 */
var $Node = require('arale.dom').$Node;
var $D = require('arale.dom').$D;
var $E = require('arale.event');
var $A = require('arale.array');
var Validator = require('aralex.validator.Validator');

module.exports = arale.declare("aralex.validator.ClassicValidator", [Validator], {
        /** @lends aralex.validator.ClassicValidator.prototype */
		/**
		 * 需要校验的表单项的class
		 * @type String
		 * @default "ui-fm-item"
		 */
		itemClass: "ui-fm-item",

		/**
		 * 提示信息class
		 * @type String
		 * @default "ui-fm-explain"
		 */
		notifyClass: "ui-fm-explain",

		/**
		 * 出错信息class
		 * @type String
		 * @default "ui-fm-error"
		 */
		errorClass: "ui-fm-error",

		/**
		 * 鼠标移入校验项时父亲节点class
		 * @type String
		 * @default "ui-fm-hover"
		 */
		hoverClass: "ui-fm-hover",

		/**
		 * 表单项focus时父亲节点class
		 * @type String
		 * @default "ui-fm-focus"
		 */
		focusClass: "ui-fm-focus",

		/**
		 * 点击提交时提示信息class
		 * @type String
		 * @default "ui-fm-status"
		 */
		loadClass: "ui-fm-status",

        /**
         * ajax loading class
		 * @type String
		 * @default "ui-fm-loading"
         */
		ajaxLoadClass: "ui-fm-loading",

        /**
         * ajax成功 class
		 * @type String
		 * @default "ui-fm-success"
         */
		ajaxSuccessClass: "ui-fm-success",

		/**
		 * placeholder的class，用来处理对placeholder属性不支持的浏览器的处理，一般不需要改变
		 * @type String
		 * @default "ui-fm-placeholder"
		 */
		placeholderClass: "ui-fm-placeholder",

        /**
         * @type {function}
         * 提供默认的检验后DOM行为处理
         */
        defaultAfterValidate: function(ele, bValid, errorMsg) {
            var p = this.getParentItem(ele);
            if(!bValid) {
                p.removeClass(this.hoverClass);
                if($(ele).attr("placeholder") && ele.value != $(ele).attr("placeholder")) {
                    $(ele).removeClass(this.placeholderClass);
                }
                p.addClass(this.errorClass);
                
                errorMsg && (this.getExplain(ele).node.innerHTML = this._strfix(errorMsg));
            }else {
                p.removeClass(this.errorClass);
                if(this._ajaxComplete) {
                    this.getExplain(ele).node.innerHTML = this._strfix($(ele).attr(this.notifyClass));
                }
            }
        },

        /**
         * @type {function}
         * 提供默认的Ajax检验后DOM行为处理
         */
        defaultAfterAjaxValidate: function($ele, v, msg){
            var parent = this.getParentItem($ele);
            parent.removeClass(this.ajaxLoadClass);
            if(v) {
                parent.addClass(this.ajaxSuccessClass);
            } else {
                parent.addClass(this.errorClass);
                this.getExplain($ele).node.innerHTML = this._strfix(msg);
            }
        },

        /**
         * @type {function}
         * 自定义的检验后DOM行为处理，如果存在，则此函数会生效，而不是defaultAfterValidate
         */
        customAfterValidate: null,

        /**
         * @type {function}
         * 自定义的ajax检验后DOM行为处理，如果存在，则此函数会生效，而不是defaultAfterAjaxValidate
         */
        customAfterAjaxValidate: null,

        /** @ignore */
		bind: function() {
			this.parent(arguments);
			//html5对placehoder的支持
			var bPlaceHolder = this._supportPlaceholder();

			var that = this;
			for(var e in this.rules) {
				$A($$(e, this.domNode)).each(function($ele) {

						if(!bPlaceHolder && $ele.attr("placeholder")) {
							if(!$ele.node.value || $ele.node.value == $ele.attr("placeholder")) {
								$ele.attr("value", $ele.attr("placeholder"));
								$ele.addClass(that.placeholderClass);
							}
						}

						//保存提示信息
						var bNC = $ele.attr(that.notifyClass);
						if(bNC == null && bNC == undefined)  {
							$ele.attr(that.notifyClass, that.getExplain($ele).attr('html').replace(/(\"|\')/g, '\$1'));
						}

						//绑定hover
						var h = $E.on($ele, "mouseover", function(e){
								that.getParentItem($ele).addClass(that.hoverClass);
						});
						that._handlers[that._handlers.length] = h
						h = $E.on($ele, "mouseout", function(e){
								that.getParentItem($ele).removeClass(that.hoverClass);
						});
						that._handlers[that._handlers.length] = h

                        var type = $ele.attr('type');

						//绑定表单项focus
                        h = $E.on($ele, 'focus', handler);
                        that._handlers[that._handlers.length] = h;

                        if(type == 'radio' || type == 'checkbox') {
                            h = $E.on($ele, 'change', handler);
                            that._handlers[that._handlers.length] = h;
                        }

                        function handler(e) {
                            //placeholder支持
                            if($ele.attr("placeholder") && !bPlaceHolder && $ele.attr("value") == $ele.attr("placeholder")) {
                                    $ele.node.value = "";
                                    $ele.removeClass(that.placeholderClass);
                            }

                            var p = that.getParentItem($ele);
                            p.removeClass(that.hoverClass);
                            p.removeClass(that.ajaxLoadClass);
                            p.removeClass(that.ajaxSuccessClass);
                            p.addClass(that.focusClass);
                            //if(p.hasClass(that.errorClass)) {
                                p.removeClass(that.errorClass);
                                that.getExplain($ele).node.innerHTML = that._strfix($ele.attr(that.notifyClass));
                            //}

						}

						//绑定blur
						h = $E.on($ele, "blur", function(e){
								//placeholder支持
								if($ele.attr("placeholder") && !bPlaceHolder && !$ele.node.value) {
										$ele.attr("value", $ele.attr("placeholder"));
										$ele.addClass(that.placeholderClass);
								}

								that.getParentItem($ele).removeClass(that.focusClass);
								//
						});
						that._handlers[that._handlers.length] = h

				});
			}
			var h = this.before("validate", function(ele) {
					if($Node(ele).attr("placeholder") && ele.value == $Node(ele).attr("placeholder")) {
						ele.value = "";
					}
			});
			this._shandlers[this._shandlers.length] = h;
			h = this.after("validate", this.customAfterValidate || this.defaultAfterValidate);
			this._shandlers[this._shandlers.length] = h;

			if(this.checkOnSubmit) {
				var h = this.before("validateAll", function(){
					this.loadClass && $A($$("." + this.loadClass, this.domNode)).each(function(item){
						item.removeClass("fn-hide");
					});
				});
				this._shandlers[this._shandlers.length] = h;
				h = this.after("validateAll", function(){
					this.loadClass && $A($$("." + this.loadClass, this.domNode)).each(function(item){
						item.addClass("fn-hide");
					});
				});
				this._shandlers[this._shandlers.length] = h;
			}

			//h = $E.subscribe(this._getEventTopic("ajaxValidate","before"), function($ele){
			h = this.before("ajaxValidate", function($ele){
					this.getExplain($ele).node.innerHTML = "检测中";
					this.getParentItem($ele).addClass(this.ajaxLoadClass);
			});
			this._shandlers[this._shandlers.length] = h;
			h = this.after("ajaxValidate", this.customAfterAjaxValidate || this.defaultAfterAjaxValidate);
			this._shandlers[this._shandlers.length] = h;


		},


		/**
		 * 得到表单项的class为itemClass的父元素
		 * @param {Node | HTMLElement} ele 表单元素
         * @returns {Node} 
         * @private
		 */
		getParentItem: function(ele) {
			return $($(ele).parent("." + this.itemClass));
		},

		/**
		 * 得到表单项对应的提示信息容器，若不存在，则创建
		 * @param {Node | HTMLElement} ele 表单元素
         * @private
		 */
		getExplain: function(ele) {
			var parent = this.getParentItem(ele);
			return $$("." + this.notifyClass, parent)[0] || $($D.toDom('<div class="' + this.notifyClass + '"></div>')).inject(parent, "bottom");
		},

		/**
		 * @private
		 * 检测是否支持html5的placeholder属性
		 */
		_supportPlaceholder: function() {
			var i = document.createElement('input');
			return 'placeholder' in i;
		},

		/**
         * 如果字符串为null转换为""
         * @private
         */
		_strfix: function(str) {
			return (str == null || str == undefined) ? "" : str;
		}
});
