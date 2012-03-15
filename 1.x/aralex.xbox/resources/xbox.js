var arale = require('arale.base');
var $ = require('arale.dom').$;
var $$ = require('arale.dom').$$;
var $E = require('arale.event');
var $S = require('arale.string');
var $A = require('arale.array');
var $H = require('arale.hash');
var declare = require('arale.class');
require('arale.fx');
var aralexBase = require('aralex.base');
//@$Loader.css
/**
 * @name aralex.xbox.Xbox
 * @class
 */
exports.Xbox = declare("aralex.xbox.Xbox", [aralexBase.Widget],{
    /** @lends aralex.xbox.Xbox.prototype */
	
    /**
    * 全局常量
    * 
    */
    cfg: {
        MOCK: "xbox-mock",
        MOCK_CLASS: "ui-xbox",
        LOAD: "xbox-load",
        IFRAME: "xbox-iframe",
        IFRAME_FIX: "xbox-hide-select",
        OVERLAY: "xbox-overlay",
        OVERLAY_BG: "ui-xbox-shadow"
    },
	xboxClass: null, //用来添加新的class,只做追加到cfg中的class使用MOCK_CLASS和OVERLAY_BG
    /**
     * 关闭链接
     * @type String
     * @default '<a href="#">关闭</a>'
     */
	closeLink: '<a href="#" class="ui-xbox-close" title="关闭">×</a>', //可以被覆盖
	el: "",
    //String|Array
    /**
     * xbox类型
     * @type String
     * @default 'xbox'
     */
    type: "xbox",
    //dom|iframe
    value: "",
    modal: true,
    //点击外部关闭
    /**
     * xbox默认宽度
     * @type Number
     * @default 600
     */
    width: 600,
    /**
     * xbox默认高度
     */
    height: "",
    /**
     * xbox默认最大宽度
     * @type Number
     * @default 800
     */
    maxWidth: 800,
    /**
     * xbox默认最大高度
     * @type Number
     * @default 500
     */
    maxHeight: 500,
	minHeight: null,
    autoFit: true,
    autoShow: false,
    border: true,
    /**
     * 显示前调用的回调函数. 用户可以自定义函数去覆盖
     * @type Function
     * @default false
     */
    beforeShow: false,
    /**
     * 隐藏前调用的回调函数.用户可以自定义函数去覆盖 
     * @type Function
     * @default false
     */
    beforeHide: false,
    noScroll: false,
    fixed: false,
    load: false,
    /**
     * 是否兼容老版xbox. 主要是增加了老版关闭调用的方法接口, 和关闭链接
     * @type Boolean
     * @default false
     */
    isOld: false,
    /**
	 * 由于xbox的OVERLAY 为了遮住一些影响用户视觉的select,所以添加了iframe,
	 * d但是在ie6下iframe会对select进行完全遮挡,所以为了某些页面,我们添加了控制
	 * k可以让用户自我选择是否需要overlay iframe
	 * @type Boolean
	 * @default true
	 */
	isNeedOverlayIframe: true,
	/**
	 * 是否阻止触发xbox元素的默认事件
	 * @type Boolean
	 * @default true
	 */
	isStopBindElEvent: true,
	/** @ignore */
	beforeCreate: function() {
		this._fixType();
		aralex.xbox.Xbox.cache = {};
		this._mergeXboxClass();
        //fix old xbox close link
        if (this.isOld) {
            this.closeLink = '';
        }
	},
	/**
	 * 合并class
	 * @private
	 */
	_mergeXboxClass: function(){
		if(this.xboxClass !== null){
			if(this.xboxClass.MOCK_CLASS){				
				this.xboxClass.MOCK_CLASS = this.cfg.MOCK_CLASS + " " + this.xboxClass.MOCK_CLASS;
			}else{
				this.xboxClass.MOCK_CLASS = this.cfg.MOCK_CLASS;
			}
			if(this.xboxClass.OVERLAY_BG){
				this.xboxClass.OVERLAY_BG = this.cfg.OVERLAY_BG + " " + this.xboxClass.OVERLAY_BG;
			}else{
				this.xboxClass.OVERLAY_BG = this.cfg.OVERLAY_BG;
			}
		}else{
			this.xboxClass = {
				MOCK_CLASS: this.cfg.MOCK_CLASS,
				OVERLAY_BG: this.cfg.OVERLAY_BG
			};
		}
	},
	/** @ignore */
	postCreate: function(){
		var that = this;
		//如果这个组件不需要id,我们也给生成一个唯一的id
		if(!this.id){
			this.id = arale.getUniqueId();
		}
		this.aroundFn("show");
		this.aroundFn("hide");
		this.before("show",function(){
			that.setCurrentXbox();
		});
		this.after("show",function(){
			that._bindEsc();
			that._bindClose();
		});
		this.after("hide",function(){
			//clear document.body keyup bind
	    	//$E.disAllConnect(document, "keyup");
			that.destroy();
		});
	},
	/**
	 * 绑定esc事件
	 * @private
	 */
	_bindEsc: function(){
		var that = this;
		//TODO removeBind esc key
		 //Bind esc key
		//TODO 给提炼到一个函数中
		var handler = $E.connect(document, "keyup", function(e) {
			if(e.which == 27){ // close
				that.hide();
				//TODO 可能是如果是iframe的话,需要关闭父元素
			}	
		});
		this._connects.push(handler);	
	},
	/**
	 * 绑定关闭事件
	 * @private
	 */
	_bindClose: function(){
		//为dom添加关闭按钮
		var that = this;
		var handler = $E.delegate(this._mock,'click',function(elem,e){
			that.hide();
			e.preventDefault();
		},".ui-xbox-action a");		
		this._connects.push(handler);
	},
	/**
	 * 设置当前xbox
	 * @private
	 */
	setCurrentXbox: function(){
		aralex.xbox.Xbox.cache.current = this;
	},
	/**
	 * fixtype
	 * @private
	 */
	_fixType: function(){
		//因为好多方法都去判断这个了,所以在初始化的时候给fix掉
		this.type = this.type.toLowerCase();
	},
	/**ignore*/
	bind: function(){
	    if(!this.el){
            return;
        }
        this.bindEl(this.el);
    },
    /**
     * 绑定触发元素
     * @param {Node|HTMLElement} 触发xbox显示的元素
     * @private
     */
    bindEl: function(el){
       	//为指定的元素添加事件,来触发xbox的显示
		var that = this, isStop = this.isStopBindElEvent;
       	if(!arale.isArray(el)){
			el = [el];
		}
		$A(el).each(function(elem){
            if(elem && $(elem)){
				$(elem).click(function(e){
					if (isStop) {
						e.stopEvent();
					}
					that.show(e.target);
				});
			}
		});	
    },
	/**
   	* 显示xbox
   	* @param {Node|Null} 触发显示的元素 
    */
	show: function(target) { 
	 	if(target) {
			aralex.xbox.Xbox.cache.fireObject = target;	
		}	
        //准备DOM结构
		//由于未知原因,可能会出现两个mock内容,现在进行控制,如果当前页面mock已经存在,那么将不执行新的xbox渲染
		if($(this.cfg.MOCK)){
			return;
		}
        this._renderOverlay();
        this._renderMock();
		this._showOverlay.call(this);
        this._fixAliedit();
        //fix compatible old xbox;
        if (this.isOld) {
            arale.namespace('AP.widget.xBox');
            AP.widget.xBox.hide = arale.hitch(this,function() {
               this.hide(); 
            });
        }

    },
    /**
     * fix 证书显示问题
     * @private
     */
	_fixAliedit: function(){    
		//note:显示renderOverlay方法中被误杀的xbox:dom里的控件
		//2010.3.17
		var o = $A($$("#xbox-mock .alieditContainer"));
		o.each(function(n){
			n.setStyle({
				visibility:"visible",
				opacity:"1",
				filter:"alpha(opacity = 1)"
			});
		});	
	}, 
    /**
     * 获取预设宽度
     * @private
     */
    _getOptWidth: function() {
		var w;
		if (parent && parent.$("xbox-iframe") && (parent.$("xbox-iframe").attr("auto-width") > 0)) {
			w = parent.$("xbox-iframe").attr("auto-width");
		}else{
		 	w = parseInt(this.width, 10);	
		}			
		//save the value
		this.width = w;		
		return w;
    },   
    /**
     * 获取预设高度
     * @private
     */
    _getOptHeight: function() {
        return parseInt(this.height, 10);
    },   
    /**
     * 获取Top值
     * @param {Object} 是否黄金分割
     * @param {Boolean} 是否为iframe
     * @return {Number}
     * @private
     */
    _getNiceTop: function(isIFRAME) {
        var _el = $(this.cfg.MOCK);
        _el = (this.type == "dom") ? _el : _el.first();
        var _scrollTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop, _top, _vh = $D.getViewportHeight(), _nice;
        var _mH = this.getMh(_el);
		//获取合理top
		_top = _vh > _mH ? (0.382 * _vh - _mH / 2) : 50;
		//考虑scroll的情况
		_top = Math.max(50, _top) + _scrollTop; 
			//至少也留50px吧？
		_top = Math.max(50, _top);

		return parseInt(_top, 10);
    },
    /**
     * 获取高
     */
	getMh: function(_el){
       	return this._getWH(_el)[1];  
	},
	/**
      * 获取Left值
      * @param {Object} 是否黄金分割
      * @return {Number}
      * @private
      */
	_getNiceLeft: function() {
         var _el = $(this.cfg.MOCK),
             _width = this._getWH(_el)[0],
             _left = ($D.getViewportWidth() - 5 - _width) / 2;
 		return parseInt(_left, 10);
	},       
    /**
    * 获取元素width, height
    * @param {HTMLDOMElement} 
    * @return {Array} [10,12]
    * @private
    */
	_getWH: function(el) {
		var region = $(el).region();
        return [region.width, region.height];
	},
	/**
    * 获取窗体DOM,IFRAME URL,String
    * @private
    */
    makeValue: function () {
        var v = this.value,t = this.type;    
		//这个是干啥用的?为什么会有这种情况
		if (arale.isFunction(v)) {
            return v.call(this, aralex.xbox.Xbox.cache.fireObject);
        }                     
	    if (this._isId(v)){
	    	return $(v);
		}else if(this._isCssExp(v)){
			return $$(v)[0];
		}else{
			return v.toString();
		}
    },
    /**
	 * 是不是一个合法的id
	 * @param ${String} id 
	 * @return {Boolean}
     */
	_isId: function(id){
		return /^[a-zA-Z]([^#.\s]*)[a-zA-Z0-9]$/.test(id);
	},
	/**
	 * 是不是一个合法的css表达式
	 * @param {String} exp css表达式
	 */
	_isCssExp: function(exp){
		//是不是一个合法的css表达式
		return /^[a-zA-Z#\.]*(\s?)(.*)[a-zA-Z0-9]$/.test(exp);
	},
    /**
    * add a param "_xbox=true" to url
    * @param {String} url 
    */
    _fixUrl: function (url) {//log(url)
        return url + (url.indexOf("?") < 0 ? "?_xbox=true" : "&_xbox=true");
    },
     /**
     * 生成窗口主体
     * @private
     */
     _renderMock: function () {
		if (!this._mock){
			this._createMock();
		}           
        //显示时开始加载内容
        //mock通过回调函数获取
        this.makeContent();
	},
	/**
	 * 生成mock对象
	 * @private
	 */
	_createMock: function(){
		//main wrapper
		this._mock = $D.create("div", {
			"id": this.cfg.MOCK,
			"class": this.xboxClass.MOCK_CLASS,
			"style": {
				"visibility": "hidden",
				"display": ""
			},
			"appendTo": document.body,
			"innerHTML":'<div class="ui-xbox-action">'+this.closeLink+'</div><div class="ui-xbox-content"></div>'
        });        
        //取消外border
        if (!this.border) {
            this._mock.setStyle("border","none");
        }
         
         //向下兼容，以后避免使用title
        if (this.title && this.title !== "") {
            var a = $D.create("div", {
                "class": "xbox-caption",
                innerHTML: this.title,
                appendTo: this._mock
            });
        }			
	},
    /**
    * 生成窗体内容并初始化事件
    * @private
    */
	makeContent: function(){
		
	},	
   /**
    * 创建遮照层
    * @private
    * 
    */
    _renderOverlay: function () {
            //Define modal trigger
		var modal = this.cfg.OVERLAY;
        var _w = $D.getDocumentWidth() + 50 + 'px';
        var _h = $D.getDocumentHeight();
		$(this.cfg.OVERLAY) || this._createOverlayElem(_h);
		this._hackOverlayForIe6(_w,_h);
            
		this._coverSelectAndPassAliedit(_w,_h);
		this._fixJump();
		this._fixZIndexForFF();
    },
    /**
	 * 遮盖select(ie6)
     * 遮盖密码控件(Firefox)
     * @private
     */
	_coverSelectAndPassAliedit: function(_w,_h){
		if($(this.cfg.IFRAME_FIX)) {
			return;
		}
		this._overlay.setHtml(this._createOverlayHtml(_w,_h));
		//overwrite Modal trigger
        modal = this.cfg.IFRAME_FIX;
	},
	/**
	 * 创建遮罩iframe
	 * @private
	 */
	_createOverlayHtml: function(_w,_h){
		var ifr = [];
		ifr.push("<iframe id='"+this.cfg.IFRAME_FIX + "'");
		ifr.push("style='width: " + parseInt(_w) + "px; height:" + parseInt(_h) + "px;'");
		ifr.push("src=\"javascript:''\""+"></iframe>");
		return ifr.join(" ");
		//return "<iframe id='" + this.cfg.IFRAME_FIX + "' style='width: " + _w + "px; height:" + _h + "px' src='javascript:''></iframe>";
	},
	/**
	 * 创建遮罩元素
	 * @private
	 */
	_createOverlayElem: function(h){
		this._overlay = $D.create("div", {
			"id": this.cfg.OVERLAY,
            "class": this.xboxClass.OVERLAY_BG,
            "style": {
				"height": h + "px",
				"visibility": "hidden",
				"opacity": "0",
				"overflow": "hidden",
				"filter": "alpha(opacity=20)",
				/* IE */
				"-moz-opacity": "0"
				/* Moz + FF */
             },
             "appendTo": document.body
         });
	},
	/**
	 * TODO fetch browser
	 * Ugly fix
	 * 问题：Firefox 3.5.9 下z-index问题导致密码控件被 overlay iframe 遮住
	 * 解决：隐藏 iframe
	 * @private
	 */
	_fixZIndexForFF: function(){
		if (arale.isFF() && arale.browser.ver === "1.9.1.9") {
			$(this.cfg.IFRAME_FIX).setStyle("display","none");
		}else{
			this._fixZIndexForFF = function(){};
		}	
	},
	/**
	 * ie6&7 下滚动页面时控件跳动的问题,无奈－隐藏之
	 * note: 这里会隐藏 xbox:dom 中的控件，下面修复之
	 * @private
	 */
	_fixJump: function(){
		this._fixIe67aliedit({
			visibility:"hidden",
			opacity:"0",
			filter:"alpha(opacity = 0)"
		});
	},
	_hackOverlayForIe6: function(_w,_h){			
           //IE6 HACK
		if (arale.isIE6()) {		
          	 //IE6下隐藏滚动条
            if (!this.noScroll) {
	 			_w = "100%";
            }
            //重设overlay尺寸
			$(this.cfg.OVERLAY).setStyle({
				height:_h,
				width:_w
			});
		}
	},

	/**
	* 显示遮罩层
	* @private 
	*/
	_showOverlay: function () {
		var that = this, callback = function(){};
		$(this.cfg.OVERLAY).setStyle("visibility", "visible");
		//显示loading,不同类型可能有不同的实现
		this.showLoad();
        $(this.cfg.OVERLAY).fadeTo(200,0.2);			
     },
	/**
    * show loading
	* 默认什么都不做, 子类可以覆盖
    */
	showLoad: function () {
   	},
	/**
    * 隐藏overlay
    * @private
    */
	_hideOverlay: function () {
		//先移除事件
		var that = this;	
		$(this.cfg.OVERLAY).fadeTo(200,0.2,function(){
			 $(that.cfg.OVERLAY).dispose();
		});	
    },
    /**
     * 关闭xbox
     */
	hide: function(){
		//显示前面隐藏的控件
		//针对ie6&7
		this._fixIe67aliedit({
			visibility:"visible",
			opacity: "1",
			filter: "alpha(opacity = 100)"
		});
		//TODO 根据一个dom对象remove在他身上绑定的事件,xbox-mock,xbox-overlay
	    //delete DOM element
		this.cleanMock();
	   	this.cleanOverlay();
    	//delete global cache
    	aralex.xbox.Xbox.cache = {};
        //fix compatible old xbox
        if(this.isOld && AP.widget.xBox){
            AP.widget.xBox = null;
        }
	},
	/**
	 * 清除Mock对象
	 * @private
	 */
	cleanMock: function(){
		this._mock && this._mock.dispose();
		this._mock = null;
	},
	/**
	 * 清除overlay
	 * @private
	 */
	cleanOverlay: function(){
		var overlay =$("xbox-overlay");
		overlay && overlay.dispose();	
	},
	/**
	 * 针对ie,6,7控件,有多次fix
	 * TODO hidePWDEdit有一个这个东东给去掉了,因为用了一个全局缓存,等需要的时候在加上
	 * TODO 因为目前的version在ie6下面是4,ie8是6
	 * @private
	 */
	_fixIe67aliedit: function(style){
		var temp = function(){};
		if (arale.isIE6()|| arale.isFF()) {
			temp = function(style){
				try {
					var o = $A($$(".alieditContainer"));
					o.each(function(n){
						n.setStyle(style);
					});
				}catch(e){}
			};		
		}
		temp.call(this,style);
		this._fixIe67aliedit = temp;
	}
});
