/**
 * @name aralex.autocomplete.AutoComplete
 * @class
 * 通过autocomplete类, 方便用户创建一个简单的支持用户上下, 鼠标滑动来选择的suggest.
 */
var arale = require('arale.base');
var declare = require('arale.class');
var aralexBase = require('aralex.base');
var $E = require('arale.event');
var $ = require('arale.dom').$;
var $$ = require('arale.dom').$$;
//@$Loader.css;
module.exports = arale.declare('aralex.autocomplete.AutoComplete', [aralexBase.TplWidget, aralexBase.View], {
    /** @lends aralex.autocomplete.AutoComplete.prototype */
    /**
     * 数据源, 只需要提供一个方法getData即可, 具体数据的缓存, 数据请求都由数据源来完成
     * @type Object
     * @default null
     */
    datasource: null,
    /**
     * TODO textInput用el来代替
     * 引用文本输入框的元素
     * @type Node
     * @default null
     */
    textInput: null,
    /**
     * 提示容器的className
     * @type String
     * @default 'suggest_c'
     */
    scClassName: 'suggest_c',
    /**
     * 选中item的className
     * @type String
     * @default 'suggest_s'
     */
    ssClassName: 'suggest_s',
    /**
     * 这个是提示条目的className
     * @type String
     * @default 'suggest_o'
     */
    soClassName: 'suggest_o',
    /**
     * 发起请求的timeout,如果在延时时间内，新的请求到来，则取消先前的timeout
     * @type String
     * @default null
     */
    suggestTimeout: null,
    /**
     * 延迟请求的时间,
     * @type Number
     * @default 200
     */
    delay: 200,
    /**
     * 记录是用户通过选择来得到的值
     * @type String
     * @default ''
     */
    selectValue: '',
    /**
     * 新加的，记录用户通过键盘输入的值，
     * @type String
     * @default 记录用户自己输入的值
     */
    userInputValue: '',
    /**
     * 隐藏容器的timeout,如果在新的显示来临之前，还没有隐藏，则取消隐藏
     */
    hiddenContainerTimeout: null,
    /**
     * 在ie6下面需要用这个iframe进行select的遮挡
     * @type Object
     * @default null
     */
    selectIframe: null,
	/**
	 * 当前高亮的元素
	 * @type Node
	 * @default null
	 */
    highlightElem: null,	
    /**
     * 提示条目的数量
     * @type Number
     * @default 10
     */
	resultSize: 10,
	/**
	 * 指定模版
	 * @type String
	 * @default  @template('autocomplete.tpl')
	 */
    templateString: @template('autocomplete.tpl'),

	/**
	 * 用来发布用户选择的数据,需要用户覆盖
	 * @param {String} value 用户选择的内容
	*/
	change: function(value) {
	},
	/**
	 * 用户回车,或者点击触发的事件, 用户可以选择根据自己的需要覆盖
	 * @param {Node} 用户选择的item
	 */
	selectEvent: function(target) {
	
	},
	/** @ignore */
    beforeCreate: function(obj) {
        this.textInput = $(this.id + '_suggestInput') || obj.textInput;
		this.textInput.attr('autocomplete', 'off');
        this.selectValue = this.userInputValue = this.textInput.node.value;
    },
   /** @ignore */
    bind: function() {
        //console.log('bind');
        var that = this;
        this.textInput.keydown(arale.hitch(this, '_onKeypress'));
        this.textInput.blur(function() {
            that.hiddenContainerTimeout = setTimeout(function() {
                that.hideSuggestContainer();
            }, that.delay);
			$E.publish(that.getBlurTopic(), []);
		});
        this.textInput.focus(function() {
            setTimeout(arale.hitch(that, '_setPosition'), that.delay);
        });
        this.addEvent('mouseover', function(target, evt) {
            //console.log('mouse over 133331----->');
            target = $(target);
            that._highlightOption(0, target);
        }, '.' + this.soClassName);
        this.addEvent('mousemove', function(target, evt) {
            return;
            console.log('mouse move1111111----->');
            target = $(target);
            console.log(target.node.tagName);
            that._highlightOption(0, target);
        }, '.' + this.soClassName);
		this.addEvent('mouseout', function(target, evt) {
		    return;
			var rt = evt.relatedTarget;
			if(!rt)return;
			var tagName = rt.tagName.toUpperCase();
			if(tagName == 'DIV') {
				that._removeHighlightOption();
			}
		});
        this.addEvent('click', function(target, evt) {
            target = $(target);
            var value = that._getValueByItem(target);
			if(value) {
				that._updateSelectValue(value);
			}
			that.textInput.node.focus();
			that.selectEvent(target);
        }, '.' + this.soClassName);
    },
    /** @ignore */
    postCreate: function() {
        //console.log('postCreate---->');
        //console.log(this.domNode.node);
        var that = this;
        this.suggestContainer = this.domNode; 
        if (arale.isIE6()) {
			this.selectIframe = $(this._createIframe('selectIframe'));
        }
        this.hideSuggestContainer();
        this._setPosition();
        //setTimeout(function() {
          //  dojo.connect(window, 'resize', dojo.hitch(that, '_setPosition'));
       // },this.delay);
        window.setInterval(function() {
            var newValue = that.textInput.node.value;
			//console.log('intevalue--->', newValue, that.selectValue);
            if (that.selectValue != newValue) {
                if (!that.hiddenContainerTimeout) {
                    that.hiddenContainerTimeout = setTimeout(function() {
                         //that.hideSuggestContainer();
                    }, 500);
                }
                if (that.suggestTimeout) {
                    clearTimeout(that.suggestTimeout);
                }
                that.suggestTimeout = setTimeout(function() {
                      that._sendRequestForSuggestions();
                }, that.delay);
                that.userInputValue = that.selectValue = newValue;
            }
        }, 50);
    },
    /** @ignore */
    _setPosition: function() {
        //console.log('_setPositon----1--->');
        var scBorder = this.suggestContainer.border();
        var lt = this._getTopAndLeft(this.textInput.node);
        this.suggestContainer.setStyle({
            left: lt.left + 'px',
            top: lt.top + this.textInput.node.offsetHeight - scBorder.t + 'px',
            width: this.textInput.node.offsetWidth - scBorder.l + 'px'
        });
    },
    /** @ignore */
    _getTopAndLeft: function(elem) {
        var that = this;
        var tL = {};
        var top = 0, left = 0;
        top += elem.offsetTop;
        left += elem.offsetLeft;
        elem = elem.offsetParent;
        var calculator = function(elem) {
            var topBorderWidth = 0, leftBorderWidth = 0;
            if (elem) {
                if (elem.tagName.toUpperCase() != 'FIELDSET') {
                    //计算边框
                    var border = $(elem).border();
                    topBorderWidth = border.t;
                    leftBorderWidth = border.l;
                }
                top += (elem.offsetTop + topBorderWidth);
                left += (elem.offsetLeft + leftBorderWidth);
                calculator(elem.offsetParent);
            }else {
                return;
            }
        }
        calculator(elem);
        tL.top = top;
        tL.left = left;
        return tL;
    },
    /** @ignore */
    _onKeypress: function(evt) {
        var index, keys = $E.keys, that = this, isContainerVisible = this._isContainerVisible();
        this._setKeyChar(evt);
        var key = evt.charOrCode;
        switch (key) {
            case keys.DOWN_ARROW:
                //如果现在没有显示出来提示框，则显示，前提是里面有数据
                if (!isContainerVisible) {
                    this.showSuggestContainer();
                }else {
                    this._highlightOption(1);
					this.changeInputValue(this._getValueByItem(this.highlightElem));
                }
                evt.stopEvent();
                break;
            case keys.UP_ARROW:
                if (!isContainerVisible) {
                	this.showSuggestContainer();
                }else {
                    this._highlightOption(-1);
					this.changeInputValue(this._getValueByItem(this.highlightElem));
                }
               	evt.stopEvent();
                break;
            case keys.ENTER:
                //处理用户回车事件，加入咱们自己的处理
                if (isContainerVisible) {
                    this.hideSuggestContainer();
					this.changeInputValue(this._getValueByItem(this.highlightElem));
					this.selectEvent(this.highlightElem);
                    //可能需要加表单提交事件,以后可以加hock方法，目前先不考虑
                }
				evt.stopEvent();
                break;
            case keys.ESCAPE:
                if (isContainerVisible) {
                    this.hideSuggestContainer();
                    this._resumeInputValue();
                }
                break;
        }
    },
    _getValueByItem: function(item) {
        if (item && item.attr && item.attr('pseduo')) {
            return item.getHtml();
        }
        return this.getValueByItem(item);
    },
    /**
     * 根据提示条目的item来获取内容, 如果用户自定义模版需要自己对这个方法进行覆盖
     * @param {Node} item 用户通过鼠标或者上下键选择的item 
     * @return {String} 
     */
    getValueByItem: function(item) {
        return item.getHtml();
    },
    /** 
     * 获取一个模拟item, 来统一操作. 用来当用户选择一个来回后, 回到用户输入的地方时
     * @private
    */
    _getInputOption: function() {
        var that = this;
        if (this.inputOption) {
            this.inputOption.setHtml(this.userInputValue);
            return this.inputOption;
        }
        var item = this.item = $(document.createElement('p'));
        item.setHtml(this.userInputValue);
        item.attr('pseudo', true); 
        item.next = function() {
            return that._getFirstOption();
        };
        item.prev = function() {
            return that._getFirstOption(-1);
        };
        return item;
    },
    /**
     * 获取第一个或者最后一个提示item
     * @private
     */
    _getFirstOption: function(index) {
        //console.log('getFirstOption---->');
        var options =  $$('.' + this.soClassName, this.suggestContainer);
        if (options.length > 0) {
            if (index && index < 0) {
                return options[options.length - 1];
            }
            return options[0];
        } 
        return this._getInputOption();
        //return $$('.suggest_o', this.suggestContainer)[0];              
    },
    /**
     * 用来改变和保存用户的输入值
     * @private
     */
    changeInputValue: function(value) {
        this.selectValue = this.textInput.node.value = value;
		this.change(value);
    },
    /** @ignore */
    //调用数据接口获取数据, 并创建suggestions
    _sendRequestForSuggestions: function() {
        //console.log('--------_sendRequestForSuggestions');
        var that = this;
        //if (!this.userInputValue || this.userInputValue.length <= 0) {
          //  return;
       // }
       // this.createSuggestions1();
        //return;
        //console.log(this.userInputValue, this.textInput.node.value);
		this.datasource.getData.call(this, this.userInputValue, function(data) {
            that.highlightElem = null;
            that.createSuggestions(data);
        });
    },
    /**
     * 创建提示框, 用户可以根据不同的情况覆盖此方法, 进行不同的处理
     * @param {Object} data 用来渲染suggestion的数据
    */
    createSuggestions: function(data) {
        var num = Math.random();
        //console.time('cs' + num);
        this.suggestContainer.setHtml(this.getTmplHtml(data, 'suggestItems'));
        this.showSuggestContainer();
        //console.timeEnd('cs' + num);
        //data.length > 0 ? this.showSuggestContainer() : that.hideSuggestContainer();
	},
	/**
	 * 隐藏suggestion容器
	 */
    hideSuggestContainer: function() {
        //console.log('hideSuggest---->');
        if (this.hiddenContainerTimeout) {
            window.clearTimeout(this.hiddenContainerTimeout);
            this.hiddenContainerTimeout = null;
        }
        this.hide();
        this._hideSelectIframe();
    },
    /**
     * 显示suggestion容器
     */
    showSuggestContainer: function() {
        var options =  $$('.' + this.soClassName, this.suggestContainer);
        if (options.length == 0) {
            this.hideSuggestContainer();
            return;
        }
        console.log('never here');
        this.mouseStatus = 1;
        this.suggestContainer.setStyle({
            'display': 'block',
            'zIndex': 200
        });
        this._highlightOption(0);
        this._showSelectIframe();
    },
    /** @ignore */
    //清除高亮
    _removeHighlightOption: function() {
        //把高亮元素清除
        //console.log("remove-------hi");
        var item = this.highlightElem; 
        item && item.removeClass(this.ssClassName);
    },
    /** @ignore */
    //高亮item
    _highlightOption: function(span, oitem) {
        var num = Math.random();
        //console.time('h'+ num);
        //console.log('hightoption--2----');
        var item = oitem || this.highlightElem || this._getInputOption();
        //console.log(item.node);
        var match = item.node.tagName;
        this._removeHighlightOption(); //清除原来的高亮元素
        if (span > 0) {
            item = this._nextItem(item, match, span); 
        } else if (span < 0) {
            item = this._prevItem(item, match, span); 
        }
        this.highlightElem = item;
        item && item.addClass(this.ssClassName);   //高亮当前元素
        //console.timeEnd('h' + num);
        return item;
    },
    /**
     * 找到下一个高亮元素.
     * @param {Node} item 起点元素
     * @param {String} match 匹配规则
     * @param {Number} span 跨度
     * 
     * @private
     */
    _nextItem: function(item, match, span) {
        var that = this;
        var citem = item;
        while(span) {
            citem = citem.next(match);
            if (citem == null) {
                return that._getInputOption();
                //citem = item.parent().first(match);
            }
            span--;
        }
        return citem;
    },
    /**
     * 找到上一个高亮元素.
     * @param {Node} item 起点元素
     * @param {String} match 匹配规则
     * @param {Number} span 跨度
     * 
     * @private
     */
    _prevItem: function(item, match, span) {
        var that = this;
        var citem = item;
        while(span) {
            citem = citem.prev(match);
            if (citem == null) {
                return that._getInputOption();
                //citem = item.parent().last(match);
            }
            span++;
        }
        return citem;
    },
    /** @ignore */
    _filterSpace: function(value) {
        //替换元素中间的空格为+,solr需要
        return value.replace(/[ ]+/g, '+');
    },
    /** @ignore */
    _isContainerVisible: function() {
        return this.suggestContainer.getStyle('display') === 'block';
    },
    /** @ignore */
    //恢复input的值为用户最后输入的值
    _resumeInputValue: function() {
		this.changeInputValue(this.userInputValue);
    },
    /** @ignore */
	//当用户通过选择得到的值得话，需要更新到其他相关的两个部分
    _updateSelectValue: function(value) {
		this.changeInputValue(value);
    },
    /** @ignore */
    _createIframe: function(/*String*/fname) {
        var cframe = null;
		//var ifrstr = arale.isIE6() ? '<iframe name="' + fname + '">' : 'iframe';
        var ifrstr = arale.isIE6() ? '<iframe name="' + fname + '" src="javascript:\'\'">' : 'iframe';
        cframe = $D.toDom(ifrstr);
        with (cframe) {
            name = fname;
            setAttribute('name', fname);
            id = fname;
        }
        document.body.appendChild(cframe);
        window[fname] = cframe;
        return cframe;
    },
    /** @ignore */
    _showSelectIframe: function() {
        //为了ie下面的select遮挡bug而加的东西
        if (!this.selectIframe)return;
            var sc = this.suggestContainer.region();
            this.selectIframe.setStyle({
                position: 'absolute',
                left: sc.left + 'px',
                top: sc.top + 'px',
                width: sc.width + 'px',
                height: sc.height + 'px',
                zIndex: 100
            });
    },
    /** @ignore */
    _hideSelectIframe: function() {
        if (!this.selectIframe)return;
        this.selectIframe.setStyle({
            position: 'absolute',
            left: 0 + 'px',
            top: 0 + 'px',
            width: 0 + 'px',
            height: 0 + 'px',
            zIndex: 0
        });
	},
	getSelectTopic: function() {
		return "aralex/autocomplete/selecttopic/"+this.id;
	},
	getBlurTopic: function() {
		return 'aralex/autocomplete/blur/' + this.id;
	},
	getFocusTopic: function() {
		return 'aralex/autocomplete/focus/' + this.id;
	},
	getInputTextValue: function() {
		return this.textInput.node.value;
	},
	 /** @ignore */
    _setKeyChar: function(evt) {
        evt.keyChar = evt.charCode ? String.fromCharCode(evt.charCode) : '';
        evt.charOrCode = evt.keyChar || evt.keyCode;
    },
    /**
     * 给组件对象指定属性添加id
     * @param {String} 属性名称 
     */
    _addId: function(attr) {
		this[attr] = this.id + "_" + this[attr];
	},
	/**
	 * 给指定内容添加id
	 * @param {String} str 需要添加id的字符串
	 */
	_wId: function(str) {
		return this.id + '_' + str;
	}
});

