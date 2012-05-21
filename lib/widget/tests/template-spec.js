define(function(require) {

    var Widget = require('../src/widget');
    var Handlebars = require('handlebars');
    var $ = require('$');


    describe('Template', function() {

        var TemplateWidget = Widget.extend({
            Implements: Widget.Template
        });

        test('normal usage', function() {

            var widget = new TemplateWidget({
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

            var TestWidget = TemplateWidget.extend({
                helpers: {
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

            expect(widget.element.html()).toBe('<a href="http://google.com/">google</a>')
        });

    });

});
