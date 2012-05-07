/*
 * @author guangao@alipay.com
 **/

define(function(require) {

    var shim = require('../src/iframe-shim'),
        $ = require('jquery');

    describe('iframe-shim', function() {

        var cont, useIframe = $.browser.msie && Number($.browser.version) < 7;

        beforeEach(function(){
            cont = $('<div></div>').appendTo(document.body);
        });
        
        afterEach(function(){
            cont.remove();
        });

        // 测试非ie6下返回的空实例
        test('Test return empty instance except ie6', function() {
            var target = $('<div></div>').css({'width':'100px','height':'100px','border':'1px solid #fff','z-index':10}).appendTo(cont);

            if(!useIframe){
                var iframe = shim(target[0]);    
                expect(iframe.iframe).toBeUndefined();
                expect(iframe.element).toBeUndefined();

                expect(iframe.sync).toBeDefined();
                expect(iframe.show).toBeDefined();
                expect(iframe.show).toBeDefined();
            }

        });

        // 测试iframe-shim生成实例正常
        test('Test normal initialize ', function(){
            var target = $('<div></div>').css({'width':'100px','height':'100px','border':'1px solid #fff','z-index':10}).appendTo(cont);
            
            if(useIframe){
                var iframe = shim(target[0]),
                    iframeOffset = iframe.iframe.offset(),
                    elementOffset = iframe.element.offset();
                
                expect(iframe.iframe.css('height')).toBe('102px');
                expect(iframe.iframe.css('width')).toBe('102px');
                expect(iframeOffset.left).toBe(elementOffset.left);
                expect(iframeOffset.top).toBe(elementOffset.top);
                expect(iframe.iframe.css('z-index')).toBe(9);
            }
        
        });

        // 测试sync函数，修改目标元素宽高和边框，iframe重新计算
        test('Test function sync', function(){
            var target = $('<div></div>').css({'width':'100px','height':'100px','border':'1px solid #fff','z-index':10}).appendTo(cont);
            
            if(useIframe){
                var iframe = shim(target[0]);
                
                target.css({'width':'400px','height':'200px','border':'5px solid #fff'})

                iframe.sync();
            
                expect(iframe.iframe.css('height')).toBe('210px');
                expect(iframe.iframe.css('width')).toBe('410px');
            }
        });

        // 测试当目标元素隐藏的时候sync函数，iframe会隐藏
        test('Test function sync when target is hidden', function(){
            var target = $('<div></div>').css({'width':'100px','height':'100px','border':'1px solid #fff','z-index':10}).appendTo(cont);
            
            if(useIframe){
                var iframe = shim(target[0]);
                
                target.css({'width':0,'border':'none'});
                iframe.sync();
                expect(iframe.iframe.css('display')).toBe('none');

                target.css({'width':'10px','border':'none'});
                iframe.sync();
                expect(iframe.iframe.css('display')).toBe('block');

                target.css({'display':'none'});
                iframe.sync();
                expect(iframe.iframe.css('display')).toBe('none');
            }
        });

        // 测试show函数
        test('Test function show', function(){
            var target = $('<div></div>').css({'width':'100px','height':'100px','border':'1px solid #fff','z-index':10}).appendTo(cont);
            
            if(useIframe){
                var iframe = shim(target[0]);
                iframe.show();
            
                expect(iframe.iframe.css('display')).toBe('block');
            }
        });

        // 测试hide函数
        test('Test function hide', function(){
            var target = $('<div></div>').css({'width':'100px','height':'100px','border':'1px solid #fff','z-index':10}).appendTo(cont);
            
            if(useIframe){
                var iframe = shim(target[0]);
                iframe.hide();
            
                expect(iframe.iframe.css('display')).toBe('none');
            }
        });
    });
});
