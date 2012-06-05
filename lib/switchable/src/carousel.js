//Carousel Widget
define(function(require, exports, module) {
    var Switchable = require('./switchable');

    var $ = require('jquery');

    var CLS_PREFIX = 'ui-switchable-',
        PREV_BTN = 'prevBtn',
        NEXT_BTN = 'nextBtn',
        CLS_PANEL_INTERNAL = CLS_PREFIX + 'panel-internal';

    var Carousel = module.exports = Switchable.extend({
        attrs: {
            circular: true,
            prevButtonClass: CLS_PREFIX + 'prev-btn',
            nextButtonClass: CLS_PREFIX + 'next-btn',
            disableButtonClass: CLS_PREFIX + 'disable-btn'
        },
        _bindAction: function() {
            var that = this;
            Carousel.superclass._bindAction.apply(this, arguments);
            var element = this.element;
            var circular = this.get('circular');
            this[PREV_BTN] = this.$(this.get('prevButtonClass'));
            this[NEXT_BTN] = this.$(this.get('nextButtonClass'));

            // 获取 prev/next 按钮，并添加事件
            var events = {};
            events['mousedown .' + this.get('prevButtonClass')] = function(e) {
                e.preventDefault();
                if (circular || this.get('activeIndex') != 0) {
                    this.prev();
                }
            };

            events['mousedown .' + this.get('nextButtonClass')] = function(e) {
                var len = this.length - 1;
                e.preventDefault();
                if (circular || this.get('activeIndex') != len) {
                    this.next();
                }
            }
            // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
            // circular = true 时，无需处理
            if (!circular) {
                this.on('beforeSwitch', function(toIndex, fromIndex) {
                    that.updateBtnStatus(toIndex, fromIndex);
                });
            }
            // 触发 itemSelected 事件
            events['click .' + CLS_PANEL_INTERNAL] = function(e) {
                e.preventDefault();
                var item = e.currentTarget;
                this.trigger('itemSelected', { item: item });
            };
            this.delegateEvents(events);
        },

        updateBtnStatus: function(toIndex, fromIndex) {
            var disableCls = this.get('disableButtonClass');
            var pBtn = $(this[PREV_BTN]);
            var nBtn = $(this[NEXT_BTN]);

            pBtn.removeClass(disableCls);
            nBtn.removeClass(disableCls);

            if (toIndex == 0) {
                pBtn.addClass(disableCls);
            }
            if (toIndex == this.length - 1) {
                nBtn.addClass(disableCls);
            }
        }
    });

    Carousel.autoRender = function(element, dataset) {
        var role = dataset.role;
        if (role) {
            if (role.nextButton) {
                dataset['prevButtonClass'] = role.nextButton;
            }
            if (role.prevButton) {
                dataset['nextButtonClass'] = role.prevButton;
            }
        }
        return Switchable.autoRender.call(Carousel, element, dataset);
    };

});
