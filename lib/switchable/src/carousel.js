//Carousel Widget
define(function(require, exports, module) {
    var Base = require('./base');

    var CLS_PREFIX = 'ar-switchable-',
        DOT = '.',
        EVENT_ADDED = 'added',
        EVENT_REMOVED = 'removed',
        PREV_BTN = 'prevBtn',
        NEXT_BTN = 'nextBtn',
        CLS_PANEL_INTERNAL = CLS_PREFIX + 'panel-internal',
        DOM_EVENT = {
            originalEvent: {
                target: 1
            }
        };

    var Carousel = module.exports = Base.extend({
        options: {
            circular: true,
            prevBtnCls: CLS_PREFIX + 'prev-btn',
            nextBtnCls: CLS_PREFIX + 'next-btn',
            disableBtnCls: CLS_PREFIX + 'disable-btn'
        },
        bindAction: function() {
            var that = this;
            Carousel.superclass.bindAction.apply(this, arguments);
            var options = this.options;
            var element = this.$element;
            var circular = options.circular;
               // 获取 prev/next 按钮，并添加事件
            $.each(['prev', 'next'], function(index, d) {
                var btn = $(DOT + options[d + 'BtnCls'], element);
                that[d + 'Btn'] = btn;

                btn.on('mousedown', function(ev) {
                    ev.preventDefault();
                    var activeIndex = that.activeIndex;

                    if (d == 'prev' && (activeIndex != 0 || options.circular)) {
                        that[d](DOM_EVENT);
                    }
                    var len = that.length - 1;
                    if (d == 'next' && (activeIndex != len || circular)) {
                        that[d](DOM_EVENT);
                    }
                });
            });

            // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
            // circular = true 时，无需处理
            if (!options.circular) {
                // 先动画再 remove
                // switch 事件先于 removed
                this.on(EVENT_ADDED + ' ' + EVENT_REMOVED, function() {
                    that.updateBtnStatus(that.activeIndex);
                });

                this.on('switch', function(ev) {
                    that.updateBtnStatus(ev.currentIndex);
                });
            }
            // 触发 itemSelected 事件
            this.content.on('click', DOT + CLS_PANEL_INTERNAL, function(e) {
                var item = e.currentTarget;
                that.trigger('itemSelected', { item: item });
            });
        },
        updateBtnStatus: function(current) {
            var disableCls = this.options.disableBtnCls;
            var pBtn = $(this[PREV_BTN]);
            var nBtn = $(this[NEXT_BTN]);
            pBtn.removeClass(disableCls);
            nBtn.removeClass(disableCls);
            if (current == 0) {
                pBtn.addClass(disableCls);
            }
            if (current == this.length - 1) {
                nBtn.addClass(disableCls);
            }
        }
    });
});
