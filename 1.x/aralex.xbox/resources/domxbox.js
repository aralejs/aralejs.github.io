exports.DomXbox = declare("aralex.xbox.DomXbox", [exports.Xbox], {
    /**
     * xbox类型
     * @type String
     * @default 'dom'
     * @private
     */
	type: "dom",
    fullScreen: false,
    /**
     * 初始化dom
     * @private
     */
	initDom: function(){
		//原来的domNode从原来的地方插入到mock中,然后在关闭的时候还需要把这个部分归位,目前应该没有这个必要,所以不要了
		//然后并且把这个node作为我们的domNode因为有些事件是绑定在他上面的
		this.domNode = this.makeValue();
		//我们需要把这个节点从原有的文档结构中孤立起来
		this.domParent = this.domNode.parent();
		this.domNode.dispose();
		/**
			this.domNode = document.body
			this.contentNode = this.makeValue();
			//我们需要把这个节点从原有的文档结构中孤立起来
			this.contentNode.dispose();
			**/
	},
	/**
    * DOM类型弹出层
    * @private
    */
	makeContent: function(){
		if(!this.domNode) {
			this.initDom();
		}
		//append html
		this._mock.last('div').adopt(this.domNode.node);
		this._contentOnLoad();	
	},
	/**
    * DOM加载后执行
    * 
    */
	_contentOnLoad: function(){
	    var mock = $(this.cfg.MOCK), 
	        el = this.type === "dom" ? mock : mock.first(), 
	        WH = this._getWH(el), optWidth = ( parseInt(this.width, 10) || WH[0]);
			//2010-12-2由于原来获取getOptWidth需要判断父元素，l理论上domxbox不应该考虑parent的事情
			//所所以不需要getOptWidth这个方法了
	        //WH = this._getWH(el), optWidth = (this._getOptWidth() || WH[0]);
		//显示0.382
        //动态获取
		var niceTop = this._getNiceTop(false) + "px", niceLeft = this._getNiceLeft(optWidth) + "px";


		mock.setStyle({
		  //优先考虑手动设值，若为设置则动态获取
		    "width": optWidth + "px",
			"height": "auto",
		    //动态获取
			"top": niceTop,
			"left": niceLeft,
		   	"visibility": "visible"
		});
		//this.._overlay.	

		if(this.isNeedOverlayIframe && arale.isIE6() && !this.fullScreen) {
		    var fix = this.cfg.IFRAME_FIX;
		    setTimeout(function() {
			    var height = ($(mock).region().height) + 'px';
                $(fix).setStyle({
                    "width": optWidth + "px",
                    "height": height,
                     //动态获取
                     "top": niceTop, 
                     "left": niceLeft,
                     'position': 'absolute',
                    'zIndex': 10000
                 });
		    }, 50);
		}
	},
	/*
	 * adjust xbox position
	 * @private
	 */
	adjustPos: function(top, left) {
		var mock = $(this.cfg.MOCK), 
	        el = this.type === "dom" ? mock : mock.first(), 
	        WH = this._getWH(el), optWidth = ( parseInt(this.width, 10) || WH[0]);
			//2010-12-2由于原来获取getOptWidth需要判断父元素，l理论上domxbox不应该考虑parent的事情
			//所所以不需要getOptWidth这个方法了
	        //WH = this._getWH(el), optWidth = (this._getOptWidth() || WH[0]);
		//显示0.382
        //动态获取
		var niceTop = (top || this._getNiceTop(false)) + "px", niceLeft = (left || this._getNiceLeft(optWidth)) + "px";


		mock.setStyle({
		  //优先考虑手动设值，若为设置则动态获取
		    "width": optWidth + "px",
			"height": "auto",
		    //动态获取
			"top": niceTop,
			"left": niceLeft,
		   	"visibility": "visible"
		});
		//this.._overlay.	
		if(this.isNeedOverlayIframe && arale.isIE6()) {
			var height = mock.getStyle('top');
			$(this.cfg.IFRAME_FIX).setStyle({
				"width": optWidth + "px",
				"height": parseInt(height) + 30 + "px",
		   		 //动态获取
		   		 "top": niceTop, 
				 "left": niceLeft,
				 'position': 'absolute'
			 });
		}

	},
	/**
	 * 获取合适的宽度
	 * @private
	 */
	_getNiceLeft: function(width) {
        return parseInt(($D.getViewportWidth() - 5 - width) / 2, 10);
	},
	/**
	 * 清楚Mock对象
	 * @private
	 */
	cleanMock: function(){
		this.parent(arguments);
		this.domNode.dispose();
	},
	/**
	 * 显示xbox
	 */
	show: function(){
       		//由于未知原因,可能会出现两个mock内容,现在进行控制,如果当前页面mock已经存在,那么将不执行新的xbox渲染
		if($(this.cfg.MOCK)){
			return;
		}
        this.parent(arguments);

		this.domNode.setStyle("display",'block');
	},
	/**
	 * 关闭xbox
	 */
	hide: function() {
		this.parent(arguments);
		this.domNode.setStyle("display",'none');
		this.domNode.dispose();
		this.domParent && this.domParent.adopt(this.domNode);
		this.domNode = null;
	}
});
