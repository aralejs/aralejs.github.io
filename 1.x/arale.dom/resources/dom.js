/**
 * @name arale.dom
 * @namespace
 * Dom操作模块，可以对dom进行创建，遍历，插入等
 * @description
 * arale.dom 封装了主要针对document, window的一些操作方法，另外少许对HTMLElement操作的方法，更多对dom操作的方法以及链式操作 具体请参见 { @link arale.Node }
 */
var $H = require('arale.hash');

var $D,
    $ = exports.$,
    $$ = exports.$$;
arale.module("arale.dom", (function(){
	

	var isIE     = arale.browser.Engine.trident;
	var isOpera  = arale.browser.Engine.presto;
	var isSafari = arale.browser.Engine.webkit;
	var isBody   = function(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	}
	
	// 支持 _toDom 这个方法
	var tagWrap = {
			option: ["select"],
			tbody: ["table"],
			thead: ["table"],
			tfoot: ["table"],
			tr: ["table", "tbody"],
			td: ["table", "tbody", "tr"],
			th: ["table", "thead", "tr"],
			legend: ["fieldset"],
			caption: ["table"],
			colgroup: ["table"],
			col: ["table", "colgroup"],
			li: ["ul"]
		},
		reTag = /<\s*([\w\:]+)/,
		masterNode = {}, masterNum = 0,
		masterName = "__araleToDomId";

	// generate start/end tag strings to use
	// for the injection for each special tag wrap case.
	for(var param in tagWrap){
		var tw = tagWrap[param];
		tw.pre  = param == "option" ? '<select multiple="multiple">' : "<" + tw.join("><") + ">";
		tw.post = "</" + tw.reverse().join("></") + ">";
		// the last line is destructive: it reverses the array,
		// but we don't care at this point
	}
	var specialAttr = $H({
		appendTo: function(node,value){
			value.appendChild(node.node);
		},
		innerHTML: function(node,value){
			node.setHtml(value);
		},
		style: function(node,value){
			node.setStyle(value);
		},
		"class": function(node,value){
			node.addClass(value);
		}
	});
	/** @lends arale.dom */
	var exportsObject = {
		/**
         * 获取元素可见区域的高度
         * @param {HTMLElement} [element] 元素对象，为空则默认返回document的可见区域高度
         * @example
         * $D.getViewportHeight($('node1'));
         * @returns {Number} 元素可见区域高度
         */
		getViewportHeight : function(element) {
			element = element || window;
			element = element.node ? element.node : element;
			if(element == window || element == document || isBody(element)){
		    	var height = self.innerHeight, // Safari, Opera
	                mode = document['compatMode'];
	            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
	                height = (mode == 'CSS1Compat') ?
	                        document.documentElement.clientHeight : // Standards
	                        document.body.clientHeight; // Quirks
	            }
				return height;
			}
			
			return element.offsetHeight;
        },
		
		/**
         * 获取元素可见区域的宽度
         * @param {HTMLElement} [element] 元素对象，为空则默认返回document的可见区域宽度
         * @example
         * $D.getViewportWidth($('node1'));
         * @returns {Number} 元素可见区域宽度
         */
		getViewportWidth : function(element) {
			element = element || window;
			element = element.node ? element.node : element;
			if(element == window || element == document || isBody(element)){
		    	var width = self.innerWidth,  // Safari
	                mode = document['compatMode'];

	            if (mode || isIE) { // IE, Gecko, Opera
	                width = (mode == 'CSS1Compat') ?
	                        document.documentElement.clientWidth : // Standards
	                        document.body.clientWidth; // Quirks
	            }
				return width;
			}
			return element.offsetWidth;
        },
		
		/**
         * 获取元素实际高度(scroll在内)
         * @param {HTMLElement} [element] 元素对象，为空则默认返回document的实际高度
         * @example
         * $D.getDocumentHeight($('node1'));
         * @returns {Number} 元素实际高度(scroll在内)
         */
		getDocumentHeight : function(element) {
			element = element || window;
			element = element.node ? element.node : element;
			if(element == window || element == document || isBody(element)){
            	var scrollHeight = (document['compatMode'] != 'CSS1Compat' || isSafari) ? document.body.scrollHeight : document.documentElement.scrollHeight,
	                h = Math.max(scrollHeight, $D.getViewportHeight());

	            return h;
			}
			
			return element.scrollHeight;
        },
		
		/**
         * 获取元素实际宽度(scroll在内)
         * @param {HTMLElement} [element] 元素对象，为空则默认返回document的实际宽度
         * @example
         * $D.getDocumentWidth($('node1'));
         * @returns {Number} 元素实际宽度(scroll在内)
         */
        getDocumentWidth : function(element) {
			element = element || window;
			element = element.node ? element.node : element;
			if(element == window || element == document || isBody(element)){	
            	var scrollWidth = (document['compatMode'] != 'CSS1Compat' || isSafari) ? document.body.scrollWidth : document.documentElement.scrollWidth,
	                w = Math.max(scrollWidth, $D.getViewportWidth());
				return w;
			}
            return element.scrollWidth;
        },
		
		/**
         * 获取元素scroll当前位置
         * @param {HTMLElement} [element] 元素对象，为空则默认返回document的scroll当前位置
         * @example
         * $D.getScroll($('node1'));
         * @returns {Object} 类似{left : 10, top : 10}，指示scroll位置
         */
		getScroll : function(element) {
		    element = element || document;
			element = element.node ? element.node : element;
			if(element == window || element == document || isBody(element)){	
            	return {
					left : Math.max(document['documentElement'].scrollLeft, document.body.scrollLeft),
					top  : Math.max(document['documentElement'].scrollTop, document.body.scrollTop)
				}
			}
			return {left : element.scrollLeft, top : element.scrollTop};
        },
		
		/**
         * 获取元素scroll当前位置(其所有父元素的scroll累加)
         * @param {HTMLElement} [element] 元素对象，为空则默认返回document的scroll当前位置(其所有父元素的scroll累积)
         * @example
         * $D.getScrolls($('node1'));
         * @returns {Object} 类似{left : 10, top : 10}，指示scroll当前位置(其所有父元素的scroll累加)
         */
		getScrolls: function(element){
		    element = element || document;
			element = element.node ? element.node : element;
            var position = {left : 0, top : 0};
            while (element && ! isBody(element)){
                position.left += element.scrollLeft;
                position.top += element.scrollTop;
                element = element.parentNode;
            }
            return position;
        },

		/**
         * 获取元素相对当前窗口的坐标
         * @param {HTMLElement} [element] 元素对象
         * @example
         * $D.getOffsets($('node1'));
         * @returns {Object} 类似{left : 10, top : 10}，指示元素相对当前窗口的坐标
         */
		getOffsets : function(element) {
			element = element.node ? element.node : element;
		    var getNextAncestor = function(node){
		    	var actualStyle;
			    if( window.getComputedStyle ) {
			      actualStyle = getComputedStyle(node,null).position;
			    } else if( node.currentStyle ) {
			      actualStyle = node.currentStyle.position;
			    } else {
			      actualStyle = node.style.position;
			    }
			    if( actualStyle == 'absolute' || actualStyle == 'fixed' ) {
			      return node.offsetParent;
			    }
			    return node.parentNode;
		   }
		   if( typeof( element.offsetParent ) != 'undefined' ) {
		    	var originalElement = element;
			    for( var posX = 0, posY = 0 ; element; element = element.offsetParent ) {
			      posX += element.offsetLeft;
			      posY += element.offsetTop;
			    }
			    if( !originalElement.parentNode || !originalElement.style || typeof( originalElement.scrollTop ) == 'undefined' ) {
			      return {left : posX, top : posY };
			    }
			    element = getNextAncestor(originalElement);
			    while( element && element != document.body && element != document.documentElement ) {
			      posX -= element.scrollLeft;
			      posY -= element.scrollTop;
			      element = getNextAncestor(element);
			    }
			    return { left : posX, top : posY };
		   } else {
		    	return { left : element.x, top : element.y };
		   }
		},
		
		/**
         * 获取元素相对坐标
         * @param {HTMLElement} element 元素对象
         * @param {HTMLElement} [relative] 相对元素，默认为offsetParent
         * @example
         * $D.getPosition($('node1'));
         * @returns {Object} 类似{left : 10, top : 10}，指示元素相对坐标
         */
		getPosition : function(element, relative){
			if(!element) return null;
			element = element.node ? element.node : element;
            relative = relative || $D.getOffsetParent(element);
			if (isBody(element)) return {left : 0, top : 0};
            var offset = $D.getOffsets(element),
                scroll = $D.getScrolls(element);
		
            var position = {
                left : parseInt(offset.left) - parseInt(scroll.left),
                top  : parseInt(offset.top) - parseInt(scroll.top)
            };
            var relativePosition = (relative) ? $D.getPosition(relative) : {left : 0, top : 0};
            return {left : parseInt(position.left) - parseInt(relativePosition.left), top : parseInt(position.top) - parseInt(relativePosition.top)};    
        },

		getComputedStyle: function(node, property){
            node = node.node || node;
			if (node.currentStyle) return node.currentStyle[$S(property).camelCase()];
			var computed = node.ownerDocument.defaultView.getComputedStyle(node, null);
			return (computed) ? computed[$S(property).camelCase()] : null;
		},
		
		/**
         * 获取元素的offsetParent
         * @param {HTMLElement} [element] 元素对象
         * @example
         * $D.getOffsetParent($('node1'));
         * @returns {HTMLElement|null} 元素的offsetParent
         */
		getOffsetParent: function(element){
			element = element.node ? element.node : element;
			if (isBody(element)) return null;
			if (!arale.isIE()) return element.offsetParent;
			while ((element = element.parentNode) && !isBody(element)){
				if (arale.dom.getComputedStyle(element, 'position') != 'static') return element;
			}
			return null;
		},
		/**
         * 转换一个html 字符串为 dom节点
         * @param {String} frag html字符串片段
         * @example
         * $D.toDom($('&lt;div id="div1"&gt;&lt;div&gt;'));
         * @returns {HTMLElement} 生成的DOM元素
         */
		toDom: function(frag){
			var master = this._getMaster(frag);
			if(master.childNodes.length == 1){	
				return master.removeChild(master.firstChild); // DOMNode
			}else{		
				var elem = master.removeChild(master.firstChild);
				while(elem.nodeType == 3){
					elem = master.removeChild(master.firstChild);
				}
				return elem;
			}
			//因为现在不可能有这这种情况,先不考虑,所以直接返回
			// 把多个节点作为一个documentFragment返回
			/*
			df = doc.createDocumentFragment();
			while(fc = master.firstChild){ 
				df.appendChild(fc);
			}
			return df; // DOMNode
			*/
		},
		toDomForTextNode: function(frag){
			var master = this._getMaster(frag);
			df = doc.createDocumentFragment();
			while(fc = master.firstChild){ 
				df.appendChild(fc);
			}
			return df;
		},
		_getMaster: function(frag){
			//转换一个html 字符串为 dom节点
			doc = document;
			var masterId = doc[masterName];
			if(!masterId){
				doc[masterName] = masterId = ++masterNum + "";
				masterNode[masterId] = doc.createElement("div");
			}
			// 确保我们的flag是一个字符串
			frag += "";

			//获取开始的tag,然后获取这个最外层的tag
			var match = frag.match(reTag),
				tag = match ? match[1].toLowerCase() : "",
				master = masterNode[masterId],
				wrap, i, fc, df;
			if(match && tagWrap[tag]){
				wrap = tagWrap[tag];
				master.innerHTML = wrap.pre + frag + wrap.post;
				for(i = wrap.length; i; --i){
					master = master.firstChild;
				}
			}else{
				master.innerHTML = frag;
			}
			return master;	
		},
		/**
         * 替换dom节点
         * @param { HTMLElement } element 需要被替换的元素对象
		 * @param { HTMLElement } element 需要去替换的元素对象
         */
		replace: function(refNode,node){
			refNode = refNode.node ? refNode.node : refNode;
			node = node.node ? node.node: node;
			refNode.parentNode.replaceChild(node, refNode);
		},
		create: function(type,param){		
			var node = $(document.createElement(type));
			if(type == "script" || type == "iframe"){
				if(param['callback']){
					if(node.node.attachEvent){
						node.node.attachEvent("onload",param['callback']);
					}else{
						node.node.onload = param['callback']
					}
					delete param['callback'];
				}			
			}
			var temp = {};
			specialAttr.each(function(attr){
				param[attr] && (temp[attr] = param[attr]);
				delete param[attr];
			});
			node.setAttributes(param);
			$H(temp).each(function(attr,value){
				specialAttr.obj[attr](node,value);
			});
			return node;
		},
		/**
         * 给node list 设置样式
         * @param { Array } nodes 需要设置样式的数组
         */
		setStyles: function(nodes,style){
			$A(nodes).each(function(node){
				$(node).setStyle(style);
			});
		},
		append: function(parent, elem) {
			if(!arale.domManip) return;
			arale.domManip(elem, function(fragment) {
				parent.appendChild(fragment);
			});	
		}
	};
    $D = window.D = exports.$D = exportsObject; 
	return exportsObject;
}), '$D');

//TODO create,getText,getValue,ancestor
//var $Node;
