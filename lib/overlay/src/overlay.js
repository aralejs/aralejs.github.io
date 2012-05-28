define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Shim = require('iframe-shim'),
        Widget = require('widget');


    var Overlay = Widget.extend({

        attrs: {
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
                selfXY: [0, 0],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                baseXY: [0, 0]
            }
        },

        setup: function() {
            // 加载 iframe 遮罩层并与 overlay 保持同步
            var shim = new Shim(this.element);
            this.before('show', shim.sync, shim);
            this.after('hide', shim.sync, shim);
            this.after('setPosition', shim.sync, shim);
            this.after('css', shim.sync, shim);            
            this.on('change:width change:height change:zIndex', shim.sync, shim);
        },

        render: function() {
            // 渲染 DOM 结构
            this.element.addClass(this.get('className'));
            this.get('id') && this.element.attr('id', this.get('id'));
            this.element.css('csstext', this.get('style'));
            this.css({
                width: this.get('width'),
                height: this.get('height'),
                zIndex: this.get('zIndex')
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
        css: function(styles) {
            this.element && this.element.css(styles);
            return this;
        },

        // 进行定位
        setPosition: function() {
            Position.pin({
                element: this.element,
                x: this.get('position').selfXY[0],
                y: this.get('position').selfXY[1]
            }, {
                element: this.get('position').baseElement,
                x: this.get('position').baseXY[0],
                y: this.get('position').baseXY[1]
            });
        },

        // 判断元素是否显示
        isVisible : function() {
            return this.element.is(':hidden');
        },

        show: function() {
            this.element.show();
            return this;
        },

        hide: function() {
            this.element.hide();
            return this;
        },

        _onChangeWidth: function() {
            this.element.css('width', this.get('width'));
        },

        _onChangeHeight: function() {
            this.element.css('height', this.get('height'));
        },

        _onChangeZIndex: function() {
            this.element.css('zIndex', this.get('zIndex'));
        },

        _onChangePosition: function() {
            this.setPosition();
        },

        _onChangeId: function() {              
            this.get('id') && this.element.attr('id', this.get('id'));
        },

        _onChangeClassName: function() {
            this.element.addClass(this.get('className'));
        },

        _onChangeStyle: function() {
            this.element.css('csstext', this.get('style'));
        }

    });

    module.exports = Overlay;

});
