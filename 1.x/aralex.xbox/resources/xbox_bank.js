arale.declare("aralex.xbox.Xbox",[aralex.Widget],{
	
    /**
    * 全局常量
    * 
    */
    cfg: {
        MOCK: "xbox-mock",
        MOCK_CLASS: "xbox-mock",
        LOAD: "xbox-load",
        IFRAME: "xbox-iframe",
        IFRAME_FIX: "xbox-hide-select",
        OVERLAY: "xbox-overlay",
        OVERLAY_BG: "xbox-overlay-bg"
    },
	el: "",
    //String|Array
    type: "string",
    //dom|iframe
    value: "",
    modal: true,
    //点击外部关闭
    width: 600,
    height: "",
    maxWidth: 800,
    maxHeight: 500,
	minHeight: null,
    autoFit: true,
    autoShow: false,
    border: true,
    beforeShow: false,
    beforeHide: false,
    noScroll: false,
    fixed: false,
    load: false,
	//原来的常量AP.fn.url.img,
    loadsrc:"http://img.alipay.net" + "/global/loading.gif",
	beforeCreate: function(){
		this._fixType();
		aralex.xbox.Xbox.cache = {};
	},
	postCreate: function(){
		//如果这个组件不需要id,我们也给生成一个唯一的id
		if(!this.id){
			this.id = arale.getUniqueId();
		}
		var that = this;
		this.aroundFn("show");
		this.aroundFn("hide");
		this.before("show",function(){
			that.setCurrentXbox();
		});
		this.before("show",function(){
			//TODO removeBind esc key
			 //Bind esc key
			//TODO 给提炼到一个函数中
			$E.connect(document, "keyup", function(e) {
				if(e.which == 27){ // close
					that.hide();
					//TODO 可能是如果是iframe的话,需要关闭父元素
				}	
			});
		});
		this.after("hide",function(){
			//TODO remoce esc event
		})
	},
	setCurrentXbox: function(){
		aralex.xbox.Xbox.cache.current = this;
	},
	_fixType: function(){
		//因为好多方法都去判断这个了,所以在初始化的时候给fix掉
		this.type = this.type.toLowerCase();
	},
	bind: function(){
		var that = this;
		//为指定的元素添加事件,来触发xbox的显示
		var el = this.el;
		if(!arale.isArray(this.el)){
			el = [el];
		}
		$A(el).each(function(elem){
			if(elem){
				$(elem).click(function(e){
					that.show();
		        	e.preventDefault();
				})
			}
		});	
	},
	
	/**
   	* 显示xbox
   	* 
    */
	show: function() {     
        //准备DOM结构
        this._renderOverlay();
        this._renderMock();
		this._showOverlay.call(this);
        this._fixAliedit();
    },
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
	hide: function(){
		this._cleaCalendar();
        //clear autofit timeout
    	if(aralex.xbox.Xbox.cache.timer) clearInterval(aralex.xbox.Xbox.cache.timer);
		this._restoreDom();
		//显示前面隐藏的控件
		//针对ie6&7
		this._fixIe67aliedit({
			visibility:"visible",
			opacity: "1",
			filter: "alpha(opacity = 100)"
		});
    	//clear document.body keyup bind
    	$E.disAllConnect(document, "keyup");
		//TODO 根据一个dom对象remove在他身上绑定的事件,xbox-mock,xbox-overlay

	    //delete DOM element
	    var mock = $("xbox-mock");
	    var overlay =$("xbox-overlay");
	    mock && mock.dispose();
		overlay && overlay.dispose();
    	//delete global cache
    	aralex.xbox.Xbox.cache = {};
	},
	_cleaCalendar: function(){
		//clean calendar
    	//todo: opt
    	try{
    	    setTimeout(function(){
				$D.setStyles($$("div.cal-calendar"),{"display": "none"});
    	    },0);
    	}catch(e){}		
	},
	restoreDom: function(){
		//restore the dom element
    	if(aralex.xbox.Xbox.cache.DOMParent){
    	    var DOMtoRevert = $("xbox-mock").first();
    	    //move to next when it was an caption
    	    if (DOMtoRevert.hasClass("xbox-caption")) {
				DOMtoRevert = DOMtoRevert.next();
			}	        
    		aralex.xbox.Xbox.cache.DOMParent.appendChild(DOMtoRevert.node);
    	}	
	},
	_fixIe67aliedit: function(style){
		var temp = function(){};
		//针对ie,6,7控件,有多次fix
		//TODO hidePWDEdit有一个这个东东给去掉了,因为用了一个全局缓存,等需要的时候在加上
		//TODO 因为目前的version在ie6下面是4,ie8是6
		if (arale.isIE6()|| arale.isFF()) {
			temp = function(style){
				try {
					var o = $A($$(".alieditContainer"));
					o.each(function(n){
						n.setStyle(style);
					});
				}catch(e){}
			}		
		}
		temp.call(this,style);
		this._fixIe67aliedit = temp;
	},  
    /**
     * 获取预设宽度
     * 
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
     * 
     */
    _getOptHeight: function() {
        return parseInt(this.height, 10);
    },   
    /**
     * 获取Top值
     * @param {Object} 是否黄金分割
     * @param {Boolean} 是否为iframe
     * @return {Number}
     */
    _getNiceTop: function(isIFRAME) {
        var _el = $(this.cfg.MOCK),
            _el = this.type == "dom" ? _el.first() : _el,
            _scrollTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop, _top, _vh = $D.getViewportHeight(), _nice;
        var _mH = this.getMh(_el);
		//获取合理top
		_top = _vh > _mH ? (0.382 * _vh - _mH / 2) : 50;
		//考虑scroll的情况
		_top = Math.max(50, _top) + _scrollTop; 
			//至少也留50px吧？
		_top = Math.max(50, _top);

		return parseInt(_top, 10);
    },
	getMh: function(_el){
		var _mh;
		if (isIFRAME) {
    		_mH = parseInt((this._getIFRHeight() || $(this.cfg.MOCK).getStyle('height')), 10);
        } else {
            _mH = this._getWH(_el)[1];  
        }	
		return _mh;
	},
	/**
      * 获取Left值
      * @param {Object} 是否黄金分割
      * @return {Number}
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
      */
	_getWH: function(el) {
		var region = $(el).region();
        return [region.width, region.height];
	},
	_addCloseToIfr: function(){
		var that = this;
		//为iframe添加关闭按钮		
		//TODO 当$用于iframe的时候,是否能this.node指向的是document
		//TOOD $$返回的结果支持click
           try{
			$$(".xbox-close-link",$(this.cfg.IFRAME)).click(function(e){
				that.hide();
				e.preventDefault();
			});
   	    }catch(e){}
	},
	/**
       * 定位mock
       * 
       */
	_fitIFR: function() {
		try{				
			var el = $(this.cfg.MOCK),iframe = $(this.cfg.IFRAME);           
   			el.setStyle({
   		    	//iframe宽度优先级
	   		    //1.手动设置
	   		    //2.动态获取
	   		    //3.预设
	   		    "width": this._getOptWidth() + "px",
	   		    "height": this._getIFRHeight() + "px",
	   		    //动态获取
	   		    "left": (($D.getViewportWidth() - this.width) / 2) + "px"
   			});
        	//调整iframe高度
  			iframe.setStyle({
				"width": this._getOptWidth() + "px",
				"height": this._getIFRHeight() + "px"
			});

   		//高度超出屏幕时再调整top
   			if (el.getStyle("height") + el.getStyle("top") > $D.getViewportHeight()) {
   		    	el.setStyle("top",  this._getNiceTop(true) + "px");
   			}
		}catch(e){}
	},     
    /**
    * 自适应iframe高度
    * 
    */
	_autoFit: function() {
		var that = this;
		try {
   			if(aralex.xbox.Xbox.cache.timer){
				clearInterval(aralex.xbox.Xbox.cache.timer);
			}
  			aralex.xbox.Xbox.cache.timer = setInterval(function(){
                that._fitIFR();
			}, 75);
       	}catch(e){}
	},
        
    /**
     * 获取iframe高度
     * @return {Number} iframe Content height
     */
    _getIFRHeight: function() {
        var iframe = $(this.cfg.IFRAME).node;
        try {
            var bHeight = iframe.contentWindow.document.body.scrollHeight,
                dHeight = iframe.contentWindow.document.documentElement.scrollHeight,
                height = (arale.isSafari() || arale.isChrome()) ? Math.min(bHeight, dHeight) : Math.max(bHeight, dHeight);	
				//fix autoFitBug
				//todo: the suitable value should to be measured by Test
			if (dHeight - bHeight > 100) {
				height = bHeight;
			}
	
			//调整最小高度
			if (parseInt(this.minHeight, 10) > 0 && this.minHeight > height){
				height = this.minHeight;
			}
            return height;
        } catch (er) { }    
    },

	/**
    * 获取窗体DOM,IFRAME URL,String
    */
    _makeValue: function () {
        var v = this.value,t = this.type;    
		//这个是干啥用的?为什么会有这种情况
        if (typeof(v) == "function") {
            return v.call(this, aralex.xbox.Xbox.cache.fireObject);
        }      
        if (t === "iframe") {
            return v;
        } else {                
            if (this._isId(v)){
		    	return $(v);
			}else if(this._isCssExp(v)){
				return $$(v)[0];
			}else{
				return v.toString();
			}
        }
    },
	_isId: function(id){
		//是不是一个合法的id
		return /^[a-zA-Z]([^#.\s]*)[a-zA-Z0-9]$/.test(id);
	},
	_isCssExp: function(exp){
		//是不是一个合法的css表达式
		return /^[a-zA-Z#\.]*(\s?)(.*)[a-zA-Z0-9]$/.test(v);
	},
    /**
    * add a param "_xbox=true" to url
    */
    _fixUrl: function (url) {//log(url)
        return url + (url.indexOf("?") < 0 ? "?_xbox=true" : "&_xbox=true");
    },

     /**
     * 生成窗口主体
     * 
     */
     _renderMock: function () {
		if ($(this.cfg.MOCK)) return;
         
         //main wrapper
		this._mock = $D.create("div", {
			"id": this.cfg.MOCK,
			"class": this.cfg.MOCK_CLASS,
			"style": {
				"visibility": "hidden",
				"display": ""
			},
			"appendTo": document.body
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
        //显示时开始加载内容
        //mock通过回调函数获取
        this._makeContent();
	},
	
    /**
    * 生成窗体内容并初始化事件
    */
    _makeContent: function () {
		//type iframe,dom,string
		if(!this.type)return;
		var fn = this["_make"+$S(this.type).capitalize()+"Content"];
		fn && fn.call(this);
    },
   	/**
    * ifame 类型，
    * 创建时 visibility: hidden
    * 加载完成 visibility: visible && fire iframeOnLoad
    */
	_makeIframeContent: function(){
		var that = this;
		//为iframe启用load
		this.load = true;  
        this._iframe = $D.create("iframe", {
			"id": this.cfg.IFRAME,
            "name": this.cfg.IFRAME,
            "frameBorder": "no",
            "scrolling": "no",
            "src": this._fixUrl(this._makeValue()),
            "style": {
 				"visibility": "hidden",
				"width": this._getOptWidth() + "px"
             },
			"callback": arale.hitch(this,"_iframeOnLoad")
         });       
         this._mock.node.appendChild(this._iframe.node);	
	},
	/**
    * iframe加载后执行
    * @param {Object} e
    * @param {Object} self
    */
	_iframeOnLoad: function(e, self) {
           //关闭loading
		this.hideLoad();    
        //定位mock
        this._fitIFR();
        //初始化时定位top
        $(this._mock).setStyle("top", this._getNiceTop(true) + "px");
        //定位初始高度
        $(this.cfg.IFRAME).setStyle("height", this._getIFRHeight() + "px")
        //自适应AutoFit
        if (this.autoFit) this._autoFit();
        //显示
        $(this._iframe).setStyle("visibility", "visible");
        $(this._mock).setStyle("visibility", "visible");
		//TODO有一段代码是fix fx3.0.15,的给去掉了,等遇到了在加上,具体参看原有代码
		this._addCloseToIfr();
    },
	/**
    * DOM类型弹出层
    */
	_makeDomContent: function(){
          //保存节点内容
		var _content = this._makeValue();
           //保存父节点信息以还原
		aralex.xbox.Xbox.cache.DOMParent = _content.parent();

           //append html
		this._mock.adopt(_content.node);

       	//去掉loading
		this._contentOnLoad();	
		this._bindClose();
	},
	_bindClose: function(){
	 //为dom添加关闭按钮
		var that = this;
		$A($$(".xbox-close-link")).each(function(elem){
			elem.click(function(e){
				that.hide();
				e.preventDefault();
			});
		});
	},
	_makeStringContent: function(){
		this._mock.innerHTML += this._makeValue();                
           //去掉loading
        this._contentOnLoad();
	},
	/**
    * DOM加载后执行
    * 
    */
	_contentOnLoad: function(){
	    var mock = $(this.cfg.MOCK), 
	        el = this.type === "dom" ? mock : mock.first(), 
	        WH = this._getWH(el);     
		//显示0.382
		$(this.cfg.MOCK).setStyle({
		    //优先考虑手动设值，若为设置则动态获取
		    "width": (this._getOptWidth() || WH[0]) + "px"
		});
        //动态获取
		$(this.cfg.MOCK).setStyle({
		    //动态获取
		    "top": this._getNiceTop(false) + "px",
		    "left": this._getNiceLeft() + "px",
		    "visibility": "visible"
		});          		
	},
   /**
    * 创建遮照层
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
	_coverSelectAndPassAliedit: function(_w,_h){
		//遮盖select(ie6)
        //遮盖密码控件(Firefox)
		if($(this.cfg.IFRAME_FIX))return;
		
		this._overlay.setHtml(this._createOverlayHtml(_w,_h));
                 //overwrite Modal trigger
        modal = this.cfg.IFRAME_FIX;
	},
	_createOverlayHtml: function(_w,_h){
		return "<iframe id='" + this.cfg.IFRAME_FIX + "' style='width: " + _w + "px; height:" + _h + "px' src='javascript:''></iframe>";
	},
	_createOverlayElem: function(h){
		this._overlay = $D.create("div", {
			"id": this.cfg.OVERLAY,
            "class": this.cfg.OVERLAY_BG,
            "style": {
			"height": h + "px",
                 "visibility": "hidden",
                 "opacity": "0",
                 "filter": "alpha(opacity=20)",
                 /* IE */
                 "-moz-opacity": "0"
                 /* Moz + FF */
             },
             "appendTo": document.body
         });
	},
	_fixZIndexForFF: function(){
		//TODO fetch browser
		//Ugly fix
		//问题：Firefox 3.5.9 下z-index问题导致密码控件被 overlay iframe 遮住
		//解决：隐藏 iframe
		if (arale.isFF() && arale.browser.ver === "1.9.1.9") {
			$(this.cfg.IFRAME_FIX).setStyle("display","none");
		}else{
			this._fixZIndexForFF = function(){};
		}	
	},
	_fixJump: function(){
		 //ie6&7 下滚动页面时控件跳动的问题,无奈－隐藏之
		 //note: 这里会隐藏 xbox:dom 中的控件，下面修复之
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
	* 
	*/
	_showOverlay: function () {
		var that = this, callback = function(){};
		$(this.cfg.OVERLAY).setStyle("visibility", "visible");
		//显示loading
        if (this.type === "iframe") {
			this.showLoad();
        }
        $(this.cfg.OVERLAY).fadeTo(200,0.2);			
     },

	/**
    * 隐藏overlay
    * @function
    */
	_hideOverlay: function () {
		//先移除事件
		var that = this;	
		$(this.cfg.OVERLAY).fadeTo(200,0.2,function(){
			 $(that.cfg.OVERLAY).dispose();
		});	
     },

	/**
    * show loading
    * 
    */
	showLoad: function () {
		if ($(this.cfg.LOAD)) return;
       
		var _top = $D.getViewportHeight() * 0.382;
		//ie6 position fixed
		if(arale.isIE6()){
			_top += document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
		}
	
		$D.create("div",{
			id: this.cfg.LOAD,
			innerHTML : "<img src='" + this.loadsrc + "' />",
			style : {top: _top + "px", display: "block"},
			appendTo: document.body
		});
   	},
    hideLoad: function() {
		if($(this.cfg.LOAD)){
 			$(this.cfg.LOAD).dispose();
 		}    		
    }
});
