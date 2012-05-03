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

	//对x, y两个参数为left|center|right|%|px时的处理
	var _posConverter = function(pinObj) {
		var pinElem = (pinObj.elem !== VIEWPORT) ? $(pinObj.elem) : $(window);
		(pinObj.x === 'left') && (pinObj.x = '0%');
		(pinObj.x === 'center') && (pinObj.x = '50%'); 
		(pinObj.x === 'right') && (pinObj.x = '100%'); 
		(pinObj.y === 'left') && (pinObj.y = '0%');
		(pinObj.y === 'center') && (pinObj.y = '50%'); 
		(pinObj.y === 'right') && (pinObj.y = '100%');
		
		if(typeof pinObj.x === 'string' && pinObj.x.indexOf('%') !== -1) {
			pinObj.x = pinElem.width() * (parseFloat(pinObj.x ,10)/100.0);
		}
		if(typeof pinObj.y === 'string' && pinObj.y.indexOf('%') !== -1) {
			pinObj.y = pinElem.height() * (parseFloat(pinObj.y ,10)/100.0);
		}
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
