/**
 * @author guangao@alipay.com
 */

define(function(require, exports, module) {

    var $ = require('jquery'),
        position = require('position'),
        useIframe = $.browser.msie && Number($.browser.version) < 7;

    /**
     * @constructor
     * @param {Element} target 目标元素
     * @example
     *      shim = new iframeshim($('#target')[0]);
     *      shim.sync();
     */
    var iframeshim = function(target){

        this.iframe = $('<iframe src="javascript:\'\'" frameborder="0" scrolling="no"></iframe>').css({'opacity':0,'position':'absolute'});
        this.target = $(target).after(this.iframe);

        this.sync();
    };

    iframeshim.prototype = {

        /**
         * @description 跟进目标元素计算iframe的显隐、宽高、定位
         */
        sync: function(){

            var height = this.target.outerHeight();
            var width = this.target.outerWidth();
            var zIndex = Number(this.target.css('zIndex'));
           
            // 如果目标元素隐藏或者宽高其中一个为0则隐藏
            // http://api.jquery.com/hidden-selector/
            if(this.target.is(':hidden') || !(height && width)){
                this.hide();
            }else{
                this.show();
                this.iframe.css({
                    'height': height + 'px',
                    'width': width + 'px',
                    'zIndex': isNaN(zIndex) ? 0 : (zIndex-1)
                });

                position.pin(this.iframe[0], this.target[0]);
            }
        },

        /**
         * @description 显示iframe
         */
        show: function(){
            this.iframe.css('display','block');
        },

        /**
         * @description 隐藏iframe
         */
        hide: function(){
            this.iframe.css('display','none');
        }
    };

    /**
     * @description 工厂方法，每次返回一个实例
     */
    module.exports =  function(target){

        if(!target){
            throw('Target must be spicified');
        }

        if(useIframe){
            // 如果target是个数组则只取第一个
            return new iframeshim($(target)[0]); 
        }

        // 除了ie6都返回空实例
        return new function(){
            var method = ['sync', 'show', 'hide'], i;

            for(i in method){
                this[method[i]] = function(){};
            }
        };
    }

});
