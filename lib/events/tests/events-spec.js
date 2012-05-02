/* @author lifesinger@gmail.com */
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/test/events.js

define(function(require) {

    var test = it;
    var Events = require('../src/events');


    describe('Events', function() {

        test('on and trigger', function() {
            var obj = new Events();
            obj.counter = 0;

            obj.on('event', function() {
                obj.counter += 1;
            });

            obj.trigger('event');
            expect(obj.counter).toBe(1);

            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            expect(obj.counter).toBe(5);
        });

        test('binding and triggering multiple events', function() {
            var obj = new Events();
            obj.counter = 0;

            obj.on('a b c', function() {
                obj.counter += 1;
            });

            obj.trigger('a');
            expect(obj.counter).toBe(1);

            obj.trigger('a b');
            expect(obj.counter).toBe(3);

            obj.trigger('c');
            expect(obj.counter).toBe(4);

            obj.off('a c');
            obj.trigger('a b c');
            expect(obj.counter).toBe(5);
        });

        test('trigger all for each event', function() {
            var obj = new Events();
            obj.counter = 0;
            var a, b;

            obj.on('all', function(event) {
                obj.counter++;
                if (event == 'a') a = true;
                if (event == 'b') b = true;
            }).trigger('a b');

            expect(a).toBe(true);
            expect(b).toBe(true);
            expect(obj.counter).toBe(2);
        });

        test('on, then unbind all functions', function() {
            var obj = new Events();
            obj.counter = 0;

            function callback() {
                obj.counter += 1;
            }

            obj.on('event', callback);
            obj.trigger('event');
            obj.off('event');
            obj.trigger('event');
            expect(obj.counter).toBe(1);
        });

        test('bind two callbacks, unbind only one', function() {
            var obj = new Events();
            obj.counterA = 0;
            obj.counterB = 0;

            function callback() {
                obj.counterA += 1;
            }

            obj.on('event', callback);
            obj.on('event', function() { obj.counterB += 1; });
            obj.trigger('event');
            obj.off('event', callback);
            obj.trigger('event');

            expect(obj.counterA).toBe(1);
            expect(obj.counterB).toBe(2);
        });

        test('unbind a callback in the midst of it firing', function() {
            var obj = new Events();
            obj.counter = 0;

            function callback() {
                obj.counter += 1;
                obj.off('event', callback);
            }

            obj.on('event', callback);
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');

            expect(obj.counter).toBe(1);
        });

        test('two binds that unbind themeselves', function() {
            var obj = new Events();
            obj.counterA = 0;
            obj.counterB = 0;

            function incrA() {
                obj.counterA += 1;
                obj.off('event', incrA);
            }

            function incrB() {
                obj.counterB += 1;
                obj.off('event', incrB);
            }

            obj.on('event', incrA);
            obj.on('event', incrB);
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');

            expect(obj.counterA).toBe(1);
            expect(obj.counterB).toBe(1);
        });

        test('bind a callback with a supplied context', function() {
            function TestClass() {
            }

            TestClass.prototype.assertTrue = function() {
                return true;
            };

            var obj = new Events();

            obj.on('event', function() {
                expect(this.assertTrue()).toBe(true);
            }, (new TestClass));

            obj.trigger('event');
        });

        test('nested trigger with unbind', function() {
            var obj = new Events();
            obj.counter = 0;

            function incr1() {
                obj.counter += 1;
                obj.off('event', incr1);
                obj.trigger('event');
            }

            function incr2() {
                obj.counter += 1;
            }

            obj.on('event', incr1);
            obj.on('event', incr2);
            obj.trigger('event');

            expect(obj.counter).toBe(3);
        });

        test('callback list is not altered during trigger', function() {
            var counter = 0;
            var obj = new Events();

            function incr() {
                counter++;
            }

            obj.on('event', function() {
                obj.on('event', incr).on('all', incr);
            }).trigger('event');

            // bind does not alter callback list
            expect(counter).toBe(0);

            counter = 0;
            obj.off()
               .on('event', function() {
                    obj.off('event', incr).off('all', incr);
                })
               .on('event', incr)
               .on('all', incr)
               .trigger('event');

            // unbind does not alter callback list
            expect(counter).toBe(2);

            // 注：
            // 1. jQuery 里，是冻结的，在 triggering 时，新增或删除都不影响
            //    当前 callbacks list
            // 2. Backbone 同 jQuery
            // 3. Chrome 下，原生 addEventListener:
            //    - 新增的，需要下一次才触发
            //    - 其他修改，立刻生效（与 forEach 类似）
            //    - 如果 addEventListener 同一个 fn, 会去重，只触发一次
            // 4. NodeJS 也是冻结的（slice 了一下）
            //
            // 从 emit 性质考虑，各个 callback 间不应该互相影响，因此 jQuery 的方式
            // 是值得推崇的：任何修改，都等下一次才生效。
            //
            // Ref:
            //  - https://github.com/documentcloud/backbone/pull/723

        });
        
        test('if no callback is provided, `on` is a noop', function() {
            new Events().on('test').trigger('test');
        });

        test('remove all events for a specific context', function() {
            var obj = new Events();
            var a = 0;
            var b = 0;

            obj.on('x y all', function() {
                a++;
            });

            obj.on('x y all', function() {
                b++;
            }, obj);

            obj.off(null, null, obj);
            obj.trigger('x y');

            expect(a).toBe(4);
            expect(b).toBe(0);
        });

        test('remove all events for a specific callback', function() {
            var obj = new Events();
            var a = 0;
            var b = 0;

            function success() {
                a++;
            }

            function fail() {
                b++;
            }

            obj.on('x y all', success);
            obj.on('x y all', fail);
            obj.off(null, fail);
            obj.trigger('x y');

            expect(a).toBe(4);
            expect(b).toBe(0);
        });

        test('off is chainable', function() {
            var obj = new Events();

            // With no events
            expect(obj.off()).toBe(obj);

            // When removing all events
            obj.on('event', function() {
            }, obj);
            expect(obj.off()).toBe(obj);

            // When removing some events
            obj.on('event', function() {
            }, obj);
            expect(obj.off('event')).toBe(obj);
        });

        test('no DontEnums bug', function() {
            var obj = new Events();
            var counter = 0;

            obj.on('toString', function() {
                counter++;
            });

            obj.on('valueOf', function() {
                counter++;
            });

            obj.trigger('toString');
            obj.trigger('valueOf');

            expect(counter).toBe(2);
        });

    });
});
