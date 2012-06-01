define(function(require) {

    var $ = require('jquery');
    var Dropdown = require('../src/dropdown');

    describe('dropdown', function() {
        var element = '<div>' +
                            '<a href="#" id="trigger1">dropdown</a>' +
                            '<ul id="element1">' +
                                '<li>那些年，我们一起写过的单元测试...</li>' +
                                '<li>卖萌是一种风格...</li>' +
                            '</ul>' +
                      '</div>';
        beforeEach(function() {
            element = $(element).appendTo(document.body);
        });

        afterEach(function() {
            element.remove();
        });

        test('instance', function() {
            var test1 = new Dropdown({
                trigger: '#trigger1',
                element: '#element1',
                timeout: 200
            });
            var trigger = test1.get('trigger');
            var align = test1.get('align');
            expect(trigger.attr('id')).toBe('trigger1');
            expect(test1.element.attr('id')).toBe('element1');
            expect(test1.get('triggerType')).toBe('mouseenter');
            expect(test1.get('timeout')).toBe(200);
            expect(test1.get('delay')).toBe(100);
            expect(align.baseElement).toEqual(trigger[0]);
            expect(align.baseXY).toEqual([0,'100%']);
            expect(align.selftXY).toEqual([0,0]);
        });

        test('event', function() {
            var event1;
            var event2;
            var test2 = new Dropdown({
                trigger: '#trigger1',
                element: '#element1'
            });

            var showText = 'test2 is shown';
            var hideText = 'test2 is hidden';
            // 订阅事件
            test2.on('shown', function() {
                event1 = showText;
            }).on('hidden', function() {
                event2 = hideText;
            });
            // 发布事件
            test2.trigger('shown').trigger('hidden');
            // 测试值
            expect(event1).toBe(showText);
            expect(event2).toBe(hideText);

            // 鼠标移入
            $('#trigger1').trigger('mouseover');
            test2.after('show', function(){
                expect(test2.get('trigger').is(':visible')).toBe(true);
                expect(test2.element.is(':visible')).toBe(true);
            });

            // 鼠标移出
            $('#trigger1').trigger('mouseout');

            test2.after('hide', function() {
                expect(test2.get('trigger').is(':visible')).toBe(true);
                expect(test2.element.is(':hidden')).toBe(true);
            });

        });


    });

});
