define(function(require) {

    var Position = require('../src/position');
    var $ = require('$');

    describe('position', function() {

        var pinElement;

        beforeEach(function() {
            pinElement = $('<div>pinElement</div>').appendTo(document.body);
        });

        afterEach(function() {
            pinElement.remove();
        });

        test('Position.pin(pinElement, { x: 100, y: 100 })', function() {
            Position.pin(pinElement, { x: 100, y: 100 });
            expect(pinElement.offset().top).toBe(100);
            expect(pinElement.offset().left).toBe(100);
        });

        // 偏右继续补充呀
    });
});
