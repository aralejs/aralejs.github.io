// Position
// 定位工具组件，将一个dom节点相对对另一个dom节点进行定位操作。

define("#position/0.9.0/position-debug", ["jquery"], function(require, exports, module) {

    var Position = exports,
        VIEWPORT = { _id: 'VIEWPORT', nodeType: 1 },
        $ = require('jquery'),
        isIE6 = $.browser.msie && $.browser.version == 6.0;


    // 将目标元素相对于基准元素进行定位
    // 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
    Position.pin = function(pinObject, baseObject) {
        // 将两个参数包装成定位对象 {element:a, x:0, y:0}
        pinObject = wrapPinObj(pinObject);
        baseObject = wrapPinObj(baseObject);

        var pinElement = $(pinObject.element),
            pinParent = pinElement.offsetParent(),
            baseElement = (baseObject.element !== VIEWPORT) && $(baseObject.element),
            top, left,
            parentOffset,
            relativeOffset;


        // 设定目标元素的 Position 为绝对定位
        // 若元素的初始 Position 不为 absolute，这里会影响元素的 display、宽高等属性
        pinElement.css('position', 'absolute');

        // 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
        pinObject = posConverter(pinObject);
        baseObject = posConverter(baseObject);

        // 寻找基准元素的 offsetParent
        parentOffset = (pinParent[0] !== document.body)
                        ? pinParent.offset()
                        : { left: 0, top: 0 };

        // 修正 ie6 下 absolute 定位不准的 bug
        if (isIE6) {
            pinElement.offsetParent().css('zoom', 1);
        }

        // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
        parentOffset.top += (parseFloat(pinParent.css('border-top-width'), 10) || 0);
        parentOffset.left += (parseFloat(pinParent.css('border-left-width'), 10) || 0);

        // 基准元素的位置
        // 若基准元素为 VIEWPORT，则目标元素相对于浏览器当前可见区域定位
        relativeOffset = baseElement
                            ? baseElement.offset()
                            : { left: $(document).scrollLeft(), top: $(document).scrollTop() };

        // 计算并设定目标元素位置
        top = relativeOffset.top - parentOffset.top - pinObject.y + baseObject.y;
        left = relativeOffset.left - parentOffset.left - pinObject.x + baseObject.x;
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

    // 将两个参数包装成定位对象，形似 { element: a, x: 0, y: 0 }
    function wrapPinObj(pinObject) {
        pinObject = pinObject || {};
        // 如果为 dom 节点
        if (pinObject.nodeType === 1) {
            return {
                element: pinObject,
                x: 0,
                y: 0
            };
        }
        // 判断定位元素是否合法
        if (pinObject.element && pinObject.element.nodeType !== 1) {
            throw 'Invalid pinObject argument.';
        }
        return {
            element: pinObject.element || VIEWPORT,
            x: pinObject.x || 0,
            y: pinObject.y || 0
        };
    }

    // 对 x, y 两个参数为 left|center|right|%|px 时的处理，以及对 element 的包装处理
    function posConverter(pinObject) {
        var pinElement = (pinObject.element !== VIEWPORT) ? $(pinObject.element) : $(window);
        pinObject.x = xyConverter(pinObject.x, pinElement, true);
        pinObject.y = xyConverter(pinObject.y, pinElement, false);
        return pinObject;
    }

    // 处理 x,y 值，都转化为数字
    function xyConverter(x, pinElement, isX) {
        // 先转成字符串再说！好处理
        x = x + '';

        // 处理位置为百分比
        x = x.replace(/left/gi, '0%').replace(/center/gi, '50%').replace(/right/gi, '100%');

        // 处理 px
        x = x.replace(/px/gi, '');

        // 将百分比转为像素值
        if (x.indexOf('%') !== -1) {
            x = x.replace(/\d+%/gi, function(m) {
                m = parseFloat(m.replace(/px/gi, ''), 10) / 100.0;
                return pinElement['outer' + (isX ? 'Width' : 'Height')]() * m + '';
            });
        }

        // 处理类似 100%+20px 的情况
        if (x.indexOf('+') !== -1 || x.indexOf('-') !== -1) {
            try {
                // eval会影响压缩
                // new Function方法效率高于for循环拆字符串的方法
                // 参照：http://jsperf.com/eval-newfunction-for
                x = (new Function('return ' + x))();
            } catch (e) {
                throw 'Invalid xy value.';
            }
        }

        // 转回为数字
        return parseFloat(x, 10);
    }

});
