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

        test('attrs merging', function() {

            var Widget = Base.extend({
                attrs: {
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

            expect(myWidget.get('color')).toBe('#f00');
            expect(myWidget.get('size').width).toBe(200);
            expect(myWidget.get('size').height).toBe(100);
            expect(myWidget.get('position').top).toBe(50);
            expect(myWidget.get('position').left).toBe(100);
        });

        test('attrs cloning', function() {

            var Widget = Base.extend({
                attrs: {
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

            expect(myWidget.get('color')).toBe('#fff');
            expect(myWidget.get('size') === mySize).toBe(false);
        });

        test('events declaration in config', function() {
            var counter = 0;

            var A = Base.extend({
                attrs: {
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

            var a = new A({
                color: '#f00',
                size: {
                    width: 200
                },
                onShow: function() {
                    counter++;
                },
                afterShow: function() {
                    counter++;
                },
                beforeShow: function() {
                    counter++;
                },
                onChangeColor: function() {
                    counter++;
                }
            });

            a.show();
            expect(counter).toBe(3);

            counter = 0;
            a.set('color', '#0f0');
            expect(counter).toBe(1);
        });

        test('attrs from ancestors', function() {

            var Person = Base.extend({
                attrs: {
                    o1: 'p1',
                    o2: 'p2',
                    o3: 'p3'
                }
            });

            var Man = Person.extend({
                attrs: {
                    o3: 'm1',
                    o4: 'm2'
                },
                initialize: function() {
                    Man.superclass.initialize.apply(this, arguments);
                }
            });

            var Child = Man.extend({
                attrs: {
                    o4: 'c1',
                    o5: 'c2'
                },
                initialize: function(config) {
                    config.o6 = 'c6';
                    Child.superclass.initialize.apply(this, arguments);
                }
            });

            var c = new Child({ o4: 'o4', o2: 'o2' });

            expect(c.get('o1')).toBe('p1');
            expect(c.get('o2')).toBe('o2');
            expect(c.get('o3')).toBe('m1');
            expect(c.get('o4')).toBe('o4');
            expect(c.get('o5')).toBe('c2');
            expect(c.get('o6')).toBe('c6');
        });

        test('#49: deep clone bug in initAttrs', function() {

            var A = Base.extend({
                attrs: {
                    array: [1, 2, 3],
                    element: null,
                    point: null
                }
            });

            var a = new A({ element: document.body });
            var attrs = a.attrs;
            attrs.array.value.push(4);

            expect(attrs.array.value.length).toBe(4);
            expect(A.prototype.attrs.array.length).toBe(3);
            expect(attrs.element.value).toBe(document.body);
            expect(attrs.point.value).toBe(null);
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

        test('related attrs', function() {

            var O = Base.extend({
                attrs: {
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

            var o = new O({
                xy: [10, 20]
            });

            expect(o.get('x')).toBe(10);
            expect(o.get('y')).toBe(20);
            expect(o.get('xy')).toEqual([10, 20]);

            o = new O({
                x: 30
            });

            expect(o.get('x')).toBe(30);
            expect(o.get('y')).toBe(0);
            expect(o.get('xy')).toEqual([30, 0]);

            // 同时设置时，以 xy 的为准
            o = new O({
                xy: [10, 20],
                x: 30,
                y: 30
            });

            expect(o.get('x')).toBe(10);
            expect(o.get('y')).toBe(20);
            expect(o.get('xy')).toEqual([10, 20]);
        });

        test('related attrs change events', function() {
            var counter = 0;

            function incr() {
                counter++;
            }

            var O = Base.extend({
                attrs: {
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
                },

                _onChangeX: incr,
                _onChangeY: incr,
                _onChangeXy: incr
            });

            var o = new O({
                xy: [10, 20],
                x: 30,
                y: 30
            });

            expect(o.get('x')).toBe(10);
            expect(o.get('y')).toBe(20);
            expect(o.get('xy')).toEqual([10, 20]);

            o.change();
            expect(counter).toBe(0);
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

        test('example in attribute.md', function() {

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
            panel2.set('width', 200);
            expect(panel2.element.width()).toBe(200);
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

        test('test change method', function() {
            var counter = 0;

            var A = Base.extend({

                attrs: {
                    a: 1,
                    b: 1,
                    c: 1
                },

                _onChangeA: function() {
                    counter++;
                },

                _onChangeB: function() {
                    counter++;
                },

                _onChangeC: function() {
                    counter++;
                }
            });

            counter = 0;
            var a = new A();
            expect(counter).toBe(0);

            // 初始化后，无 changedAttrs
            a.change();
            expect(counter).toBe(0);


            counter = 0;
            var a2 = new A({ a: 2 });
            expect(counter).toBe(0);

            counter = 0;
            a2.set('a', 2);
            expect(counter).toBe(0);

            counter = 0;
            a2.set('a', 3);
            expect(counter).toBe(1);

            counter = 0;
            var a3 = new A({ a: 1, b: 2, c: 3 });
            expect(counter).toBe(0);

            counter = 0;
            a3.set({ a: 2, b: 3, c: 4 });
            expect(counter).toBe(3);
        });

        test('after/before support binding multiple methodNames at once', function() {
            var counter = 0;

            function incr() {
                counter++;
            }

            var A = Base.extend({
                show: function() {
                },
                hide: function() {
                }
            });

            var a = new A();

            a.before('show hide', incr);
            a.after('hide show', incr);

            a.show();
            expect(counter).toBe(2);
            a.hide();
            expect(counter).toBe(4);
        });

        test('special properties getter', function() {

            var T = Base.extend({

                model: {
                    getter: function(val) {
                        return {
                            a: 1,
                            v: val
                        }
                    }
                },

                propsInAttrs: ['model']
            });

            var t = new T();

            expect(t.model.a).toBe(1);
            expect(t.model.v).toBe(undefined);

        });

    });

});
