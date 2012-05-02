/* @author lifesinger@gmail.com */

define(function(require) {

    var _ = require('underscore');
    var Events = require('../src/events');


    describe('Events', function() {

        it('should support: on and trigger', function() {
            var obj = { counter: 0 };
            _.extend(obj, Events);

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

    });
});
