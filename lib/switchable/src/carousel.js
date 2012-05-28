//Carousel Widget
define(function(require, exports, module) {
    var Switchable = require('./switchable');

    var CLS_PREFIX = 'ui-switchable-',
        PREV_BTN = 'prevBtn',
        NEXT_BTN = 'nextBtn',
        CLS_PANEL_INTERNAL = CLS_PREFIX + 'panel-internal',
        DOM_EVENT = {
            originalEvent: {
                target: 1
            }
        };

    var Carousel = module.exports = Switchable.extend({
        attrs: {
            circular: true,
            prevButtonClass: CLS_PREFIX + 'prev-btn',
            nextButtonClass: CLS_PREFIX + 'next-btn',
            disableButtonClass: CLS_PREFIX + 'disable-btn'
        },
        _bindTriggers: function() {
            var that = this;
            Carousel.superclass._bindTriggers.apply(this, arguments);
            var element = this.element;
            var circular = this.get('circular');
               // 获取 prev/next 按钮，并添加事件
            var events = {};

            this[PREV_BTN] = this.$('.' + this.get('prevButtonClass'));
            events['mousedown .' + this.get('prevButtonClass')] = function(e) {
                e.preventDefault();
                if (this.activeIndex != 0 || this.get('circular')) {
                    this.prev(DOM_EVENT);
                }
            };

            this[NEXT_BTN] = this.$('.' + this.get('nextButtonClass'));
            events['mousedown .' + this.get('nextButtonClass')] = function(e) {
                var len = this.length - 1;
                e.preventDefault();
                if (this.activeIndex != len || this.get('circular')) {
                    this.next(DOM_EVENT);
                }
            }

            // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
            // circular = true 时，无需处理
            if (!this.get('circular')) {
                this.on('switch', function(e) {
                    that.updateBtnStatus(e.currentIndex);
                });
            }

            // 触发 itemSelected 事件
            events['click .' + CLS_PANEL_INTERNAL] = function(e) {
                var item = e.currentTarget;
                this.trigger('itemSelected', { item: item });
            };

            this.delegateEvents(events);
        },

        updateBtnStatus: function(current) {
            var disableCls = this.get('disableButtonClass');
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
