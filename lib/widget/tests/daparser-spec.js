define(function(require) {

    var DAParser = require('../src/daparser');
    var $ = require('$');
    var body = document.body;


    describe('DAParser', function() {

        test('single data-xx', function() {
            var div = $('<div data-key="value"></div>').appendTo(body);
            var dataset = DAParser.parse(div[0]);

            expect(typeof dataset.key).toBe('object');
            expect(/\.daparser\-\d+/.test(dataset.key.value));
            expect(div.hasClass('daparser-0')).toBe(true);

            div.remove();
        });

        test('multi data-xx', function() {
            var div = $('<div data-key="value" data-key2="val2"></div>').appendTo(body);
            var dataset = DAParser.parse(div[0]);

            expect(typeof dataset.key).toBe('object');
            expect(/\.daparser\-\d+/.test(dataset.key.value));
            expect(typeof dataset.key2).toBe('object');
            expect(/\.daparser\-\d+/.test(dataset.key2.value));

            div.remove();
        });

        test('nested data-xx', function() {
            var div = $('<div id = "t1" data-key="val"><span data-key2="val2"></span></div>').appendTo(body);
            var dataset = DAParser.parse(div[0]);

            expect($(dataset.key.val).length).toBe(1);
            expect($(dataset.key.val)[0].id).toBe('t1');
            expect($(dataset.key2.val2)[0].tagName).toBe('SPAN');

            div.remove();
        });

        test('multi matches of one data-xx', function() {
            var div = $('<div id = "t1" data-xx="val"><span data-xx="val"></span></div>').appendTo(body);
            var dataset = DAParser.parse(div[0]);

            expect($(dataset.xx.val).length).toBe(2);
            expect($(dataset.xx.val)[0].id).toBe('t1');
            expect($(dataset.xx.val)[1].tagName).toBe('SPAN');

            div.remove();
        });

        test('convert dash-name to camelCasedName', function() {
            var div = $('<div data-dash-name-123x-y="val" data-x-y="val" data-AbcD-x="val"></div>').appendTo(body);
            var dataset = DAParser.parse(div[0]);

            //console.dir(div[0].dataset);
            //console.dir(dataset);

            // chrome 和 firefox 的处理不同，悲催的兼容性，苦逼的前端呀。
            //expect(dataset['dashName-123xY']).toBe(undefined);

            expect($(dataset['xY'].val).length).toBe(1);
            expect($(dataset['abcDX'].val).length).toBe(1);

            div.remove();
        });

    });
});
