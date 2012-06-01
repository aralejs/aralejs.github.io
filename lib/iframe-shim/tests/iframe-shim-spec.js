define(function(require) {

    var Shim = require('../src/iframe-shim'),
        $ = require('jquery');

    describe('iframe-shim', function() {

        var div, isIE6 = $.browser.msie && $.browser.version == 6.0;

        beforeEach(function() {
            div = $('<div></div>').appendTo(document.body);
        });

        afterEach(function() {
            div.remove();
        });

        // 测试非 ie6 下返回的空实例
        test('return empty instance except ie6', function() {
            var target = $('<div></div>').css({'width': '100px', 'height': '100px', 'border': '1px solid #fff', 'z-index': 10}).appendTo(div);

            if (!isIE6) {
                var iframe = new Shim(target[0]);
                iframe.sync();

                expect(iframe.iframe).toBeUndefined();
                expect(iframe.target).toBeUndefined();

                expect(iframe.sync).toBeDefined();
                expect(iframe.destroy).toBeDefined();
            }

        });

        // 测试 iframe-shim 生成实例正常
        test('normal initialize ', function() {
            var target = $('<div></div>').css({'width': '100px', 'height': '100px', 'border': '1px solid #fff', 'z-index': 10}).appendTo(div);

            if (isIE6) {
                var iframe = new Shim(target[0]);
                iframe.sync();

                var iframeOffset = iframe.iframe.offset();
                var elementOffset = iframe.target.offset();

                expect(iframe.iframe.css('height')).toBe('102px');
                expect(iframe.iframe.css('width')).toBe('102px');
                expect(iframeOffset.left).toBe(elementOffset.left);
                expect(iframeOffset.top).toBe(elementOffset.top);
                expect(iframe.iframe.css('z-index')).toBe(9);
            }

        });

        // 测试 sync 函数，修改目标元素宽高和边框，iframe 重新计算
        test('function sync', function() {
            var target = $('<div></div>').css({'width': '100px', 'height': '100px', 'border': '1px solid #fff', 'z-index': 10}).appendTo(div);

            if (isIE6) {
                var iframe = new Shim(target[0]);
                target.css({'width': '400px', 'height': '200px', 'border': '5px solid #fff'});

                iframe.sync();

                expect(iframe.iframe.css('height')).toBe('210px');
                expect(iframe.iframe.css('width')).toBe('410px');
            }
        });

        // 测试当目标元素隐藏的时候sync函数，iframe会隐藏
        test('function sync when target is hidden', function() {
            var target = $('<div></div>').css({'width': '100px', 'height': '100px', 'border': '1px solid #fff', 'z-index': 10}).appendTo(div);

            if (isIE6) {
                var iframe = new Shim(target[0]);

                target.css({'width': 0, 'border': 'none'});
                iframe.sync();
                expect(iframe.iframe).toBeUndefined();

                target.css({'width': '10px', 'border': 'none'});
                iframe.sync();
                expect(iframe.iframe.css('display') === 'none').toBeFalsy();

                target.css({'display': 'none'});
                iframe.sync();
                expect(iframe.iframe.css('display')).toBe('none');
            }
        });

        // 测试 destroy 函数
        test('function destroy', function() {
            var target = $('<div></div>').css({'width': '100px', 'height': '100px', 'border': '1px solid #fff', 'z-index': 10}).appendTo(div);

            if (isIE6) {
                var shim = new Shim(target[0]).sync();
                shim.destroy();

                expect(shim.iframe).toBeUndefined();
                expect(shim.target).toBeUndefined();
            }
        });

        // 测试 destroy 函数没有调用 sync
        test('function destroy when sync is not called', function() {
            var target = $('<div></div>').css({'width': '100px', 'height': '100px', 'border': '1px solid #fff', 'z-index': 10}).appendTo(div);

            if (isIE6) {
                var shim = new Shim(target[0]);
                shim.destroy();

                expect(shim.iframe).toBeUndefined();
                expect(shim.target).toBeUndefined();
            }
        });
    });
});
