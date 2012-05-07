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

    });

});
