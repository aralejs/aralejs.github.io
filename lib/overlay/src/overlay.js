define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Shim = require('iframe-shim'),
        Widget = require('widget');


    var Overlay = Widget.extend({

        options: {
            // 页面节点，和template二选一，element优先
            element: null,
            // 初始化的模板
            template: '',
            // overlay 的基本属性
            zIndex: 10,
            width: '',
            height: '',
            // overlay 的父元素
            parentNode: document.body,
            // element 的定位点，默认为左上角
            pinOffset: {
                x: 0,
                y: 0
            },
            // 基准定位对象，指定了基准定位元素及其定位点
            baseObject: {
                element: document.body,
                x: 0,
                y: 0
            }
        },

        init: function () {
            // 加载 iframe 遮罩层并与 overlay 保持同步
            var shim = this.shim = new Shim(this.element);
            this.on('show hidden', shim.sync, shim);
            // 渲染 DOM 结构
            var options = this.options;
            this.setStyles({
                width: options.width,
                height: options.height,
                zIndex: options.zIndex
            });
        },
        
        // 插入到文档流中，但不显示
        render: function () {
            var options = this.options;
            options.parentNode = $(options.parentNode);
            this.element.appendTo(options.parentNode);
            return this;
        },

        // 修改 overlay 元素的样式
        setStyles: function (styles) {
            this.element && this.element.css(styles);
            return this;
        },

        // 进行定位
        setPosition: function() {
            var options = this.options;
            Position.pin({
                element: this.element,
                x: options.pinOffset.x,
                y: options.pinOffset.y
            }, options.baseObject);
        },
        
        show: function () {
            this.trigger('show');
            this.element.show();
            this.setPosition();
            return this;
        },

        hide: function () {
            this.element.hide();
            this.trigger('hidden');
            return this;
        }

    });

    module.exports = Overlay;

});
