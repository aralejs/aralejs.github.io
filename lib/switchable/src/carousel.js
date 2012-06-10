define(function(require, exports, module) {

    var Switchable = require('./switchable');
    var $ = require('jquery');

    var UI_SWITCHABLE = 'ui-switchable';
    var PREV_BUTTON_CLASS = UI_SWITCHABLE + '-prev-button';
    var NEXT_BUTTON_CLASS = UI_SWITCHABLE + '-next-button';
    var DISABLED_BUTTON_CLASS = UI_SWITCHABLE + '-disabled-button';


    // 旋转木马组件
    module.exports = Switchable.extend({

        attrs: {
            circular: true,

            prevButton: {
                getter: function(val) {
                    return $(val).eq(0);
                }
            },

            nextButton: {
                getter: function(val) {
                    return $(val).eq(0);
                }
            }
        },

        _parseRole: function() {
            Switchable.prototype._parseRole.call(this);

            var role = this.dataset.role;
            if (!role) return;

            // attr 里没找到时，才根据 data-role 来解析
            var prevButton = this.get('prevButton');
            var nextButton = this.get('nextButton');

            if (!prevButton[0] && role.prev) {
                prevButton = this.$(role.prev);
                this.set('prevButton', prevButton);
            }

            if (!nextButton[0] && role.next) {
                nextButton = this.$(role.next);
                this.set('nextButton', nextButton);
            }

            prevButton.addClass(PREV_BUTTON_CLASS);
            nextButton.addClass(NEXT_BUTTON_CLASS);
        },

        _initTriggers: function() {
            Switchable.prototype._initTriggers.call(this);

            var that = this;
            var circular = this.get('circular');

            this.get('prevButton').click(function(ev) {
                ev.preventDefault();
                if (circular || that.get('activeIndex') > 0) {
                    that.prev();
                }
            });

            this.get('nextButton').click(function(ev) {
                ev.preventDefault();
                var len = that.get('length') - 1;
                if (circular || that.get('activeIndex') < len) {
                    that.next();
                }
            });

            // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
            // circular = true 时，无需处理
            if (!circular) {
                this.on('switch', function(toIndex) {
                    that._updateButtonStatus(toIndex);
                });
            }
        },

        _updateButtonStatus: function(toIndex) {
            var prevButton = this.get('prevButton');
            var nextButton = this.get('nextButton');

            prevButton.removeClass(DISABLED_BUTTON_CLASS);
            nextButton.removeClass(DISABLED_BUTTON_CLASS);

            if (toIndex === 0) {
                prevButton.addClass(DISABLED_BUTTON_CLASS);
            }
            else if (toIndex === this.get('length') - 1) {
                nextButton.addClass(DISABLED_BUTTON_CLASS);
            }
        }

    });

});
