define(function(require) {

    var Widget = require('../src/widget');
    var $ = require('$');


    describe('Widget', function() {

        test('initOptions', function() {
            var div = $('<div id="a"></div>').appendTo(document.body);

            var WidgetA = Widget.extend({
                options: {
                    element: '#default',
                    foo: 'foo',
                    template: '<span></span>'
                },
                model: {
                    title: 'default title',
                    content: 'default content'
                }
            });

            var a = new WidgetA({
                element: '#a',
                bar: 'bar',
                template: '<a></a>',
                model: {
                    title: 'title a'
                }
            });

            // 传入的
            expect(a.options.bar).toBe('bar');

            // 继承的
            expect(a.options.foo).toBe('foo');

            // 覆盖的
            expect(a.options.template).toBe('<a></a>');

            // 混入的
            expect(a.model.title).toBe('title a');
            expect(a.model.content).toBe('default content');

            // attr 式属性
            expect(a.element[0].id).toBe('a');

            div.remove();
        });

        test('parseElement', function() {
            var div = $('<div id="a"></div>').appendTo(document.body);

            // 如果 options 里不传 element，默认用 $('<div></div>') 构建
            var widget = new Widget();
            expect(widget.element[0].tagName).toBe('DIV');

            // 如果传入 selector，会自动转为为 $ 对象
            widget = new Widget({ element: '#a' });
            expect(widget.element[0].id).toBe('a');

            // 如果传入 DOM 对象，会自动转换为 $ 对象
            widget = new Widget({ element: document.getElementById('a') });
            expect(widget.element[0].id).toBe('a');

            // 如果传入 $ 对象，保持不变
            widget = new Widget({ element: $('#a') });
            expect(widget.element[0].id).toBe('a');

            // 如果传入的 dom 对象不存在，则报错
            try {
                new Widget({ element: '#b' });
                expect('应该抛错').toBe('没有抛错');
            } catch (e) {
            }

            // 同时传入 template 和 element 时，element 优先
            widget = new Widget({ element: '#a', template: '<span></span>' });
            expect(widget.element[0].tagName).toBe('DIV');

            // 只传入 template 时，从 template 构建
            widget = new Widget({ template: '<span></span>' });
            expect(widget.element[0].tagName).toBe('SPAN');

            div.remove();
        });

        test('parseDataAttrs', function() {

            // 默认解析 data-api
            var widget = new Widget();
            expect(typeof widget.dataset).toBe('object');

            // 可通过选项关闭 data-api
            widget = new Widget({ 'data-api': false });
            expect(widget.dataset).toBe(undefined);

            // 简单测试 dataset 正确性
            widget = new Widget({
                template: '<div data-xx="zz"></div>'
            });
            expect(typeof widget.dataset.xx.zz).toBe('string');

            // 将 data-action 转换为 events
            Widget.prototype.x = function() {};
            Widget.prototype.y = function() {};
            widget = new Widget({
                template: '<div data-action="click x"><span data-action="y"></span></div>'
            });

            var eventKeys = keys(widget.events);
            expect(eventKeys.length).toBe(2);
            expect(eventKeys[0].indexOf('click .daparser-')).toBe(0);
            expect(eventKeys[1].indexOf('click .daparser-')).toBe(0);
            expect(widget.events[eventKeys[0]]).toBe('x');
            expect(widget.events[eventKeys[1]]).toBe('y');

            // data-action 支持多个事件
            widget = new Widget({
                template: '<div data-action="click x, mouseenter y"></div>'
            });

            var names = keys(widget.dataset.action);
            expect(names.length).toBe(1);
            expect(names[0]).toBe('click x, mouseenter y');

            eventKeys = keys(widget.events);
            expect(eventKeys.length).toBe(2);
            expect(eventKeys[0].indexOf('click .daparser-')).toBe(0);
            expect(eventKeys[1].indexOf('mouseenter .daparser-')).toBe(0);
            expect(widget.events[eventKeys[0]]).toBe('x');
            expect(widget.events[eventKeys[1]]).toBe('y');

            delete Widget.prototype.x;
            delete Widget.prototype.y;
        });

    });


    // Helpers
    // -------


    var keys = Object.keys;

    if (!keys) {
        keys = function(o) {
            var result = [];

            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        }
    }

});
