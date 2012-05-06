/* @author lifesinger@gmail.com */

define(function(require) {

    var Class = require('../src/class');


    describe('Class', function() {

        test('Class.create(fn)', function() {
            function Animal(name) {
                this.name = name;
            }

            Animal.prototype.getName = function() {
                return this.name;
            };

            var Dog = Class.create(Animal);
            var dog = new Dog('Jack');

            expect(dog.constructor).toBe(Dog);
            expect(dog.name).toBe('Jack');
            expect(dog.getName()).toBe('Jack');
        });

        test('don\'t call `initialize` of parent', function() {
            var counter = 0;

            var Animal = Class.create({
                initialize: function() {
                    counter++;
                }
            });

            var Dog = Class.create(Animal, {
                initialize: function() {
                    counter++;
                }
            });

            new Dog();
            expect(counter).toBe(1);
        });

    });
});
