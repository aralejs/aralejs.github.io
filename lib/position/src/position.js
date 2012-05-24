define(function(require, exports) {

    // Position
    // ---------------
    // 定位工具组件，将一个 DOM 节点相对对另一个 DOM 节点进行定位操作。
    // 代码易改，人生难得

    var Position = exports,
        VIEWPORT = { _id: 'VIEWPORT', nodeType: 1 },
        $ = require('$'),
        isPinFixed = false,
        isIE6 = $.browser.msie && $.browser.version == 6.0;


    // 将目标元素相对于基准元素进行定位
    // 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
    Position.pin = function(pinObject, baseObject) {

        // 将两个参数转换成标准定位对象 { element: a, x: 0, y: 0 }
        pinObject = normalize(pinObject);
        baseObject = normalize(baseObject);

        // 设定目标元素的 position 为绝对定位
        // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
        var pinElement = $(pinObject.element);
        if(pinElement.css('position') !== 'fixed') {
            pinElement.css('position', 'absolute');
            isPinFixed = false;
        }
        else {
            // 定位 fixed 元素的标志位，下面有特殊处理
            isPinFixed = true;
        }

        // 将位置属性归一化为数值
        // 注：必须放在上面这句 `css('position', 'absolute')` 之后，
        //    否则获取的宽高有可能不对
        posConverter(pinObject);
        posConverter(baseObject);

        var parentOffset = getParentOffset(pinElement);
        var baseOffset = baseObject.offset();

        // 计算目标元素的位置
        var top = baseOffset.top + baseObject.y -
                pinObject.y - parentOffset.top;

        var left = baseOffset.left + baseObject.x -
                pinObject.x - parentOffset.left;

        // 定位目标元素
        pinElement.css({ left: left, top: top });
    };


    // 将目标元素相对于基准元素进行居中定位
    // 接受两个参数，分别为目标元素和定位的基准元素，都是 dom 节点类型
    Position.center = function(pinElement, baseElement) {
        Position.pin({
            element: pinElement,
            x: '50%',
            y: '50%'
        }, {
            element: baseElement,
            x: '50%',
            y: '50%'
        });
    };


    // 这是当前可视区域的伪 dom 节点
    // 需要相对于当前可视区域定位时，可传入此对象作为 element 参数
    Position.VIEWPORT = VIEWPORT;


    // Helpers

    // 将参数包装成标准的定位对象，形似 { element: a, x: 0, y: 0 }
    function normalize(pinObject) {
        pinObject = toElement(pinObject) || {};

        if (pinObject.nodeType) {
            pinObject = { element: pinObject };
        }

        var element = toElement(pinObject.element) || VIEWPORT;
        if (element.nodeType !== 1) {
            throw 'pinObject.element is invalid.';
        }

        var result = {
            element: element,
            x: pinObject.x || 0,
            y: pinObject.y || 0
        };

        // options 的深度克隆貌似会替换掉 Position.VIEWPORT, 导致直接比较为 false
        var isVIEWPORT = (element === VIEWPORT || element._id === 'VIEWPORT');

        // 归一化 offset
        result.offset = function() {
            // 若定位 fixed 元素，则父元素的 offset 没有意义
            if (isPinFixed) {
                return {
                    left: 0,
                    top: 0
                };
            }
            else if (isVIEWPORT) {
                return {
                    left: $(document).scrollLeft(),
                    top: $(document).scrollTop()
                };
            } 
            else {
                return $(element).offset();
            }
        };

        // 归一化 size, 含 padding 和 border
        result.size = function() {
            var el = isVIEWPORT ? $(window) : $(element);
            return {
                width: el.outerWidth(),
                height: el.outerHeight()
            };
        };

        return result;
    }

    // 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
    function posConverter(pinObject) {
        pinObject.x = xyConverter(pinObject.x, pinObject, 'width');
        pinObject.y = xyConverter(pinObject.y, pinObject, 'height');
    }

    // 处理 x, y 值，都转化为数字
    function xyConverter(x, pinObject, type) {
        // 先转成字符串再说！好处理
        x = x + '';

        // 处理 px
        x = x.replace(/px/gi, '');

        // 处理 alias
        if (/\D/.test(x)) {
            x = x.replace(/(?:top|left)/gi, '0%')
                    .replace(/center/gi, '50%')
                    .replace(/(?:bottom|right)/gi, '100%');
        }

        // 将百分比转为像素值
        if (x.indexOf('%') !== -1) {
            //支持小数
            x = x.replace(/(\d+\.?\d+)%/gi, function(m, d) {
                return pinObject.size()[type] * (d / 100.0);
            });
        }

        // 处理类似 100%+20px 的情况
        if (/[+\-*\/]/.test(x)) {
            try {
                // eval 会影响压缩
                // new Function 方法效率高于 for 循环拆字符串的方法
                // 参照：http://jsperf.com/eval-newfunction-for
                x = (new Function('return ' + x))();
            } catch (e) {
                throw 'Invalid position value: ' + x;
            }
        }

        // 转回为数字
        return numberize(x);
    }

    // 获取 offsetParent 的位置
    function getParentOffset(element) {
        var parent = element.offsetParent();

        if(parent[0] === document.documentElement) {
            parent = $(document.body);
        }

        // 修正 ie6 下 absolute 定位不准的 bug
        if (isIE6) {
            parent.css('zoom', 1);
        }

        // offsetParent 的 offset
        // document.body 会默认带8像素的偏差

        // IE7下，body子节点的 offsetParent 为 html 元素，其 offset 为 { top: 2, left: 2 }
        // 会导致定位差2像素，所以这里将 parent 转为 document.body

        // 所以这两种情况直接赋为0
        var offset = (parent[0] === document.body || parent[0] === document.documentElement) ?
            { left: 0, top: 0 } : parent.offset();

        // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
        offset.top += numberize(parent.css('border-top-width'));
        offset.left += numberize(parent.css('border-left-width'));

        return offset;
    }

    function numberize(s) {
        return parseFloat(s, 10) || 0;
    }

    function toElement(element) {
        if (typeof element === 'string') {
            element = $(element)[0];
        }
        else if (element instanceof $) {
            element = element[0];
        }

        return element;
    }

});
