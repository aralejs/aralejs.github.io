define(function(require, exports, module) {

    var Switchable = require('./switchable');
    var $ = require('jquery');


    // 旋转木马组件
    module.exports = Switchable.extend({

        attrs: {
            circular: true
        },

        _bindAction: function() {
            var that = this;
            Carousel.superclass._bindAction.apply(this, arguments);
            var circular = this.get('circular');
            this[prevButton] = this.$(this.get('prevButtonClass'));
            this[nextButton] = this.$(this.get('nextButtonClass'));

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
            };

            // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
            // circular = true 时，无需处理
            if (!circular) {
                this.on('beforeSwitch', function(toIndex, fromIndex) {
                    that.updateBtnStatus(toIndex, fromIndex);
                });
            }
            // 触发 itemSelected 事件
            events['click .' + this.get('classPanelInternal')] = function(e) {
                e.preventDefault();
                var item = e.currentTarget;
                this.trigger('itemSelected', { item: item });
            };

            this.delegateEvents(events);
        },

        updateBtnStatus: function(toIndex, fromIndex) {
            var disableCls = this.get('disableButtonClass');
            var pBtn = $(this[prevButton]);
            var nBtn = $(this[nextButton]);

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

});
