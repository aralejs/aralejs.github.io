/**
 * @name arale.node
 * @class
 * 对HTMLElement的最次封装，可以对元素进行方便的创建，遍历，插入等操作
 * @param {HTMLElement} node 要包装的DOM对象
 * @returns {Node} 包装后的对象
 * @description
 * arale.node 操作返回Node对象，只是对你传入的元素进行了增加，你用链式的方式对你得到的节点进行操作
 * @example
 * $Node(document.getElementById("id"));
 */
arale.module("arale.node", (function(){
    var arale = window.arale || require('arale.base');
    var $S = window.$S || require('arale.string');
    var $A = window.$A || require('arale.array');
    var $ = window.$,
        $$ = window.$$;
    
    var $D = exports.D;
    var $Node = exports;

	var attributes = {
		'html': 'innerHTML',
		'class': 'className',
		'for': 'htmlFor',
		'defaultValue': 'defaultValue',
		'text': (arale.browser.Engine.trident || (arale.browser.Engine.webkit && arale.browser.Engine.version < 420)) ? 'innerText' : 'textContent'
	};
	
	var inserters = {

        before: function(context, element){
			if(context.nodeType=='NODE') context = context.element;
			if(element.nodeType=='NODE') element = element.element;
            if(context.parentNode) context.parentNode.insertBefore(element, context);
        },

        after: function(context, element){
			if(context.nodeType=='NODE') context = context.element;
			if(element.nodeType=='NODE') element = element.element;
            if (!context.parentNode) return;
            var next = context.nextSibling;
            (next) ? next.parentNode.insertBefore(element,next) : context.parentNode.appendChild(element);
        },

        bottom: function(context, element){
			if(context.nodeType=='NODE') context = context.element;
			if(element.nodeType=='NODE') element = element.element;
            context.appendChild(element);
        },

        top: function(context, element){
			if(context.nodeType=='NODE') context = context.element;
			if(element.nodeType=='NODE') element = element.element;
            var first = context.firstChild;
            (first) ? context.insertBefore(element, first) : context.appendChild(element);
        }
    };
	
	var match = function(element, selector){
        //return (!tag || (tag == element) || element.tagName.toLowerCase() == tag.toLowerCase());
		//return (!selector || (selector == element) || $A($A($$(selector, element.parentNode)).map(function(item){return item.node;})).contains(element));
        return !selector || (selector == element) || arale.dom.filter_(selector, [element]).length;
    };
	var Node = arale.dblPrototype(document.createElement("div"),function(node){
		this.node  = node;
		this.noded = true;
	});
	
	var isTable = function(nodeName){
		
	}
		
	arale.augment(Node,
	/** @lends arale.node.prototype */
	{
		/**
		 * @ignore 
		 * 遍历查找相关元素
		 */
		walk: function(walk, start, tag, all){
			var el = this.node[start || walk];
	        var elements = [];
	        while (el){
	            if (el.nodeType == 1 && (!tag || match(el, tag))){
	                if (!all) return $(el);
	                elements.push($(el));
	            }
				el = el[walk];
	        }
	        return (all) ? elements : null;
		},
		
		/**
		 * 插入多个元素到当前元素
		 * @param {HTMLElement[,others]} arguments 需要插入的元素
		 * @example
		 * var node1 = $Node('div');
		 * var node2 = $Node('div');
		 * $('parentNode').adopt(node1, node2) //在parentNode中插入node1 和 node2
		 * @returns {Node} 原对象
		 */
		adopt: function(){
			var that = this;
            arguments = Array.prototype.slice.call(arguments);
            $A(arguments).each(function(el){
                if(el){
					el = el.node || el;
                    that.node.appendChild(el);
                }
            });
            return this;
        },
		
		/**
		 * 将元素插入到某个元素中的指定位置
		 * @param {HTMLElement} el 目标元素
		 * @param {String} where  插入的位置, before, after, bottom, top 默认bottom
		 * @example
		 * $Node('div').inject(document.body) //将新创建的div元素插入到document.body中
		 * $Node('div').inject($('node1'),'before') //将新创建的div元素插入到node1的前面
		 * @returns {Node} 原对象
		 */
		inject: function(el, where){
			//有可能el也是我们的Node类型
			el = el.node || el;
            inserters[where || 'bottom'](el, this.node);
            return this;
        },
	
		/**
		 * 获取前一个兄弟节点或满足条件的兄弟节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').prev() //获取node1前一个兄弟节点
		 * $('node1').prev('div') //获取node1前一个tagName为div的兄弟节点
		 * @returns {Node | Array} 前一个兄弟节点对象或满足条件的兄弟节点数组
		 */
		prev: function(match){
			return this.walk('previousSibling', null, match, false);
		},	
		
		/**
		 * 获取所有前面的兄弟节点或满足条件的兄弟节点
		 * @param {String} match 选择器
		 * @example
		 * $('node1').prevAll() //获取所有在node1前面的兄弟节点
		 * $('node1').prevAll('div') //获取所有在node1前面的tagName为div的兄弟节点
		 * @returns {Node} 所有前面的兄弟节点或满足条件的兄弟节点数组
		 */
		prevAll: function(match){
			return this.walk('previousSibling', null, match, true);
		},
		
		/**
		 * 获取所有后面的兄弟节点或满足条件的兄弟节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').next() //获取node1前一个兄弟节点
		 * $('node1').next('div') //获取node1前一个tagName为div的兄弟节点
		 * @returns {Node} 所有后面的兄弟节点或满足条件的兄弟节点
		 */		
		next: function(match){
			return this.walk('nextSibling', null, match, false);
		},	
		
		/**
		 * 获取所有后面的兄弟节点或满足条件的兄弟节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').nextAll() //获取所有在node1后面的兄弟节点
		 * $('node1').nextAll('div') //获取所有在node1后面的tagName为div的兄弟节点
		 * @returns {Node} 所有后面的兄弟节点或满足条件的兄弟节点
		 */	
		nextAll: function(match){
			return this.walk('nextSibling', null, match, true);
		},
		
		/**
		 * 获取第一个子节点或者满足条件的子节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').first() //获取node1的第一个子节点
		 * $('node1').first('div') //获取node1的tagName为div的第一个子节点
		 * @returns {Node} 第一个子节点或者满足条件的子节点
		 */		
		first: function(match){
			return $(this.walk('nextSibling', 'firstChild', match, false));
		},	
		
		/**
		 * 获取最后一个子节点或者满足条件的子节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').last() //获取node1的最后一个子节点
		 * $('node1').last('div') //获取node1的tagName为div的最后一个子节点
		 * @returns {Node} 最后一个子节点或者满足条件的子节点
		 */	
		last: function(match){
			return $(this.walk('previousSibling', 'lastChild', match, false));
		},
		
		/**
		 * 获取第一个父节点或者满足条件的父节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').parent() //获取node1的第一个父节点
		 * $('node1').parent('div') //获取node1的tagName为div的父节点
		 * @returns {Node} 第一个父节点或者满足条件的父节点
		 */		
		parent: function(match){
			return $(this.walk('parentNode', null, match, false));
		},
		
		/**
		 * 获取满足条件的父节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').parents() //获取node1的所有父节点
		 * $('node1').parents('div') //获取node1的tagName为div的所有父节点
		 * @returns {Array} 满足条件的父节点
		 */		
		parents: function(match){
			return this.walk('parentNode', null, match, true);
		},
		
		/**
		 * 获取所有子节点
		 * @param {String} match 匹配tagname
		 * @example
		 * $('node1').nodes() //获取node1的所有子结点
		 * $('node1').nodes('div') //获取node1的tagName为div的所有子节点
		 * @returns {Array} 所有子节点
		 */		
		nodes: function(match){
			return this.walk('nextSibling', 'firstChild', match, true);
		},
		
		/**
		 * 获取或者设置元素单个属性
		 * @param {String} key 属性名
		 * @param {String} [value] 属性值 
		 * @example
		 * $('node1').attr('id') //获取node1的id属性
		 * $('node1').attr('id','node2') //设置node1的id属性为node2
		 * @returns {Node | String}  若设置属性值，则返回原对象；若获取属性值，则返回属性值。
		 */		
		attr: function(key, value){
			if(key){
				if(attributes[key]) key = attributes[key];
                if (!arale.isUndefined(value)) {
					if(key == 'class' || key == 'className'){
						this.node.className = value;
					}else{
						this.node[key] = value;
						this.node.setAttribute(key , value);
					}
					return $Node(this.node);
				}else{
					if(key == 'class' || key == 'className'){
						return this.node.className;
					}
					return (!arale.isUndefined(this.node[key])) ? this.node[key] : this.node.getAttribute(key);
				}
			}
			return this;
		},	
		/**
		 * 设置元素多个属性
		 * @param {Object} attributes 属性键值对
		 * @example
		 * $('node1').attrs({id : 'node2', 'data' : '123'})
		 * @returns {Node} 原对象
		 */
		attrs: function(attries){
			for (var attr in attries) {
				if(attributes[attr]) attr = attributes[attr];
				if(attr == 'class' || attr == 'className'){
					this.node.className = attries[attr];
				}else{
					this.node[attr] = attries[attr];
					this.node.setAttribute(attr, attries[attr]);
				}
            }
            return this;	
		},
		/**
		 * 设置元素多个属性,
         * @deprecated 从1.1以后此方法废弃，您可以使用attrs方法代替
		 * @param {Object} attributes 属性键值对
		 * @example
		 * $('node1').setAttributes({id : 'node2', 'data' : '123'})
		 * @returns {Node} 原对象
		 */	
		setAttributes: function(attries){		
            return this.attrs(attries);
		},	
		
		/**
		 * 获取元素多个属性
		 * @param {String[,others]} arguments 属性名 
		 * @example
		 * $('node1').getAttrs("id" , "data"}); //return {id : 'node1' , data : '123'}
		 * @returns {Object} 获取的多属性对象
		 */	
		getAttrs: function(){
			var that = this;
            var args = $A(arguments).map(function(arg){
				if(attributes[arg]) arg = attributes[arg];
				if(arg == 'class' || arg == 'className'){
					return that.node.className;
				}else{
					return (!arale.isUndefined(that.node[arg])) ? that.node[arg] : that.node.getAttribute(arg);
				}
            });
            return $A(args).associate(arguments);
		},
		/**
		 * 获取元素多个属性
         * @deprecated 从1.1以后此方法废弃，您可以使用attrs方法代替
		 * @param {String[,others]} arguments 属性名 
		 * @example
		 * $('node1').getAttributes("id" , "data"}); //return {id : 'node1' , data : '123'}
		 * @returns {Object} 获取的多属性对象
		 */	
		getAttributes: function(){
			return this.getAttrs.apply(this,arguments);
		},
		
		/**
		 * 删除元素多个属性
		 * @param {String[,others]} arguments 属性名 
		 * @example
		 * $('node1').removeAttrs("id" , "data"});
		 * @returns {Node} 原对象
		 */		
		removeAttrs: function(){
			var that = this;
            $A(arguments).each(function(arg){
                return that.node.removeAttribute(arg);
            });
            return this;
		},
		
		/**
		 * 删除元素多个属性
         * @deprecated 从1.1以后此方法废弃，您可以使用attrs方法代替
		 * @param {String[,others]} arguments 属性名 
		 * @example
		 * $('node1').removeAttributes("id" , "data"});
		 * @returns {Node} 原对象
		 */		
		removeAttributes: function(){
			return this.removeAttrs.apply(this,arguments);
		},
		
		/**
		 * 是否包含指定的类名
		 * @param {String} className 类名
		 * @example
		 * $('node1').hasClass('heighlight');
		 * @return {Boolean} 是否包含指定的类名
		 */		
		hasClass: function(className){
            return Boolean(this.node.className.match(new RegExp('(\\s|^)' + className +'(\\s|$)')));
        },
		
		/**
		 * 添加类名
		 * @param {String} className 类名
		 * @example
		 * $('node1').addClass('heighlight');
		 * @returns {Node} 原对象
		 */
		addClass: function(className){
			if (!this.hasClass(className)) this.node.className = $S(this.node.className + ' ' + className).clean();
            return this;
		},
		
		/**
		 * 删除类名
		 * @param {String} className 类名
		 * @example
		 * $('node1').removeClass('heighlight');
		 * @returns {Node} 原对象
		 */		
		removeClass: function(className){
            this.node.className = this.node.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
            return this;
        },
		
		/**
		 * 交替类
		 * @param {String} className 类名
		 * @example
		 * $('node1').toggleClass('heighlight');
		 * @return {Node} 原对象
		 */
        toggleClass: function(className){
            return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
        },

		/**
		 * 拷贝一个元素
		 * @param {Boolean} [contents] 是否拷贝元素里面的内容
		 * @param {Boolean} [keepid] 是否保留Id
		 * @example
		 * $('node1').clone();
		 * @returns {Node} 新拷贝出的对象
		 */
		clone: function(contents, keepid){
            contents = contents !== false;
			var props = {
				input: 'checked', 
			 	option: 'selected', 
			 	textarea: (arale.browser.Engine.webkit && arale.browser.Engine.version < 420) ? 'innerHTML' : 'value'
			};
			var clone = this.node.cloneNode(contents);
            var clean = function(cn, el){
                if (!keepid) cn.removeAttribute('id');
                if (arale.browser.Engine.trident){
                    cn.mergeAttributes(el);
                    if(cn.options){
                        var no = cn.options, eo = el.options;
                        for(var j = no.length; j--;){
                            no[j].selected = eo[j].selected;
                        }
                    }
                    var prop = props[el.tagName.toLowerCase()];
                    if(prop && el[prop]) cn[prop] = el[prop];
                }
            };
			if (contents){
                var ce = clone.getElementsByTagName('*'),
                    te = this.node.getElementsByTagName('*');
                for (var i = ce.length; i--;) clean(ce[i], te[i]);
            }

            clean(clone, this.node);
            return $Node(clone);
        },
		
		/**
		 * 设置滚动条到某个位置
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 * @example
		 * $('node1').scrollTo(10, 20);
		 * @return {Node} 原对象
		 */
		scrollTo: function(x, y){
            if ((/^(?:body|html)$/i).test(this.node.tagName)){
                this.node.ownerDocument.window.scrollTo(x, y);
            } else {
                this.node.scrollLeft = x;
                this.node.scrollTop = y;
            }
            return this;
        },
		
		/**
		 * 获取元素样式
		 * @param {String} arguments 要获取的样式名称
		 * @example
		 * $('node1').getStyle('background', 'border'); //return {Object}
		 * $('node1').getStyle('background'); //return {String} 
		 * @returns {Object|String} 要获取的样式
		 */
		getStyle: function() {
			var that = this;
			var get_style = function(style){
				if(style == 'float') {
					style = arale.isIE() ? 'styleFloat' : 'cssFloat';
				}
				style = $S(style).camelCase();
			    var value = that.node.style[style];

			    if (!value || value == 'auto') {
				  value = that.getComputedStyle(style);
			    }	
				var color = /rgba?\([\d\s,]+\)/.exec(value);
                if (color) value = value.replace(color[0], $S(color[0]).rgbToHex());

			    if (style == 'opacity') {
                    return this.getOpacity();
                    /*
					try{
						return parseFloat(value)
					}catch(e){
						return 1.0;
					}
                    */
				}
				
				//Opera IE需用offsetTop&offsetLeft来获取宽高
				if ( arale.isOpera() || ( arale.isIE() && isNaN(parseFloat(value))) ) {
					if (/^(height|width)$/.test(style)){
						var values = (style == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
						$A(values).each(function(value){
							size += parseInt(get_style('border-' + value + '-width')) + parseInt(get_style('padding-' + value));
						});
						value = that.node['offset' + $S(style).capitalize()] - size + 'px';
					}
					if ( arale.isOpera() && String(value).indexOf('px') != -1 ) return value;
					if ( /(border(.+)Width|margin|padding)/.test(style)) return '0px';
				}
				
			    return value == 'auto' ? null : value;
			
			}

			if(!arguments.length){
				return null;
			}

			if(arguments.length > 1){
				var result = {};
				for(var i=0;i<arguments.length;i++){
					result[arguments[i]] = get_style(arguments[i]);
				}
				return result;
			}
			return get_style(arguments[0]);
		},
		
		/**
		 * 获取元素opacity值
		 * @example
		 * $('node1').getOpacity('opacity');
		 * @returns {String} opacity值，0-1之间
		 */
		getOpacity: function() {
		  	//return this.getStyle('opacity');
            var opacity = null;
            //Get the opacity based on the current browser used
            if(arale.isIE() && Number(arale.browser.ver()) < 9) {
                filter = this.node.style.filter;
                if(filter) {
                    alpha = filter.split("alpha(opacity=");
                    opacity = alpha[1].substr(0,(alpha[1].length-1))/100;
                }
            }
            else {
                opacity = this.node.style.opacity;
            }
            opacity = parseFloat(opacity);
            return (!opacity && opacity!=0) ? 1.0 : opacity;
		},
		
		/**
		 * 设置元素属性
		 * @example
		 * $('node1').setStyle({
		 *		'height' : '200px',
		 *		'width'  : '300px'
		 * });
		 * $('node1').setStyle('height','200px');
		 * @returns {Node} 原对象
		 */
		setStyle: function(styles) {
			var  match;
			if (arale.isString(styles) && arguments.length==2) {
			  var tmp = {};
			  tmp[arguments[0]] = arguments[1];
			  styles = tmp;
			}
			for (var property in styles){
			  if (property == 'opacity'){
				this.setOpacity(styles[property]);
			  }else if(property == 'class' || property == 'className'){
				this.className = new String(property);
			  }else{
			    this.node.style[(property == 'float' || property == 'cssFloat') ? 
					(arale.isUndefined(this.node.style.styleFloat) ? 'cssFloat' : 'styleFloat') : property] = styles[property];
			  }
			}
			return this;
		},
		
		/**
		 * 设置元素opacity值
         * @param {Number} value 要设置的opacity值，0-1之间
		 * @example
		 * $('node1').setOpacity(0.2);
		 * @returns {Node} 原对象
		 */
		setOpacity: function(value) {
            if(value >1 || value<0) {return this;}
			if(arale.isIE() && Number(arale.browser.ver()) < 9) {
				this.node.style.filter = 'alpha(opacity=' + value*100 + ')';
			}
            this.node.style.opacity = (value < 0.00001) ? 0 : value;
			//this.node.style.opacity = (value == 1 || value === '') ? this.getOpacity(value) : (value < 0.00001) ? 0 : value;
			return this;
		},	
			
		/**
		 * 获取元素可见区域宽，高
		 * @example
		 * $('node1').getViewportSize();
		 * @returns {Object} 类似{width:200 , height:300}的对象
		 */	
		getViewportSize: function(){
            return {
				width  : $D.getViewportWidth(this.node),
				height : $D.getViewportHeight(this.node)
			}
        },	
	
		/**
		 * 获取元素实际宽，高
		 * @example
		 * $('node1').getDocumentSize();
		 * @returns {Object} 类似{width:200 , height:300}的对象
		 */
		getDocumentSize: function(){
            return {
				width  : $D.getDocumentWidth(this.node),
				height : $D.getDocumentHeight(this.node)
			}
		},		
		
		/**
		 * 获取元素scroll位置
		 * @example
		 * $('node1').getScroll();
		 * @returns {Object} 类似{left : 200 , top : 300}的对象
		 */
		getScroll: function(){
			return $D.getScroll(this.node);
		},		
		
		/**
		 * 获取元素scroll当前位置(其所有父元素的scroll累加)
		 * @example
		 * $('node1').getDocumentSize();
		 * @returns {Object} 类似{left : 200 , top : 300}的对象
		 */
		getScrolls: function(){
			return $D.getScrolls(this.node);
		},
		
		/**
		 * 获取元素区块参数
		 * @example
		 * $('node1').region();
		 * @returns {Object} 类似{left : 200 , top : 300 , right : 400 , bottom : 600, width : 200, height : 300 }的对象
		 */
		region: function(){
			var position = this.getOffsets();
			var obj = {
                left   : position.left,
                top    : position.top,
                width  : $D.getViewportWidth(this.node),
                height : $D.getViewportHeight(this.node)
            };
            obj.right  = obj.left + obj.width;
            obj.bottom = obj.top  + obj.height;
			return obj;
		},
		/**
		 * 获取元素边框
		 * @example
		 * $('node1').border();
		 * @returns {Object} 类似{l : 200 , t : 300 , r : 400 , b : 600}的对象
		 */
		border: function(){
			var fix = this._toFixPx;
			return{
				l: fix(this.getStyle('border-left-width')),
				t: fix(this.getStyle('border-top-width')),
				r: fix(this.getStyle('border-right-width')),
				b: fix(this.getStyle('border-bottom-width'))	
			}
		},
		_toFixPx: function(value){
			//TODO可能需要对不同的浏览器进行扩展,来处理比如middle这类的情况
			return parseFloat(value) || 0;
		},
		/**
		 * @ignore
		 */
		getComputedStyle: function(property){
            return $D.getComputedStyle(this.node, property);
		},
		
		/**
         * 获取元素相对坐标
         * @param {HTMLElement} [element] 元素对象
         * @param {HTMLElement} [relative] 相对元素，默认为offsetParent
         * @example
         * $('node1').getPosition();
         * @returns {Object} 类似{left : 10, top : 10}的对象
         */
		getPosition : function(relative){
			return $D.getPosition(this.node, relative);
		},
		
		/**
         * 获取元素的offsetParent
         * @example
         * $('node1').getOffsetParent();
         * @returns {HTMLElement|null} 元素的offsetParent
         */
		getOffsetParent : function(){
			return $D.getOffsetParent(this.node);
		},
		
		/**
         * 获取元素相对当前窗口的坐标
         * @example
         * $('node1').getOffsets();
         * @returns {Object} 类似{left : 10, top : 10}的对象
         */
		getOffsets : function(){
			return $D.getOffsets(this.node);
		},
		
		/**
         * 设置元素坐标
         * @example
         * $('node1').setPosition({ left : 10, top : 10 });
         * @returns {Node} 原对象
         */
		setPosition: function(pos){
			var obj = { 
				left: new String(parseInt(pos.left) - (parseInt(this.getComputedStyle('margin-left')) || 0)) + 'px',
				top: new String(parseInt(pos.top) - (parseInt(this.getComputedStyle('margin-top')) || 0)) + 'px'
			}
			return this.setStyle(obj);
		},
		
		/**
         * DOM选择器, 详细文档请查看<a href="http://wiki.github.com/jeresig/sizzle/">Sizzle</a>
         * @example
         * $('node1').query('input[name=number]'); //返回node1下name值为number的input元素
         * @returns {Array} 利用sizzle选择出的对象
         */
		query : function(match){
			return $$(match, this.node);
		},
	
		/**
         * 销毁元素
         * @example
         * $('node1').dispose(); //返回node1下name值为number的input元素
         * @returns {Array} 删除掉的对象
         */	
		dispose : function(){
			return this.node.parentNode ? $Node(this.node.parentNode.removeChild(this.node)) : $Node(this.node);
		},

        /**
         * 清空所有子元素
         * @example
         * $('node1').empty(); 
         * @returns {Node} 原对象
         */
		empty: function(){
			while(this.node.firstChild){
				this.node.removeChild(this.node.firstChild);
			}
            return this;
		},

        /**
         * 设置innerHTML，此方法目前还比较粗糙,需要进一步完善
         * @returns {Node} 原对象
         */
		setHtml: function(html){
			//此方法目前还比较粗糙,需要进一步完善
			if(this._isTableInIe(this.node.nodeName)){
				var tempnode = $D.toDom(html);
				this.empty();
				this.node.appendChild(tempnode);
			}else{
				this.node.innerHTML = html;	
			}
			return this;
		},
		_isTableInIe: function(nodeName){
			return arale.isIE() && $A(["tbody","thead","tr","td"]).indexOf(nodeName.toLowerCase())>-1;
		},

        /**
         * 获取html
         */
		getHtml: function(){
			return $S(this.node.innerHTML).unescapeHTML();
		},
		/**
         * 替换dom节点
		 * @param { HTMLElement } element 需要去替换的元素对象
         * @example
         * $('div').replace('<div id="div1"><div>');
         * @returns {Node} 原对象
         */
		replace: function(node){
			node = node.node || node;
			this.node.parentNode.replaceChild(node,this.node);
            return this;
		}
	});
	
	Node.prototype['toString'] = function(){
		return this.node.toString();
	};
	Node.prototype['valueOf'] = function(){
		return this.node.valueOf();
	};
	
	//return new Temp(node);
	var NodeFactory = function(node){
		if(node.noded) return node;
		if(arale.isString(node)){
			node = document.createElement(node);
		}	
		return new Node(node);
	}
	
	NodeFactory.fn = Node.prototype;

    NodeFactory.D = exports.D;
	module.exports = NodeFactory;

	window.Node = NodeFactory;
	return NodeFactory;
}), '$Node');


$A(("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" ")).each(function(key){
		exports.fn[key] = function(context,method){
			$E.connect(this,'on'+key,arale.hitch(context,method));
			return this;
			//return $E.connect(this,'on'+key,arale.hitch(context,method));
		};
});
exports.fn['trigger'] = function(type,data){
	$E.trigger(this,type,data);
};

