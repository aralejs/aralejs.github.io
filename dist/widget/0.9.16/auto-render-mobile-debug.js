define("#widget/0.9.16/auto-render-mobile-debug", ["#zepto/0.8.0/zepto-debug"], function(require, exports) {

    var $ = require("#zepto/0.8.0/zepto-debug");


    // 自动渲染接口，子类可根据自己的初始化逻辑进行覆盖
    exports.autoRender = function(config) {
        new this(config).render();
    };


    // 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
    exports.autoRenderAll = function(root) {
        root = $(root || document.body);
        var modules = [];
        var elements = [];

        root.find('[data-widget]').each(function(i, element) {
            if (!exports.isDataApiOff(element)) {
                modules.push(element.getAttribute('data-widget').toLowerCase());
                elements.push(element);
            }
        });

        if (modules.length) {
            require.async(modules, function() {

                for (var i = 0; i < arguments.length; i++) {
                    var SubWidget = arguments[i];
                    var element = elements[i];

                    if (SubWidget.autoRender) {
                        SubWidget.autoRender({
                            element: element,
                            renderType: 'auto'
                        });
                    }
                }
            });
        }
    };


    var isDefaultOff = $(document.body).attr('data-api') === 'off';

    // 是否没开启 data-api
    exports.isDataApiOff = function(element) {
        var elementDataApi = $(element).attr('data-api');

        // data-api 默认开启，关闭只有两种方式：
        //  1. element 上有 data-api="off"，表示关闭单个
        //  2. document.body 上有 data-api="off"，表示关闭所有
        return  elementDataApi === 'off' ||
                (elementDataApi !== 'on' && isDefaultOff);
    };

});
