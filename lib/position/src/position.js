define(function(require, exports) {

    // Position
    // ---------------
    // 定位工具组件，将一个 DOM 节点相对对另一个 DOM 节点进行定位操作。
    // 代码易改，人生难得

    var Position = exports,
        VIEWPORT = { id: 'VIEWPORT', nodeType: 1 },
        $ = require('$'),
        isIE6 = $.browser.msie && $.browser.version == 6.0;


    // 将目标元素相对于基准元素进行定位
    // 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
    Position.pin = function(pinObject, baseObject) {

        // 将两个参数包装成标准定位对象 { element: a, x: 0, y: 0 }
        pinObject = normalize(pinObject);
        baseObject = normalize(baseObject);

        var pinElement = $(pinObject.element),
            pinParent = pinElement.offsetParent(),
            isVIEWPORT = baseObject.element === VIEWPORT,
            top, left,
            parentOffset,
            baseOffset;

        // 设定目标元素的 Position 为绝对定位
        // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
        pinElement.css('position', 'absolute');

        // 将位置属性归一化为数值
        // 注：必须放在上面这句 `css('position', 'absolute')` 之后，否则获取的宽高不对
        posConverter(pinObject);
        posConverter(baseObject);

        // 修正 ie6 下 absolute 定位不准的 bug
        if (isIE6) {
            pinParent.css('zoom', 1);
        }

        // 寻找基准元素的 offsetParent
        parentOffset = (pinParent[0] !== document.body) ?
                pinParent.offset() :
                { left: 0, top: 0 };

        // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
        parentOffset.top += numberize(pinParent.css('border-top-width'));
        parentOffset.left += numberize(pinParent.css('border-left-width'));

        // 基准元素的位置
        // 若基准元素为 VIEWPORT，则目标元素相对于浏览器当前可见区域定位
        if (isVIEWPORT) {
            baseOffset = {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop()
            };
        } else {
            baseOffset = $(baseObject.element).offset();
        }

        // 计算并设定目标元素位置
        top = baseOffset.top - parentOffset.top -
                pinObject.y + baseObject.y;

        left = baseOffset.left - parentOffset.left -
                pinObject.x + baseObject.x;

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
        pinObject = pinObject || {};

        // 如果为 DOM 节点
        if (pinObject.nodeType === 1) {
            return {
                element: pinObject,
                x: 0,
                y: 0
            };
        }

        // 判断定位元素是否合法
        if (pinObject.element && pinObject.element.nodeType !== 1) {
            throw 'pinObject.element must be a DOM element.';
        }

        return {
            element: pinObject.element || VIEWPORT,
            x: pinObject.x || 0,
            y: pinObject.y || 0
        };
    }

    // 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
    function posConverter(pinObject) {
        var pinElement = (pinObject.element !== VIEWPORT) ?
                $(pinObject.element) : $(window);

        pinObject.x = xyConverter(pinObject.x, outer(pinElement, 'Width'));
        pinObject.y = xyConverter(pinObject.y, outer(pinElement, 'Height'));
    }

    // 处理 x, y 值，都转化为数字
    function xyConverter(x, outerFn) {
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
            x = x.replace(/(\d+)%/gi, function(m, d) {
                return outerFn() * (d / 100.0);
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

    function outer(thisObj, type) {
        return function() {
            return thisObj['outer' + type]();
        }
    }

    function numberize(s) {
        return parseFloat(s, 10) || 0;
    }

});
