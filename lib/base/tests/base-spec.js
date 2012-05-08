/* @author lifesinger@gmail.com */

define(function(require) {

    var Base = require('../src/base');


    describe('Base', function() {

        test('normal usage', function() {

            var Animal = Base.extend({
                initialize: function(name) {
                    this.name = name;
                },
                getName: function() {
                    return this.name;
                }
            });

            expect(new Animal('Tom').name).toBe('Tom');

            var Bird = Animal.extend({
                fly: function() {
                    return 'I can fly';
                }
            });

            var bird = new Bird('Twitter');
            expect(bird.name).toBe('Twitter');
            expect(bird.fly()).toBe('I can fly');
        });

        test('events supporting', function() {
            var counter = 0;

            var Bird = Base.extend({
                initialize: function(name) {
                    this.name = name;
                },
                fly: function() {
                    this.trigger('fly');
                }
            });

            var bird = new Bird('Twitter');
            bird.on('fly', function() {
                counter++;
            });

            expect(counter).toBe(0);
            bird.fly();
            expect(counter).toBe(1);

            bird.off().fly();
            expect(counter).toBe(1);
        });

        test('options merging', function() {

            var Widget = Base.extend({
                options: {
                    color: '#fff',
                    size: {
                        width: 100,
                        height: 100
                    }
                },
                initialize: function(options){
                    this.setOptions(options);
                }
            });

            var myWidget = new Widget({
                color: '#f00',
                size: {
                    width: 200
                },
                position: {
                    top: 50,
                    left: 100
                }
            });

            var options = myWidget.options;
            expect(options.color).toBe('#f00');
            expect(options.size.width).toBe(200);
            expect(options.size.height).toBe(100);
            expect(options.position.top).toBe(50);
            expect(options.position.left).toBe(100);
        });

        test('options cloning', function() {

            var Widget = Base.extend({
                options: {
                    color: '#fff',
                    size: {
                        width: 100,
                        height: 100
                    }
                },
                initialize: function(options){
                    this.setOptions(options);
                }
            });

            // Deep copy example
            var mySize = {
                width: 50,
                height: 50
            };

            var myWidget = new Widget({
                size: mySize
            });

            var options = myWidget.options;
            expect(options.color).toBe('#fff');
            expect(options.size === mySize).toBe(false);
        });

        test('options in combination with events', function() {
            var counter = 0;

            var Widget = Base.extend({
                options: {
                    color: '#fff',
                    size: {
                        width: 100,
                        height: 100
                    }
                },
                initialize: function(options) {
                    this.setOptions(options);
                },
                show: function() {
                    // Do some cool stuff
                    this.trigger('show');
                }

            });

            var myWidget = new Widget({
                color: '#f00',
                size: {
                    width: 200
                },
                onShow: function() {
                    counter++;
                }
            });

            myWidget.show();

            expect(counter).toBe(1);
        });

    });

});
