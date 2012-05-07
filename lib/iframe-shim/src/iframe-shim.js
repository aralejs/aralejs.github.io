/*
 * @author guangao@alipay.com
 **/

define(function(require, exports, module) {
    var $ = require('jquery'),
        position = require('position'),
        useIframe = $.browser.msie && Number($.browser.version) < 7;

    var iframeshim = function(element){

        this.iframe = $('<iframe src="javascript:\'\'" frameborder="0" scrolling="no"></iframe>').css({'opacity':0,'position':'absolute'});
        this.element = $(element).after(this.iframe);

        this.sync();
    };

    iframeshim.prototype = {

        sync: function(){

            var height = this.element.outerHeight();
            var width = this.element.outerWidth();
            var zIndex = Number(this.element.css('zIndex'));
           
            // 如果目标元素隐藏或者宽高其中一个为0则隐藏
            // http://api.jquery.com/hidden-selector/
            if(this.element.is(':hidden') || !(height && width)){
                this.hide();
            }else{
                this.show();
                this.iframe.css({
                    'height': height + 'px',
                    'width': width + 'px',
                    'zIndex': isNaN(zIndex) ? 0 : (zIndex-1)
                });

                position.pin(this.iframe[0], this.element[0]);
            }
        },

        show: function(){
            this.iframe.css('display','block');
        },

        hide: function(){
            this.iframe.css('display','none');
        }
    };

    module.exports =  function(element){

        if(!element){
            throw('Element must be spicified');
        }

        if(useIframe){
            // 如果element是个数组则只取第一个
            return new iframeshim($(element)[0]); 
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
