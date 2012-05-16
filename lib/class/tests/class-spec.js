define(function(require) {

    var Class = require('../src/class');


    describe('Class', function() {

        test('Class.create(parent)', function() {
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

        test('Class.create(null)', function() {
            var Dog = Class.create(null);
            var dog = new Dog();
            expect(dog.constructor).toBe(Dog);
            expect(Dog.superclass.constructor).toBe(Class);

            Dog = Class.create();
            new Dog();
            expect(Dog.superclass.constructor).toBe(Class);
        });

        test('Class.create(parent, properties)', function() {
            function Animal(name) {
                this.name = name;
            }

            Animal.prototype.getName = function() {
                return this.name;
            };

            var Dog = Class.create(Animal, {
                talk: function() {
                    return 'I am ' + this.name;
                }
            });
            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(dog.talk()).toBe('I am Jack');
        });

        test('call initialize method properly', function() {
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

            // Dog 有 initialize 时，只调用 Dog 的 initialize
            expect(counter).toBe(1);

            counter = 0;
            Dog = Class.create(Animal);

            new Dog();

            // Dog 没有 initialize 时，会自动调用父类中最近的 initialize
            expect(counter).toBe(1);
        });

        test('pass arguments to initialize method properly', function() {

            var Animal = Class.create({
                initialize: function(firstName, lastName) {
                    this.fullName = firstName + ' ' + lastName;
                }
            });

            var Bird = Animal.extend({
                fly: function() {
                }
            });

            var bird = new Bird('Frank', 'Wang');

            expect(bird.fullName).toBe('Frank Wang');
        });

        test('superclass', function() {
            var counter = 0;

            var Animal = Class.create({
                initialize: function() {
                    counter++;
                },
                talk: function() {
                    return 'I am an animal';
                }
            });

            var Dog = Class.create(Animal, {
                initialize: function() {
                    Dog.superclass.initialize();
                },
                talk: function() {
                    return Dog.superclass.talk();
                }
            });

            var dog = new Dog();

            expect(counter).toBe(1);
            expect(dog.talk()).toBe('I am an animal');
        });

        test('Extends', function() {
            function Animal(name) {
                this.name = name;
            }

            Animal.prototype.getName = function() {
                return this.name;
            };

            var Dog = Class.create({
                Extends: Animal,
                talk: function() {
                    return 'I am ' + this.name;
                }
            });

            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(dog.getName()).toBe('Jack');
            expect(dog.talk()).toBe('I am Jack');
        });

        test('Implements', function() {
            var Animal = Class.create(function(name) {
                this.name = name;
            }, {
                getName: function() {
                    return this.name;
                }

            });

            var Flyable = {
                fly: function() {
                    return 'I am flying';
                }
            };

            var Talkable = function() {};
            Talkable.prototype.talk = function() {
                return 'I am ' + this.name;
            };

            var Dog = Class.create({
                Extends: Animal,
                Implements: [Flyable, Talkable]
            });

            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(dog.getName()).toBe('Jack');
            expect(dog.fly()).toBe('I am flying');
            expect(dog.talk()).toBe('I am Jack');
        });

        test('Statics', function() {
            var Dog = Class.create({
                initialize: function(name) {
                    this.name = name;
                },
                Statics: {
                    COLOR: 'red'
                }
            });

            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(Dog.COLOR).toBe('red');
        });

        test('statics inherited from parent', function() {
            var Animal = Class.create();
            Animal.LEGS = 4;

            var Dog = Class.create({
                Extends: Animal,

                Statics: {
                    COLOR: 'red'
                },

                initialize: function(name) {
                    this.name = name;
                }
            });

            expect(Dog.LEGS).toBe(4);
            expect(Dog.COLOR).toBe('red');

            var Pig = Class.create(Class);

            expect(typeof Pig.implement).toBe('function');
            expect(typeof Pig.extend).toBe('function');
            expect(typeof Pig.Mutators).toBe('undefined');
            expect(typeof Pig.create).toBe('undefined');
        });

        test('Class.extend', function() {
            var Dog = Class.extend({
                initialize: function(name) {
                    this.name = name;
                }
            });

            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(Dog.superclass.constructor).toBe(Class);
        });

        test('SubClass.extend', function() {
            var Animal = Class.create(function(name) {
                this.name = name;
            });

            var Dog = Animal.extend();
            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(Dog.superclass.constructor).toBe(Animal);
        });

        test('SubClass.implement', function() {
            var Animal = Class.create(function(name) {
                this.name = name;
            });

            var Dog = Animal.extend();
            Dog.implement({
                talk: function() {
                    return 'I am ' + this.name;
                }
            });

            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(dog.talk()).toBe('I am Jack');
            expect(Dog.superclass.constructor).toBe(Animal);
        });

        test('convert existed function to Class', function() {
            function Dog(name) {
                this.name = name;
            }

            Class(Dog).implement({
                getName: function() {
                    return this.name;
                }
            });

            var dog = new Dog('Jack');

            expect(dog.name).toBe('Jack');
            expect(dog.getName()).toBe('Jack');

            var MyDog = Dog.extend({
                talk: function() {
                    return 'I am ' + this.name;
                }
            });

            var myDog = new MyDog('Frank');
            expect(myDog.name).toBe('Frank');
        });

        test('new AnotherClass() in initialize', function() {
           var called = [];

            var Animal = Class.create({
                initialize: function() {
                    called.push('Animal');
                }
            });

            var Pig = Class.create(Animal, {
                initialize: function() {
                    called.push('Pig');
                }
            });

            var Dog = Class.create(Animal, {
                initialize: function() {
                    new Pig();
                    called.push('Dog');
                }
            });

            new Dog();
            expect(called.join(' ')).toBe('Pig Dog');

        });
    });

});
