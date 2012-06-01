define(function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('overlay'),
        easing = require('easing'),
        Dialog = require('../src/dialog');

    // AnimDialog
    // -------
    // AnimDialog 组件继承自 Dialog组件，提供了显隐的基本动画。

    var AnimDialog = Dialog.extend({

        attrs: {
            // 显示的动画效果
            showEffect: {
                type: 'fade',
                duration: 400,      // 动画时长
                easing: 'easeOut', // 平滑函数
                from: 'up'          // 方向 up|down|left|right
            },
            // 隐藏时的动画效果，若为空则采用 showEffect
            hideEffect: null
        },

        show: function() {
            if(!this._rendered) {
                this.render();
            }
            var ef = this.get('showEffect'),
                elem = this.element,
                that = this;

            // 无动画
            if(!ef || ef.type === 'none') {
                elem.show();
            }
            // 淡入淡出
            else if(ef.type === 'fade') {
                elem.hide().fadeIn(ef.duration, ef.easing);
            }
            // 滑动
            else if(ef.type === 'slide') {
                var properties = /left|right/i.test(ef.from)
                        ? { width: 'toggle' } 
                        : { height: 'toggle' };
                elem.hide().animate(properties, {
                    duration: ef.duration,
                    easing: ef.easing
                });
            }
            // 移动
            else if(ef.type === 'move') {
                // 得到窗口层
                createLayer.call(this, elem);

                var width = this._layer.get('width'),
                    height = this._layer.get('height'),
                    properties;

                // 位置和显示前的准备
                elem.appendTo(this._layer.element).css({
                    top: 0,
                    left: 0,
                    display: 'block'
                });
                
                if (ef.from == 'left') {
                    elem.css('left', parseInt(elem.css('left')) - width);
                    properties = { left: '+=' + width };
                }
                else if (ef.from == 'right') {
                    elem.css('left', parseInt(elem.css('left')) + width);    
                    properties = { left: '-=' + width };                    
                }
                else if (ef.from == 'up') {
                    elem.css('top', parseInt(elem.css('top')) - height);
                    properties = { top: '+=' + height };                    
                }
                else if (ef.from == 'down') {
                    elem.css('top', parseInt(elem.css('top')) + height);
                    properties = { top: '-=' + height };                    
                }

                elem.animate(properties, {
                    duration: ef.duration,
                    easing: ef.easing,
                    complete: function() {
                        // 这里要复原因为 move 而造成的文档变化
                        // 真恶心
                        that.element.appendTo(document.body);
                        that.set('align', that.get('align'));
                        that._layer.hide();
                    }
                });
            }

            return this;
        },

        hide: function() {
            var ef = this.get('hideEffect') || this.get('showEffect'),
                elem = this.element,
                that = this;

            // 无动画
            if(!ef || ef.type === 'none') {
                elem.hide();
            }
            // 淡入淡出
            else if(ef.type === 'fade') {
                elem.fadeOut(ef.duration, ef.easing);
            }
            // 滑动
            else if(ef.type === 'slide') {
                var properties = /left|right/i.test(ef.from)
                        ? { width: 'toggle' } 
                        : { height: 'toggle' };
                elem.animate(properties, {
                    duration: ef.duration,
                    easing: ef.easing
                });
            }
            // 移动
            else if(ef.type === 'move') {
                // 得到窗口层
                createLayer.call(this, elem);
                
                var width = this._layer.get('width'),
                    height = this._layer.get('height'),
                    properties;

                // 位置和显示前的准备
                elem.appendTo(this._layer.element).css({
                    top: 0,
                    left: 0,
                    display: 'block'
                });

                if (ef.from == 'left') {
                    properties = { left: '-=' + width };
                }
                else if (ef.from == 'right') {
                    properties = { left: '+=' + width };
                }
                else if (ef.from == 'up') {
                    properties = { top: '-=' + height };
                }
                else if (ef.from == 'down') {
                    properties = { top: '+=' + height };
                }

                elem.animate(properties, {
                    duration: ef.duration,
                    easing: ef.easing,
                    complete: function() {
                        that.element.appendTo(document.body);
                        that.set('align', that.get('align'));
                        that.element.hide();
                        that._layer.hide();
                    }
                });
            }

            return this;
        }

    });

    module.exports = AnimDialog;

    // Helpers
    // -------

    // 准备好窗口层
    function createLayer(elem) {
        if(!this._layer) {
            this._layer = new Overlay({
                width: elem.outerWidth(true),
                height: elem.outerHeight(true),
                zIndex: 100,
                visible: true,
                style: {
                    overflow: 'hidden'
                },
                align: {
                    baseElement: elem[0]
                }
            });
        }
        this._layer.show();
    }

});

