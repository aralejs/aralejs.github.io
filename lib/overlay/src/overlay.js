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
            id: '',
            className: '',
            style: {},

            // overlay 的父元素
            parentNode: document.body,
            // 基准定位对象，指定了基准定位元素及其定位点
            position: {
                // element 的定位点，默认为左上角
                offset: [0, 0],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                xy: [0, 0]
            },
        },

        init: function() {
            // 加载 iframe 遮罩层并与 overlay 保持同步
            var shim = new Shim(this.element);
            this.on('shown hidden', shim.sync, shim);
        },

        render: function() {
            // 渲染 DOM 结构
            var options = this.options;
            this.element.addClass(options.className).attr('id', options.id);
            this.setStyles(options.style).setStyles({
                width: options.width,
                height: options.height,
                zIndex: options.zIndex
            })
                        
            // 插入文档流中
            Overlay.superclass.render.call(this);
            
            // 进行定位，未避免元素高度不定，先显示出来再定位
            this.element.css({visibility: 'hidden', display: 'block'});
            this.setPosition();
            this.element.css({visibility: '', display: ''});
            return this;
        },

        // 修改 overlay 元素的样式
        setStyles: function(styles) {
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

        show: function() {
            this.trigger('show');
            this.element.show();
            this.trigger('shown');
            return this;
        },

        hide: function() {
            this.trigger('hide');
            this.element.hide();
            this.trigger('hidden');
            return this;
        }

    });

    module.exports = Overlay;

});
