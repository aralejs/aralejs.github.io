define(function(require) {

    var Widget = require('../src/widget');
    var Templatable = require('../src/templatable');

    var Handlebars = require('handlebars');
    var $ = require('$');

    // for debug
    this.$ = $;
    this.Handlebars = Handlebars;


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

            t.model = { title: 'xxx' };
            t.renderPartial('h3');
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

            t.model = { xx: 'xx', items: [1, 2, 3, 4, 5] };
            t.renderPartial('tbody tr');
            expect($('#t tbody td').length).toBe(6);
            expect($('#t tbody td').eq(1).hasClass('item-1')).toBe(true);
            expect($('#t tbody td').eq(0).html()).toBe('&lt;!--xx--&gt;');

            // destroy
            t.element.remove();
        });

        test('Handlebars.print', function() {
            var template = '<table id="{{a.b.c xx yy a=true b=1}}"><tbody>{{#each items}}<td class="item-{{this}}">{{this}}</td>{{/each}}</tbody></table><div>{{#if current}}<p>{{xx}}</p>{{/if}}</div>';
            var ast = Handlebars.parse(template);
            var out = Handlebars.print(ast);
            expect(out).toBe(template);
        });

        test('no auto insert tags', function() {
            var EACH_ITEMS = '{{#each items}}<td class="item-{{this}}">{{this}}</td>{{/each}}';

            var t = new TemplatableWidget({
                template: '<table id="t"><tbody>' + EACH_ITEMS + '</tbody></table>',
                model: {
                    xx: 'xx',
                    items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
                }
            }).render();

            expect(t.getTemplatePartial('tbody')).toBe(EACH_ITEMS);

            // destroy
            t.element.remove();
        });

    });

});
