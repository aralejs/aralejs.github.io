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

            expect(widget.element.html().toLowerCase()).toBe('<a href="http://google.com/">google</a>')
        });

    });

});
