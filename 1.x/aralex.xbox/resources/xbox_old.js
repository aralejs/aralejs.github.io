/**
* xBox v2.0.2
* 弹出层效果
* 说明：只有一个实例
* author: 李白
*/

/**
* xBox v2.0
* 
* @name AP.widget.xBox    
* @namespace
* @class
* @example 
* <xmp>
* new AP.widget.xBox({
*     el: D.query("#test_dom"),
*     type: "iframe",
*     modal: true,
*     autoShow: false,
*     value: function(o){
*     	return o.href
*     },
*     width: 600,
*     height: 400
* });
* </xmp>
* @demo "widget/xbox.html" 
* @notice 
* 关闭按钮接口, class: "xbox-close-link"
* @todo 1.modal 2.esc key
*/

(function () {
    AP.cache.xbox = {};
    
    var xBox = new AP.Class({

        options: {},

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

        /**
        * 自定义参数
        * @param {object}
        * @private
        */
        setOptions: function (option) {
            return AP.hashExtend({
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
                onShowEvent: false,
                onHideEvent: false,
                noScroll: false,
                fixed: false,
                load: false,
                loadsrc: AP.fn.url.img + "/global/loading.gif"
            }, option, true);
        },

        /**
        * 初始化配置参数
        * 
        */
        initialize: function (option) {
            var self = this;
            
            this.options = this.setOptions(option);

            //preload image
            this._preLoadImg();
            
            //绑定dom事件
            this._bindEvent();
            
            //Bind esc key
			E.on(document, "keyup", function(e) {
				if(E.getCharCode(e || window.event) == 27){ // close
					AP.widget.xBox.hide();
					try{
						parent.AP.widget.xBox.hide();
					}catch(e){}
				}	
			});

			//Bind HideEvent
			if (this.options.onHideEvent) 
				AP.cache.xbox.onHideEvent = this.options.onHideEvent;

			//Bind Resize Event
			/*
			E.on(window, "resize", function() {
			    if(AP.cache.xbox.r) clearTimeout(AP.cache.xbox.r);
		        AP.cache.xbox.r = setTimeout(function() {
		            self._fitIFR();
		        }, 300);
			});
			*/
        },
        
        /**
         * 图片预加载
         * 
         */
        _preLoadImg: function() {
            var img = new Image();
            img.src = this.options.loadsrc;
        },

        /**
         * 绑定事件
         * 
         */
        _bindEvent: function() {
            //为元素绑定事件
        	if(this.options.el !== false && this.options.el !== ""){
    		    E.on(this.options.el, "click", function(e, self) {
    		        self.fire.call(self, this, self);
    		        
    		        E.preventDefault(e);
    		    }, this);
    		}

            //为dom添加关闭按钮
            E.on(D.query(".xbox-close-link"), "click", function(e){
    	    	AP.widget.xBox.hide();
    	    	
    	    	E.preventDefault(e);
    	    });

        },

        /**
        * 获取窗体DOM,IFRAME URL,String
        */
        _makeValue: function () {
            var v = this.options.value,
                t = this.options.type;
            
            if (typeof(v) == "function") {
                return v.call(this, AP.cache.xbox.fireObject);
            }
            
            if (t === "iframe") {
                return v;
            } else {                
                if (/^[a-zA-Z]([^#.\s]*)[a-zA-Z0-9]$/.test(v))
                    return D.get(v);
                else if (/^[a-zA-Z#\.]*(\s?)(.*)[a-zA-Z0-9]$/.test(v))
                    return D.query(v)[0];
                else return v.toString();
            }
            //return ( ?  : (D.get(v) || D.query(v)[0] || v));
        },

        /**
        * add a param "_xbox=true" to url
        */
        _fixUrl: function (url) {//log(url)
            return url + (url.indexOf("?") < 0 ? "?_xbox=true" : "&_xbox=true");
        },

        /**
         * 获取对象类型
         * 
         */
        _getType: function(o) {
          var _t; return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
        },
                
        /**
         * 获取预设宽度
         * 
         */
        _getOptWidth: function() {
			var w;
			if (parent && parent.D.get("xbox-iframe") && (parent.D.get("xbox-iframe").getAttribute("auto-width") > 0)) 
				w = parent.D.get("xbox-iframe").getAttribute("auto-width");
			else
            	w = parseInt(this.options.width, 10);
				
			//save the value
			this.options.width = w;
			
			return w;
        },
        
        /**
         * 获取预设高度
         * 
         */
        _getOptHeight: function() {
            return parseInt(this.options.height, 10);
        },
        
        /**
         * 类型判断
         * @param 
         */
        _getType: function(o) {
          var _t; return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
        },
        
        /**
         * 获取Top值
         * @param {Object} 是否黄金分割
         * @param {Boolean} 是否为iframe
         * @return {Number}
         */
        _getNiceTop: function(isIFRAME) {
            var _el = D.get(this.cfg.MOCK),
                _el = this.options.type.toLowerCase() == "dom" ? _el.firstChild : _el,
                _scrollTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop, _top, _vh = D.getViewportHeight(), _nice;

                if (isIFRAME) {
            		_mH = parseInt((this._getIFRHeight() || D.getStyle(this.cfg.MOCK,'height')), 10);

                } else {
                    _mH = this._getWH(_el)[1];  
                }

				//获取合理top
				_top = _vh > _mH ? (0.382 * _vh - _mH / 2) : 50;
				//考虑scroll的情况
                _top = Math.max(50, _top) + _scrollTop; 
				//至少也留50px吧？
                _top = Math.max(50, _top);

    		return parseInt(_top, 10);
        },
        
        /**
         * 获取Left值
         * @param {Object} 是否黄金分割
         * @return {Number}
         */
        _getNiceLeft: function() {
            var _el = D.get(this.cfg.MOCK),
                _width = this._getWH(_el)[0],
                _left = (D.getViewportWidth() - 5 - _width) / 2;
    		return parseInt(_left, 10);
        },
        
        /**
         * 获取元素width, height
         * @param {HTMLDOMElement} 
         * @return {Array} [10,12]
         */
        _getWH: function(el) {
        	var el = typeof el == "string" ? document.getElementById(el) : el, W, H;

        	//change property
        	if (el.offsetWidth === 0 || el.offsetHeight === 0) {
        	    var es = el.style.display || "",
        		    ev = el.style.visibility || "", newEl;
        		
        		el.style.visibility = "hidden";
        		el.style.display = "block";

        	    //Clone Node when it is in an hidden context
        		//clone
        		newEl = document.createElement("div");
        		newEl.style.visibility = "hidden";
        		newEl.appendChild(el.cloneNode(true));
        		document.body.appendChild(newEl);

        		//override
        		el = newEl.firstChild;

        	    //Reset everything after value returned
        		try{
        			el.style.visibility = ev;
        			el.style.display = es;
        			document.body.removeChild(newEl);
        		}catch(e){}
            }
            
            //判断最大宽高是否超过最大值
            W = el.offsetWidth > this.options.maxWidth ? this.options.maxWidth : el.offsetWidth;
            H = el.offsetHeight > this.options.maxHeight ? this.options.maxHeight : el.offsetHeight;
            
            return [el.offsetWidth, el.offsetHeight];
        },

        /**
         * DOM加载后执行
         * 
         */
        _contentOnLoad: function(self){
     		self.hideLoad.call(self);

     	    var mock = D.get(this.cfg.MOCK), 
     	        el = this.options.type.toLowerCase() === "dom" ? mock : mock.firstChild, 
     	        WH = self._getWH(el);
            
     		//显示0.382
     		D.setStyles(self.cfg.MOCK, {
     		    //优先考虑手动设值，若为设置则动态获取
     		    "width": (self._getOptWidth() || WH[0]) + "px"
     		    //"height": (self._getOptHeight() || WH[1]) + "px"
     		    //"padding": "10px 10px 20px"
     		});

             //动态获取
     		D.setStyles(self.cfg.MOCK, {
     		    //动态获取
     		    "top": self._getNiceTop(false) + "px",
     		    "left": self._getNiceLeft() + "px",
     		    "visibility": "visible"
     		});            		
     		
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
            D.setStyle(this._mock, "top", this._getNiceTop(true) + "px"); 
            //定位初始高度
            D.setStyle(this.cfg.IFRAME, "height", this._getIFRHeight() + "px")
            
            //自适应AutoFit
            if (this.options.autoFit) this._autoFit();
            
            //显示
            D.setStyle(this._iframe, "visibility", "visible");
            D.setStyle(this._mock, "visibility", "visible");

            //Ugly Hack for Fx 3.0.15 
			//描述： 当 xbox 为 IFRAME 类型且 height 同 xbox-mock 相等时，IFRAME 内容被神秘区域遮盖。
			//解决方案： 当 xbox-iframe 高度超过 xbox-mock 时即可解决。 
			if (AP.env.browser.mozilla && AP.env.browser.v === "1.9.0.15") {
				
				if (document.location.host.indexOf("cashier") < 1) {
					//VIP
					//强制取消自适应
					//等待王磊页面中修复
					this.cfg.autoFit = false;	
				}
				D.get(this.cfg.IFRAME).style.height = parseInt(D.get(this.cfg.MOCK).style.height, 10) + 1 + "px";
	        }
            
            //为iframe添加关闭按钮
            try{
	            E.on(D.query(".xbox-close-link", D.get(this.cfg.IFRAME).contentWindow.document), "click", function(e){
	    	    	AP.widget.xBox.hide();
	    	    	E.preventDefault(e);
	    	    });
    	    }catch(e){}
        },
        
        /**
         * 定位mock
         * 
         */
        _fitIFR: function() {
			try{
				
    	 	   var el = D.get(this.cfg.MOCK);
            
	    		D.setStyles(this.cfg.MOCK, {
	    		    //iframe宽度优先级
	    		    //1.手动设置
	    		    //2.动态获取
	    		    //3.预设
	    		    "width": this._getOptWidth() + "px",
	    		    "height": this._getIFRHeight() + "px",
	    		    //动态获取
	    		    "left": ((D.getViewportWidth() - this.options.width) / 2) + "px"
	    		});
    		
	            //调整iframe高度
				D.setStyle(this.cfg.IFRAME, "width", this._getOptWidth() + "px");
	            D.setStyle(this.cfg.IFRAME, "height", this._getIFRHeight() + "px");
    		
	    		//高度超出屏幕时再调整top
	    		if (D.getStyle(this.cfg.MOCK, "height") + D.getStyle(this.cfg.MOCK, "top") > D.getViewportHeight()) {
	    		    D.setStyle(this.cfg.MOCK, "top",  this._getNiceTop(true) + "px");
	    		}
			}catch(e){}
        },
        
        /**
         * 自适应iframe高度
         * 
         */
        _autoFit: function() {
            try {
        		var self = this;
        		if(AP.cache.xbox.timer) clearInterval(AP.cache.xbox.timer);

       			AP.cache.xbox.timer = setInterval(function(){
                    self._fitIFR();
    			}, 75);
            } catch(e){}
        },
        
        /**
         * 获取iframe高度
         * @return {Number} iframe Content height
         */
        _getIFRHeight: function() {
            var iframe = D.get(this.cfg.IFRAME);

            try {
                var bHeight = iframe.contentWindow.document.body.scrollHeight,
                    dHeight = iframe.contentWindow.document.documentElement.scrollHeight,
                    ua = window.userAgent,
                    height = (ua.indexOf("safari") > -1 || ua.indexOf("chrome") > -1) ? Math.min(bHeight, dHeight) : Math.max(bHeight, dHeight);
					
					//fix autoFitBug
					//todo: the suitable value should to be measured by Test
					if (dHeight - bHeight > 100) {
						height = bHeight;
					}
					
					//调整最小高度
					if (parseInt(this.options.minHeight, 10) > 0 && this.options.minHeight > height) 
						height = this.options.minHeight;
console.log("height,",height);					
                return height;
            } catch (er) { }    
        },
        
        /**
        * 生成窗体内容并初始化事件
        */
        _makeContent: function () {
    
            switch (this.options.type.toLowerCase()) {
                
            /**
             * ifame 类型，
             * 创建时 visibility: hidden
             * 加载完成 visibility: visible && fire iframeOnLoad
             */
            case "iframe":
                //为iframe启用load
                this.options.load = true;
                
                this._iframe = Element.create("iframe", {
                    "id": this.cfg.IFRAME,
                    "name": this.cfg.IFRAME,
                    "frameBorder": "no",
                    "scrolling": "no",
                    "src": this._fixUrl(this._makeValue()),
                    "style": {
                        "visibility": "hidden",
                        "width": this._getOptWidth() + "px"
                        //"height": //this._getOptHeight() ? "auto" : this._getOptHeight() + "px"
                    }
                });
                
                E.on(this._iframe, "load", this._iframeOnLoad, this, true);
                
                this._mock.appendChild(this._iframe);
     
                break;
            
            /**
             * DOM类型弹出层
             */
            case "dom":
            
                //保存节点内容
                var _content = this._makeValue();
   
                //保存父节点信息以还原
                AP.cache.xbox.DOMParent = _content.parentNode;
                
                //append html
                this._mock.appendChild(_content);

            	//去掉loading
            	E.onContentReady(this.cfg.MOCK, this._contentOnLoad, this, true);
            	
                break;
            case "string":
            
                this._mock.innerHTML += this._makeValue();
                
                //去掉loading
            	E.onContentReady(this.cfg.MOCK, this._contentOnLoad, this, true);
                
                break;
            default:

                break;
            }
        },

        /**
        * 生成窗口主体
        * 
        */
        renderMock: function () {
            if (D.get(this.cfg.MOCK)) return;
            
            //main wrapper
            this._mock = Element.create("div", {
                "id": this.cfg.MOCK,
                "class": this.cfg.MOCK_CLASS,
                "style": {
                    "visibility": "hidden",
                    "display": ""
                },
                "appendTo": document.body
            });
            
            //取消外border
            if (!this.options.border) {
                this._mock.style.border = "none";
            }
            
            //向下兼容，以后避免使用title
            if (this.options.title && this.options.title !== "") {
                var a = Element.create("div", {
                    "class": "xbox-caption",
                    innerHTML: this.options.title,
                    appendTo: this._mock
                });
            }
            
            //显示时开始加载内容
            //mock通过回调函数获取
            this._makeContent();

        },

        /**
        * 显示窗体
        * 
        */
        showMock: function () {
            D.setStyle(this._mock, "visibility", "visible");
        },

        /**
         * 创建遮照层
         * 
         */
	    renderOverlay: function () {
             //Define modal trigger
             var modal = this.cfg.OVERLAY;
             var _w = document.body.scrollWidth > document.body.offsetWidth ? document.body.scrollWidth : document.body.offsetWidth + 50 + 'px';
             var _h = D.getDocumentHeight();

             if (!D.get(this.cfg.OVERLAY)) {
                 this._overlay = Element.create("div", {
                     "id": this.cfg.OVERLAY,
                     "class": this.cfg.OVERLAY_BG,
                     "style": {
						 "height": _h + "px",
                         "visibility": "hidden",
                         "opacity": "0",
                         "filter": "alpha(opacity=0)",
                         /* IE */
                         "-moz-opacity": "0"
                         /* Moz + FF */
                     },
                     "appendTo": document.body
                 });
             }

             //IE6 HACK
             if (AP.fn.browser.msie6) {

                 //IE6下隐藏滚动条
                 if (this.options.noScroll) {
                 } else {
                     _w = "100%";
                 }
                 /*
                 D.setStyles(document.body, {
                     height: "100%"
                 });
                 */

                 //重设overlay尺寸
                 D.setStyle(this.cfg.OVERLAY, "height", _h);
                 D.setStyle(this.cfg.OVERLAY, "width", _w);

             }

             //遮盖select(ie6)
             //遮盖密码控件(Firefox)
             if (!D.get(this.cfg.IFRAME_FIX)) {
                  this._overlay.innerHTML = "<iframe id=\"" + this.cfg.IFRAME_FIX + "\" style=\"width: " + _w + "px; height:" + _h + "px\" src=\"javascript:\'\'\"></iframe>";

                  //overwrite Modal trigger
                  modal = this.cfg.IFRAME_FIX;
             } 

  			 //ie6&7 下滚动页面时控件跳动的问题,无奈－隐藏之
			 //note: 这里会隐藏 xbox:dom 中的控件，下面修复之
  			 if (AP.env.browser.msie && AP.env.browser.v < 8 || AP.env.browser.mozilla === true) {
  			 	var o = D.query(".alieditContainer");
  			 	if (o.length > 0)
  			 	o.forEach(function(n){
					n.style.visibility = "hidden";
					n.style.opacity = "0"
					n.style.filter = "alpha(opacity = 0)";

  					//标记密码控件被隐藏
  					AP.cache.hidePWDEdit = true;
  				});
  			}


			//Ugly fix
			//问题：Firefox 3.5.9 下z-index问题导致密码控件被 overlay iframe 遮住
			//解决：隐藏 iframe
			if (AP.env.browser.mozilla && AP.env.browser.v === "1.9.1.9") {
				D.get(this.cfg.IFRAME_FIX).style.display = "none";
			}
        },

        /**
         * 显示遮罩层
         * 
         */
        showOverlay: function () {

            D.setStyle(this.cfg.OVERLAY, "visibility", "visible");

            var anim = new U.Anim(this.cfg.OVERLAY, {
                opacity: {
                    from: 0,
                    to: 0.2
                }
            },
            0.3);
			
            //显示loading
            if (this.options.type.toLowerCase() === "iframe") {
				var self = this;
				anim.onStart.subscribe(function(){
					self.showLoad();
				});
            }
            
			anim.animate();
        },

        /**
         * 隐藏overlay
         * @function
         */
        hideOverlay: function () {

            //先移除事件
            E.removeListener(this.cfg.OVERLAY);

            var hideAnim = new U.Anim(this.cfg.OVERLAY, {
                opacity: {
                    to: 0
                }
            },
            0.2);
            hideAnim.onComplete.subscribe(function () {
                Element.remove(this.cfg.OVERLAY);
            });
            hideAnim.animate();

        },

        /**
         * show loading
         * 
         */
        showLoad: function () {
            if (D.get(this.cfg.LOAD)) return;
            
            var _top = D.getViewportHeight() * 0.382;
    		//ie6 position fixed
    		if(AP.fn.browser.msie6){
    			_top += document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
    		}
    		
    		Element.create("div",{
    			id: this.cfg.LOAD,
    			innerHTML : "<img src='" + this.options.loadsrc + "' />",
    			style : {top: _top + "px", display: "block"},
    			appendTo: document.body
    		});
        },
        
        hideLoad: function() {
    		if(D.get(this.cfg.LOAD)){
    			Element.remove(this.cfg.LOAD);
    		}  
        },
        
        /**
         * 显示xbox
         * 
         */
        show: function() {
            var self = this;
            
            //准备DOM结构
            this.renderOverlay();
            this.renderMock();

			this.showOverlay.call(self);
            //this.showMock.call(self);
            
            //onShow
			//兼容写法，todo: delete it!
            if (this.options.onShow) {
                this.options.onShow.call(this);
            }
            if (this.options.onShowEvent) {
                this.options.onShowEvent.call(this);
            }
            
			//note:显示renderOverlay方法中被误杀的xbox:dom里的控件
			//2010.3.17
			var o = D.query("#xbox-mock .alieditContainer");
			if (o.length > 0)
			o.forEach(function(n){
				n.style.visibility = "visible";
				n.style.opacity = "1"
				n.style.filter = "alpha(opacity = 1)";
			});
		
			
        },
        
        hide: hidexBox,

        /**
         * 触发xbox
         * @param {Object} event || Event Handle Element
         * @param {Object} xBox Object
         * @param {Object} Param
         */	 
        fire: function(e, self){
            var env = self || this;
            //保存当前el,作为参数传递给 value: fn()
            //外部触发:
            //type=object/string
            //绑定触发:
            //element
            AP.cache.xbox.fireObject = e;
            
    		env.show.call(env, e, env);
    		if(e) E.preventDefault(e); 

        }
    });

    /**
     * 关闭xbox
     * 
     */
    function hidexBox () {
    	//clean calendar
    	//todo: opt
    	try{
    	    setTimeout(function(){
    	        D.setStyles(D.query("div.cal-calendar"), {"display": "none"});
    	    },0);
    	}catch(e){}
    	
        //clear autofit timeout
    	if(AP.cache.xbox.timer) clearInterval(AP.cache.xbox.timer);
	
    	//restore the dom element
    	if(AP.cache.xbox.DOMParent){
    	    var DOMtoRevert = D.get("xbox-mock").firstChild;
    	    //move to next when it was an caption
    	    if (D.hasClass(DOMtoRevert, "xbox-caption")) 
    	        DOMtoRevert = DOMtoRevert.nextSibling;
    		AP.cache.xbox.DOMParent.appendChild(DOMtoRevert);
    	}

		//显示前面隐藏的控件
		//针对ie6&7
		try {
			if (AP.env.browser.msie && AP.env.browser.v < 8 || AP.env.browser.mozilla === true) {
				var o = D.query(".alieditContainer");
				if (o.length > 0 && AP.cache.hidePWDEdit)
				o.forEach(function(n){
					n.style.visibility = "visible";
                    n.style.opacity = "1"
                    n.style.filter = "alpha(opacity = 100)";
					//标记密码控件被隐藏
					AP.cache.hidePWDEdit = true;
				});
			}
		}catch(e){}

    	//clear document.body keyup bind
    	E.removeListener(document, "keyup");
    	E.removeListener("xbox-mock");
    	E.removeListener("xbox-overlay");

	    //delete DOM element
	    var mock = D.get("xbox-mock");
	    var overlay = D.get("xbox-overlay");
	    if (mock) document.body.removeChild(mock);
	    if (overlay) document.body.removeChild(overlay)        
		
		//Fire onHideEvent
		try{
			if (AP.cache.xbox.onHideEvent) 
				AP.cache.xbox.onHideEvent.call();
		}catch(e){}

    	//delete global cache
    	AP.cache.xbox = {};
    }

    //Interface
    AP.widget.xBox = xBox;
    AP.widget.xBox.hide = hidexBox;
    
})();