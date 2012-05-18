define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Shim = require('iframe-shim'),
        Widget = require('widget');


    var Overlay = Widget.extend({

        options: {
            template: '',

            zIndex: 10,
            width: 'auto',
            height: 'auto',
            parentNode: document.body,

            pinOffset: {
                x: 0,
                y: 0
            },
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
            Position.pin({
                element: this.element,
                x: options.pinOffset.x,
                y: options.pinOffset.y
            }, options.baseObject);
        },
        
        // 插入到文档流中，但不显示
        render: function () {
            this.element.appendTo(this.options.parentNode).hide();
            return this;
        },

        // 修改 overlay 元素的样式
        setStyles: function (styles) {
            this.element && this.element.css(styles);
            return this;
        },
        
        show: function () {
            this.trigger('show');
            this.element.show();
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
