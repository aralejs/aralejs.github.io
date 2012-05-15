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
                initialize: function(options) {
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
                initialize: function(options) {
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

        test('options from ancestors', function() {

            var Person = Base.extend({
                options: {
                    o1: 'p1',
                    o2: 'p2',
                    o3: 'p3'
                },
                initialize: function(options) {
                    this.setOptions(options);
                }
            });

            var Man = Person.extend({
                options: {
                    o3: 'm1',
                    o4: 'm2'
                },
                initialize: function(options) {
                    Man.superclass.initialize.apply(this, arguments);
                    this.setOptions(options);

                }
            });

            var Child = Man.extend({
                options: {
                    o4: 'c1',
                    o5: 'c2'
                },
                initialize: function(options) {
                    Child.superclass.initialize.apply(this, arguments);

                    options.o6 = 'c6';
                    this.setOptions(options);
                }
            });

            var c = new Child({ o4: 'o4', o2: 'o2' });
            var options = c.options;

            expect(options.o1).toBe('p1');
            expect(options.o2).toBe('o2');
            expect(options.o3).toBe('m1');
            expect(options.o4).toBe('o4');
            expect(options.o5).toBe('c2');
            expect(options.o6).toBe('c6');
        });

        test('#49: deep clone bug in setOptions', function() {

            var A = Base.extend({
                options: {
                    array: [1, 2, 3],
                    element: null,
                    point: null
                },

                initialize: function(options) {
                    this.setOptions(options);
                }
            });

            var a = new A({ element: document.body });
            var options = a.options;
            options.array.push(4);

            expect(options.array.length).toBe(4);
            expect(A.prototype.options.array.length).toBe(3);
            expect(options.element).toBe(document.body);
            expect(options.point).toBe(null);
        });
    });

});
