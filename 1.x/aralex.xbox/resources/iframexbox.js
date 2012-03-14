exports.IframeXbox = declare("aralex.xbox.IframeXbox", [exports.Xbox], {
    /** @lends aralex.xbox.IframeXbox.prototype */
    
    /**
     * xbox类型. 用来表明, 不可覆盖
     * @type String
     * @default 'iframe'
     */
	type:"iframe",
	/**
	 * 原来的常量AP.fn.url.img. 提示加载logo
	 */
    loadsrc:"http://img.alipay.net" + "/global/loading.gif",
	/**
    * 需要一个最小高度,在iframe下有自己的实现方式
    */
	getMh: function(_el){
		return parseInt((this._getIFRHeight() || $(this.cfg.MOCK).getStyle('height')), 10);
	},
    /**
    * 生成窗体内容并初始化事件,这个是最主要的方法
    * @private
    */
    makeContent: function () {
		var that = this;
		//为iframe启用load
		this.load = true;  
        this._iframe = $D.create("iframe", {
			"id": this.cfg.IFRAME,	
			"name": this.cfg.IFRAME + new Date().getTime(),
            "frameBorder": "no",
            "scrolling": "no",
            "src": this._fixUrl(this.makeValue()),
            "style": {
 				"visibility": "hidden",
				"width": this._getOptWidth() + "px"
             },
			"callback": arale.hitch(this,"_iframeOnLoad")
         });    
         this._mock.last('div').node.appendChild(this._iframe.node);
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
        //HACK
        if(!$(this._mock)){
            return;
        }
        $(this._mock).setStyle("top", this._getNiceTop(true) + "px");
        //定位初始高度
        this._iframe.setStyle("height", this._getIFRHeight() + "px")
        //自适应AutoFit
        if (this.autoFit) this._autoFit();
        //显示
        $(this._iframe).setStyle("visibility", "visible");
        $(this._mock).setStyle("visibility", "visible");

		//TODO有一段代码是fix fx3.0.15,的给去掉了,等遇到了在加上,具体参看原有代码
		//this._addCloseToIfr();
    },
	/**
     * 定位mock
     * 
    */
	_fitIFR: function() {
		try{				
			var el = this._mock,iframe = this._iframe;          
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
    * @private
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
	 * 添加关闭按钮
	 * @private
	 */
	_addCloseToIfr: function(){
		var that = this;
		//为iframe添加关闭按钮		
		//TODO 当$用于iframe的时候,是否能this.node指向的是document
		//TOOD $$返回的结果支持click
           try{
			$$(".xbox-close-link",this._iframe).click(function(e){
				that.hide();
				e.preventDefault();
			});
   	    }catch(e){}
	},

    /**
     * 保存前一次的body和documentElement的高度
     * @private
     */
	_temp: {
		bHeight:null,
		dHeight:null
	},
    
    /**
     * 获取iframe高度
     * @return {Number} iframe Content height
     * @private
     */
    _getIFRHeight: function() {
        var iframe = this._iframe.node;
        try {
            var bHeight = iframe.contentWindow.document.body.scrollHeight,
				dHeight = iframe.contentWindow.document.documentElement.scrollHeight,
				height;
			//重构判断逻辑，若body高度变化，则修改dHeight -  偏右
			if(this._temp.dHeight != null && dHeight == this._temp.dHeight) {
				dHeight = dHeight - (this._temp.bHeight - bHeight);
			}
			height = (arale.isSafari() || arale.isChrome() || arale.isFF()) ? Math.min(bHeight, dHeight) : Math.max(bHeight, dHeight);
			this._temp.bHeight = bHeight;
			this._temp.dHeight = dHeight;
			//fix autoFitBug
			//todo: the suitable value should to be measured by Test
			//2011-11-15 100 > 79, 偏右测试，下面这段逻辑作废
			/*
			if (dHeight - bHeight > 79) {
				height = bHeight;
			}
			*/
			//调整最小高度
			if (parseInt(this.minHeight, 10) > 0 && this.minHeight > height){
				height = this.minHeight;
			}
            return height;
        } catch (er) {
			return this.height;
		}    
    },

	/**
    * 获取窗体DOM,IFRAME URL,String
    * @private
    */
    makeValue: function () {
      	var v = this.value;    
		//这个是干啥用的?为什么会有这种情况
		if (arale.isFunction(v)) {
            return v.call(this, aralex.xbox.Xbox.cache.fireObject);
        }            
		return v;
    },	

	/**
    * show loading
    * @private 
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
   	/**
   	 * 隐藏loading
   	 * @private
   	 */
    hideLoad: function() {
		if($(this.cfg.LOAD)){
 			$(this.cfg.LOAD).dispose();
 		}    		
    },
    /**
     * 清除Mock对象
     * @private
     */
	cleanMock: function(){
		var ifr = this._iframe;
		ifr && ifr.dispose();
		this._iframe = null;
		this.parent(arguments);
		if(aralex.xbox.Xbox.cache.timer){
			clearInterval(aralex.xbox.Xbox.cache.timer);
		}
	}
});
