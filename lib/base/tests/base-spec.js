define(function(require) {

    var Base = require('../src/base');
    var $ = require('$');


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
                    }                }
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
                }
            });

            var Man = Person.extend({
                options: {
                    o3: 'm1',
                    o4: 'm2'
                },
                initialize: function(options) {
                    Man.superclass.initialize.apply(this, arguments);
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
                    this.initOptions(options);
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

        test('attrs: normal usage', function() {

            var Overlay = Base.extend({
                attrs: {
                    name: 'overlay',
                    x: {
                        value: 0,
                        validator: function(val) {
                            return typeof val === 'number';
                        }
                    },
                    y: {
                        value: 0,
                        setter: function(val) {
                            return parseInt(val);
                        }
                    },
                    xy: {
                        getter: function() {
                            return [this.get('x'), this.get('y')];
                        }
                    }
                }
            });

            var overlay = new Overlay({ x: 10 });

            expect(overlay.get('name')).toBe('overlay');
            expect(overlay.get('x')).toBe(10);

            overlay.set('y', '2px');
            expect(overlay.get('y')).toBe(2);
            expect(overlay.get('xy')).toEqual([10, 2]);

            var errorCounter = 0;
            overlay.set('x', 'str', { error: function() {
                errorCounter++;
            }});
            expect(errorCounter).toBe(1);
        });

        test('attrs: inherited ones', function() {

            // userValue 优先
            var A = Base.extend({
                attrs: {
                    x: 'x'
                }
            });

            var B = A.extend({
                attrs: {
                    x: 'x2'
                }
            });

            var b = new B({ x: 'x3' });
            expect(b.get('x')).toBe('x3');


            // 仅覆盖 setter
            var B2 = A.extend({
                attrs: {
                    x: {
                        setter: function() {
                            return 'x2';
                        }
                    }
                }
            });

            var b2 = new B2();
            expect(b2.get('x')).toBe('x');
            b2.set('x', 'x3');
            expect(b2.get('x')).toBe('x2');
        });

        test('options and attrs', function() {

            var Overlay = Base.extend({

                options: {
                    classPrefix: 'ui-overlay-',
                    element: '#demo',
                    elementClass: '',
                    closable: true,
                    mask: true
                },

                attrs: {
                    width: 200,
                    height: 300,
                    zIndex: 99,
                    x: 0,
                    y: 0,
                    xy: {
                        getter: function() {
                            return [this.get('x'), this.get('y')];
                        },
                        setter: function(val) {
                            this.set('x', val[0]);
                            this.set('y', val[1]);
                        }
                    }
                }
            });

            var o = new Overlay({
                closable: false,
                xy: [10, 20],
                zIndex: 100,
                unknown: 'xx'
            });

            expect(o.options.width).toBe(undefined);
            expect(o.options.mask).toBe(true);
            expect(o.options.xy).toBe(undefined);
            expect(o.options.closable).toBe(false);

            expect(o.get('mask')).toBe(undefined);
            expect(o.get('closable')).toBe(undefined);
            expect(o.get('x')).toBe(10);
            expect(o.get('y')).toBe(20);
            expect(o.get('width')).toBe(200);

            expect(o.options.unknown).toBe('xx');
            expect(o.get('unknown')).toBe(undefined);
        });

        test('attrs change events', function() {
            var counter = 0;
            var counterY = 0;

            var A = Base.extend({
                attrs: {
                    x: 1,
                    y: 1
                },

                _onChangeY: function(val, prev) {
                    expect(prev).toBe(1);
                    expect(val).toBe(2);
                    counterY++;
                }

            });

            var a = new A({ x: 2 });

            a.on('change:x', function(val, prev, key) {
                if (counter === 0) {
                    expect(prev).toBe(2);
                    expect(val).toBe(3);
                }
                expect(key).toBe('x');
                expect(this).toBe(a);

                counter++;
            });

            a.set('x', 3);
            a.set('x', 3);
            expect(counter).toBe(1);

            a.set('x', 4, { silent: true });
            expect(counter).toBe(1);

            a.set('x', 5);
            expect(counter).toBe(2);

            a.set('y', 2);
            expect(counterY).toBe(1);
            a.set('y', 3, { silent: true });
            expect(counterY).toBe(1);
        });

        test('example in options.md', function() {

            var Panel = Base.extend({
                options: {
                    classPrefix: 'ui-panel',
                    mask: true
                },

                initialize: function(config) {
                    Panel.superclass.initialize.call(this, config);
                    this.element = $(config.element).eq(0);
                },

                show: function() {
                    this.trigger('show');
                    this.element.show();
                    this.trigger('shown');
                }
            });

            var panel = new Panel({
                element: '#test',
                classPrefix: 'alice-panel'
            });

            expect(panel.options.classPrefix).toBe('alice-panel');
            expect(panel.options.mask).toBe(true);

            var counter = 0;
            var panel2 = new Panel({
                element: '#test',
                classPrefix: 'alice-panel',
                onShow: function() {
                    counter++;
                    //alert('准备显示');
                },
                onShown: function() {
                    counter++;
                    //alert('显示完毕');
                }
            });

            panel2.show();
            expect(counter).toBe(2);
        });

        test('example in attrs.md', function() {

            var Panel = Base.extend({
                attrs: {
                    y: 0,
                    size: {
                        width: 100,
                        height: 100
                    }
                },

                initialize: function(config) {
                    Panel.superclass.initialize.call(this, config);
                    this.element = $(config.element).eq(0);
                },

                _onChangeY: function(val) {
                    this.element.offset({ top: val });
                }
            });

            var panel = new Panel({
                element: '#test',
                y: 100,
                size: {
                    width: 200
                }
            });

            expect(panel.get('y')).toBe(100);
            expect(panel.get('size').width).toBe(200);
            expect(panel.get('size').height).toBe(100);

            var panel2 = new Panel({ element: '#test' });
            panel2.set('y', 200);
            expect(panel2.element.offset().top).toBe(200);
        });

        test('aspect', function() {
            var counter = 1;

            var A = Base.extend({
                xxx: function(n, m) {
                    return counter += n + m;
                }
            });

            var a = new A();

            a.before('xxx', function(n, m) {
                expect(n).toBe(1);
                expect(m).toBe(2);
                expect(this).toBe(a);
            });

            a.after('xxx', function(ret) {
                expect(ret).toBe(4);
                expect(this).toBe(a);
                counter++;
            });

            a.xxx(1, 2);
            expect(counter).toBe(5);


            // invalid
            counter = 1;
            try {
                a.before('zzz', function() {
                });
            } catch (e) {
                counter++;
            }

            expect(counter).toBe(2);
        });

    });

});
