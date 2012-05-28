define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Shim = require('iframe-shim'),
        Widget = require('widget');


    var Overlay = Widget.extend({

        attrs: {
            // overlay 的基本属性
            width: '',
            height: '',
            zIndex: 10,
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
            this.on('change:width change:height change:zIndex', shim.sync, shim);
        },

        render: function() {
            // 在定位时，为避免元素高度不定，先显示出来
            this.element.css({ visibility: 'hidden', display: 'block' });

            // 让用户传入的 config 生效并插入到文档流中
            Overlay.superclass.render.call(this);

            // 定位完成后，欢迎样式
            this.element.css({ visibility: '', display: '' });
            return this;
        },

        // 修改 overlay 元素的样式
        css: function(styles) {
            this.element.css(styles);
            return this;
        },

        // 进行定位
        setPosition: function(position) {
            position || (position = this.get('position'));

            Position.pin({
                element: this.element,
                x: position.selfXY[0],
                y: position.selfXY[1]
            }, {
                element: position.baseElement,
                x: position.baseXY[0],
                y: position.baseXY[1]
            });

            return this;
        },

        // 判断元素是否显示
        isVisible: function() {
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

        _onChangeWidth: function(val) {
            this.element.css('width', val);
        },

        _onChangeHeight: function(val) {
            this.element.css('height', val);
        },

        _onChangeZIndex: function(val) {
            this.element.css('zIndex', val);
        },

        _onChangeId: function(val) {
            val && this.element.attr('id', val);
        },

        _onChangeClassName: function(val, prev) {
            this.element.removeClass(prev).addClass(val);
        },

        _onChangeStyle: function(val) {
            this.element.css('csstext', val);
        },

        _onChangePosition: function(val) {
            this.setPosition(val);
        }

    });

    module.exports = Overlay;

});
