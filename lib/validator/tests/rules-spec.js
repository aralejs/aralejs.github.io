define(function(require) {
    var Core = require('../src/core'),
        $ = require('$');

    describe('rules', function() {

        afterEach(function() {
            $('[name=email]').val('');
        });

        test('email', function() {
            $('[name=email]').val('abc');
            Core.validate({
                element: '[name=email]',
                rule: 'email',
                onItemValidated: function(error, message, element) {
                    expect(error).toBe('email');
                    //expect(message).toBe();
                    //expect(element).toBe($('[name=email]'));
                }
            });
        });

    });
});
