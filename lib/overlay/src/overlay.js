define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Shim = require('iframe-shim'),
        Widget = require('widget');


    // Overlay
    // -------
    // Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable），是一切悬浮类
    // UI 组件的基类。

    var Overlay = Widget.extend({

        attrs: {
            // 基本属性
            width: '',
            height: '',
            zIndex: 99,
            id: '',
            className: '',
            style: {},
            visible: false,

            // 定位配置
            align: {
                // element 的定位点，默认为左上角
                selfXY: [0, 0],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                baseXY: [0, 0]
            },

            // 父元素
            parentNode: document.body
        },

        render: function() {
            // 让用户传入的 config 生效并插入到文档流中
            Overlay.superclass.render.call(this);

            // 在插入到文档流后，重新定位一次
            this._setPosition();
            return this;
        },

        show: function() {
            // 若从未渲染，则调用 render
            if (!this.rendered) {
                this.render();
            }

            this.set('visible', true);
            return this;
        },

        hide: function() {
            this.set('visible', false);
            return this;
        },

        setup: function() {
            // 加载 iframe 遮罩层并与 overlay 保持同步
            this._setupShim();
        },

        // 进行定位
        _setPosition: function(align) {
            // 不在文档流中，定位无效
            if (!isInDocument(this.element[0])) return;

            align || (align = this.get('align'));
            var isHidden = !this.get('visible') || this.element.is(':hidden');

            // 在定位时，为避免元素高度不定，先显示出来
            if (isHidden) {
                this.element.css({ visibility: 'hidden', display: 'block' });
            }

            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });

            // 定位完成后，还原
            if (isHidden) {
                this.element.css({ visibility: '', display: '' });
            }

            return this;
        },

        // 加载 iframe 遮罩层并与 overlay 保持同步
        _setupShim: function() {
            var shim = new Shim(this.element);
            this.after('show hide', shim.sync, shim);

            // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
            var attrs = Overlay.prototype.attrs;
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    if (attr === 'parentNode') continue;
                    this.on('change:' + attr, shim.sync, shim);
                }
            }
        },


        // 用于 set 属性后的界面更新

        _onRenderWidth: function(val) {
            this.element.css('width', val);
        },

        _onRenderHeight: function(val) {
            this.element.css('height', val);
        },

        _onRenderZIndex: function(val) {
            this.element.css('zIndex', val);
        },

        _onRenderId: function(val) {
            this.element.attr('id', val);
        },

        _onRenderClassName: function(val, prev) {
            prev && this.element.removeClass(prev);
            this.element.addClass(val);
        },

        _onRenderStyle: function(val) {
            this.element.css(val);
        },

        _onRenderAlign: function(val) {
            this._setPosition(val);
        },

        _onRenderVisible: function(val) {
            this.element[val === true ? 'show' : 'hide']();
        }

    });

    module.exports = Overlay;


    // Helpers
    // -------

    function isInDocument(element) {
        return $.contains(document.documentElement, element);
    }

});
