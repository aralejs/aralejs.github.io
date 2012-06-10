define(function(require, exports, module) {

    var $ = require('jquery');
    var SILENT = {silent: true};

    //TODO 需要统一维护这些常量，看是否能作为类的静态变量。
    var UI_SWITCHABLE = 'ui-switchable';
    var ACTIVE_CLASS = UI_SWITCHABLE + '-active';

    // 手风琴组件
    module.exports = {
        isNeeded: function() {
            return this.get('multiple');
        },
        methods: {
             _onFocusTrigger: function(type, index) {

                // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
                var fromIndex = this.get('activeIndex');
                this.set('activeIndex', index, SILENT);
                this._switchTo(index, fromIndex);
            },

            _switchTrigger: function(toIndex, fromIndex) {
                var toTrigger = this.triggers[toIndex];
                $(toTrigger).toggleClass(ACTIVE_CLASS);
            },

            // 重复触发时的有效判断
            _triggerIsValid: function(toIndex, fromIndex) {
                // multiple 模式下，再次触发意味着切换展开/收缩状态
                return true;
            },

            // 切换视图
            _switchPanel: function(panelInfo) {
                var panel = panelInfo.toPanels;
                $(panel).toggle();
            }
        }
    };

});

//TODO 是否可以把multiple为true的情况，也作为一个插件功能进行扩展？
// 因为现在对于multiple的判断有点冗余
