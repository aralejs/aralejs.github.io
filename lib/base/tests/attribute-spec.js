define(function(require) {

    var Class = require('class');
    var Attribute = require('../src/attribute');


    describe('Attribute', function() {

        test('normal usage', function() {

            var Overlay = Class.create({
                Implements: Attribute,

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
                },

                initialize: function(options) {
                    this.setAttrs(options);
                }
            });


            var overlay = new Overlay({ x: 10 });

            expect(overlay.get('name')).toBe('overlay');
            expect(overlay.get('x')).toBe(10);
            expect(overlay.get('y')).toBe(0);
            expect(overlay.get('xy')).toEqual([10, 0]);
            expect(overlay.set('xy')).toThrow('readOnly')
        });

    });

});
