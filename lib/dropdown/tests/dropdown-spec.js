define(function(require) {

    var $ = require('jquery');
    var Dropdown = require('../src/dropdown');

    describe('dropdown', function() {
        var element = '<div>' +
                            '<a href="#" id="element1">dropdown</a>' +
                            '<ul id="target1">' +
                                '<li>那些年，我们一起写过的单元测试...</li>' +
                                '<li>卖萌是一种风格...</li>' +
                            '</ul>'+
                      '</div>';
        beforeEach(function() {
            element = $(element).appendTo(document.body);
        });

        afterEach(function() {
            element.remove();
        });

        test('instance', function() {
            var test1 = new Dropdown({
                trigger: '#element1',
                element: '#target1',
                timeout: 200
            });
            expect(test1.element.attr('id')).toBe('target1');
            expect(test1.triggerNode.attr('id')).toBe('element1');
            expect(test1.options.timeout).toBe(200);
            expect(test1.options.triggerType).toBe('hover');
            expect(test1.options.x).toBe(0);
            expect(test1.options.y).toBe(0);
            expect(test1.options.z).toBe(99);
        });

        test('event', function() {
            var event1;
            var event2;
            var status;
            var test2 = new Dropdown({
                trigger: '#element1',
                element: '#target1'
            });

            // 订阅事件
            test2.on('shown', function(){
                event1 = 'test2 is shown';
            }).on('hidden', function(){
                event2 = 'test2 is hidden';
            });

            test2.trigger('shown').trigger('hidden');

            expect(event1).toBe('test2 is shown');
            expect(event2).toBe('test2 is hidden');

            // 鼠标移入
            $('#element1').trigger('mouseover');
            status = $('#target1').is(':visible');
            expect(status).toBe(true);

            // 鼠标移出
            $('#element1').trigger('mouseout');
            status = $('#target1').is(':hidden');
            expect(status).toBe(false);

        });


    });

});
