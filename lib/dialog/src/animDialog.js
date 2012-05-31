define(function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('overlay'),
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
                easing: 'easeNone', // 平滑函数
                from: 'up'          // 方向 up|down|left|right
            },
            // 隐藏时的动画效果，若为空则采用 showEffect
            hideEffect: null
        },

        setup: function() {
            AnimDialog.superclass.setup.call(this);
            if(!this.get('hideEffect')) {
                this.set('hideEffect', this.get('showEffect'));
            }
        },

        show: function() {
            var ef = this.get('showEffect'),
                elem = this.element;

            // 无动画
            if(!ef || ef.type === 'none') {
                elem.show();
            }
            // 淡入淡出
            else if(ef.type === 'fade') {
                elem.hide().fadeIn(ef.duration);
            }
            // 滑动
            else if(ef.type === 'slide') {
                var properties = /left|right/i.test(ef.from)
                        ? { width: 'toggle' } 
                        : { height: 'toggle' };
                elem.hide().animate(properties, {
                    duration: ef.duration
                });
            }
            // 移动
            else if(ef.type === 'move') {
                var width = elem.outerWidth(true),
                    height = elem.outerHeight(true);
                    properties;

                if(!this._layer) {
                    this._layer = createLayer(elem, width, height);
                    elem.appendTo(this._layer.element).css('top', 0).css('left', 0);   
                }

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
                    duration: ef.duration
                });
            }

            return this;
        },

        hide: function() {
            var ef = this.get('showEffect'),
                elem = this.element;

            // 无动画
            if(!ef || ef.type === 'none') {
                elem.hide();
            }
            // 淡入淡出
            else if(ef.type === 'fade') {
                elem.fadeOut(ef.duration);
            }
            // 滑动
            else if(ef.type === 'slide') {
                var properties = /left|right/i.test(ef.from)
                        ? { width: 'toggle' } 
                        : { height: 'toggle' };
               elem.animate(properties, {
                    duration: ef.duration
                });
            }
            // 移动
            else if(ef.type === 'move') {
                var width = elem.outerWidth(true),
                    height = elem.outerHeight(true);
                    properties;

                if(!this._layer) {
                    this._layer = createLayer(elem, width, height);
                    elem.appendTo(this._layer.element).css('top', 0).css('left', 0);   
                }

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
                    duration: ef.duration
                });
            }

            return this;
        }

    });

    module.exports = AnimDialog;

    // Helpers
    // -------

    function createLayer(elem, width, height) {
        return new Overlay({
            width: width,
            height: height,
            zIndex: 100,
            style: {
                overflow: 'hidden'
            },
            align: {
                baseElement: elem[0]
            }
        }).render().show();
    }

});


