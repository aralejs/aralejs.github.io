define(function(require) {

    var Widget = require('../src/widget');
    var Templatable = require('../src/templatable');

    var Handlebars = require('handlebars');
    var $ = require('$');


    describe('Templatable', function() {

        var TemplatableWidget = Widget.extend({
            Implements: Templatable
        });

        test('normal usage', function() {

            var widget = new TemplatableWidget({
                template: '<div><h3>{{title}}</h3><p>{{content}}</p></div>',
                model: {
                    title: 'Big Bang',
                    content: 'It is very cool.'
                }
            });

            expect(widget.$('h3').text()).toBe('Big Bang');
            expect(widget.$('p').text()).toBe('It is very cool.');
        });

        test('Handlebars helpers', function() {

            var TestWidget = TemplatableWidget.extend({
                templateHelpers: {
                    'link': function(obj) {
                        return new Handlebars.SafeString('<a href="' + obj.href + '">' + obj.text + '</a>');
                    }
                }
            });

            var widget = new TestWidget({
                template: '<p>{{link item}}</p>',
                model: {
                    item: {
                        href: 'http://google.com/',
                        text: 'google'
                    }
                }
            });

            expect(widget.element.html().toLowerCase()).toBe('<a href="http://google.com/">google</a>')
        });

        test('renderPartial', function() {

            var t = new TemplatableWidget({
                template: '<div id="t"><h3>{{title}}</h3><div>{{content}}</div></div>',
                model: {
                    title: 'This is a title',
                    content: 'This is content'
                }
            });

            t.render();
            expect($('#t')[0]).toBe(t.element[0]);

            t.renderPartial('h3', { title: 'xxx' });
            expect(t.$('h3').html()).toBe('xxx');

            // destroy
            t.element.remove();
        });

        test('template expression in invalid place', function() {

            var t = new TemplatableWidget({
                template: '<table id="t"><tbody><tr><td>&lt;!--{{xx}}--&gt;</td>{{#each items}}<td class="item-{{this}}">{{this}}</td>{{/each}}</tr></tbody></table>',
                model: {
                    xx: 'xx',
                    items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            });

            t.render();
            expect($('#t tbody td').length).toBe(10);
            expect($('#t tbody td').eq(1).hasClass('item-1')).toBe(true);
            expect($('#t tbody td').eq(0).html()).toBe('&lt;!--xx--&gt;');

            t.renderPartial('tbody tr', { xx: 'xx', items: [1, 2, 3, 4, 5] });
            expect($('#t tbody td').length).toBe(6);
            expect($('#t tbody td').eq(1).hasClass('item-1')).toBe(true);
            expect($('#t tbody td').eq(0).html()).toBe('&lt;!--xx--&gt;');

            // destroy
            //t.element.remove();
        });

    });

});
