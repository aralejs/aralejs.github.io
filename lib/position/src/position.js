/**
 * @name arale.position
 * 工具组件，将一个dom节点相对对另一个dom节点进行定位操作。
 * @author <a href="mailto:xingmin.zhu@alipay.com">偏右</a>
 */

define(function(require, exports, module) {

	var position = {},
		VIEWPORT = { _id : 'VIEWPORT', nodeType : 1 },
		$ = require('jquery');

	//将两个参数包装成定位对象 {elem:a, x:0, y:0}
	var _wrapPinObj = function(pinObj) {
		pinObj = pinObj || {};
		//如果为dom节点
		if (pinObj && pinObj.nodeType === 1) {
			return {
				elem : pinObj,
				x : 0,
				y : 0
			};
		}
		return {
			elem : pinObj.elem || VIEWPORT,
			x : pinObj.x || 0,
			y : pinObj.y || 0
		};
	};

	//对x, y两个参数为left|center|right|%|px时的处理，以及对elem的包装处理
	var _posConverter = function(pinObj) {
		var pinElem = (pinObj.elem !== VIEWPORT) ? $(pinObj.elem) : $(window);
		var _xyConverter = function(x, isX) {
			//先转成字符串再说！好处理
			x = x + '';

			//处理位置为百分比
			x = x.replace(/left/gi, '0%').replace(/center/gi, '50%').replace(/right/gi, '100%');

			//处理px
			x = x.replace(/(\d+)px/gi, '$1');

			//将百分比转为像素值
			if(x.indexOf('%') !== -1) {
				var percents = x.match(/\d+\%/gi);
				if(percents) {
					for(var i=0; i<percents.length; i++) {
						x = x.replace(percents[i], pinElem['outer'+(isX?'Width':'Height')]() * (parseFloat(percents[i] ,10)/100.0) + '');
					}
				}
			}

			//处理类似100%+20px的情况
			if (x.indexOf('+') !== -1 || x.indexOf('-') !== -1) {
				try {
					x = eval(x);
				} catch(ex) {}
			}

			//转回为数字
			return parseFloat(x, 10);
		};
		pinObj.x = _xyConverter(pinObj.x, true);
		pinObj.y = _xyConverter(pinObj.y, false);
		return pinObj;
	};
	
	/**
     * 将目标元素相对于基准元素进行定位
     * @param {Object|Element} pinObj 目标对象或元素
     * @param {Object|Element} relativeObj 基准对象或元素
     * @return {undefined}
     */
	position.pin = function(pinObj, relativeObj) {
		//将两个参数包装成定位对象 {elem:a, x:0, y:0}
		pinObj = _wrapPinObj(pinObj);
		relativeObj = _wrapPinObj(relativeObj);
		var pinElem = $(pinObj.elem),
			relativeElem = (relativeObj.elem !== VIEWPORT) && $(relativeObj.elem),
			top = 0,
			left = 0,
			parentOffset,
			relativeOffset;

		//判断定位元素是否合法
		if(pinObj.elem === VIEWPORT) {
			throw new Error('Wrong pin elem.');
		}

		//设定目标元素的position为绝对定位
		//若元素的初始position不为absolute，这里会影响元素的display、宽高等属性
		pinElem.css('position', 'absolute');

		//对x, y两个参数为left|center|right|%|px时的处理，全部处理为纯数字
		pinObj = _posConverter(pinObj);
		relativeObj = _posConverter(relativeObj);

		//寻找基准元素的offsetParent
		parentOffset = pinElem.offsetParent().offset();

		//根据基准元素offsetParent的border宽度，来修正offsetParent的基准位置
		parentOffset.top = parentOffset.top + parseFloat(pinElem.offsetParent().css('border-top-width'), 10);
		parentOffset.left = parentOffset.left + parseFloat(pinElem.offsetParent().css('border-left-width'), 10);		

		//基准元素的位置
		//若基准元素为VIEWPORT，则目标元素相对于浏览器当前可见区域定位
		relativeOffset = relativeElem ? relativeElem.offset() : { left:$(document).scrollLeft(), top:$(document).scrollTop() };

		//计算并设定目标元素位置
		top = relativeOffset.top - parentOffset.top - pinObj.y + relativeObj.y;
		left = relativeOffset.left - parentOffset.left - pinObj.x + relativeObj.x;
		pinElem.css({ left : left, top : top });
	};

	/**
     * 将目标元素相对于基准元素进行居中定位
     * @param {Element} pinElem 目标元素
     * @param {Element} relativeObj 基准元素
     * @return {undefined}
     */
	position.center = function(pinElem, relativeElem) {
		position.pin({
			elem : pinElem,
			x : 'center',
			y : 'center'
		}, {
			elem : relativeElem,
			x : 'center',
			y : 'center'
		});
	};

	position.VIEWPORT = VIEWPORT;

	return position;

});
