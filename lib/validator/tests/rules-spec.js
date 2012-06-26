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
                    expect(message).toBeTruthy();
                    expect(element.get(0)).toBe($('[name=email]').get(0));
                }
            });

            $('[name=email]').val('abc@gmail.com');
            Core.validate({
                element: '[name=email]',
                rule: 'email',
                onItemValidated: function(error, message, element) {
                    expect(error).toBeFalsy();
                    expect(message).toBeFalsy();
                    expect(element.get(0)).toBe($('[name=email]').get(0));
                }
            });

        });

        test('text password radio checkbox', function() {
            $.each(['', 'a', '#@#', '..'], function(j, value) {
                $('[name=email]').val(value);
                $.each(['text', 'password', 'radio', 'checkbox'], function(i, type) {
                    Core.validate({
                        element: '[name=email]',
                        rule: type,
                        onItemValidated: function(error, message, element) {
                            expect(error).toBeFalsy();
                            expect(message).toBeFalsy();
                            expect(element.get(0)).toBe($('[name=email]').get(0));
                        }
                    });
                });
            });
        });

        test('url', function() {
            $.each(['ads', 'http', 'https://', 'https'], function(j, value) {
                $('[name=email]').val(value);
                Core.validate({
                    element: '[name=email]',
                    rule: 'url',
                    onItemValidated: function(error, message, element) {
                        expect(error).toBeTruthy();
                        expect(message).toBeTruthy();
                        expect(element.get(0)).toBe($('[name=email]').get(0));
                    }
                });
            });

            $.each(['http://shaoshuai', 'https://shaoshuai', 'http://shaoshuai.me', 'https://shaoshuai.me', 'http://www.shaoshuai.me', 'https://www.shaoshuai.me/asdg', 'https://shaoshuai.me/'], function(j, value) {
                $('[name=email]').val(value);
                Core.validate({
                    element: '[name=email]',
                    rule: 'url',
                    onItemValidated: function(error, message, element) {
                        expect(error).toBeFalsy();
                        expect(message).toBeFalsy();
                        expect(element.get(0)).toBe($('[name=email]').get(0));
                    }
                });
            });
        });

        test('number', function() {
            $.each(['123', '1', '1e+1', '1e-2', '1e+2', '0.4', '0.3E+1', '0.22e-13', '.3', '.4E+3', '+1.3E-3'], function(j, value) {
                $('[name=email]').val(value);
                Core.validate({
                    element: '[name=email]',
                    rule: 'number',
                    onItemValidated: function(error, message, element) {
                        expect(error).toBeFalsy();
                        expect(message).toBeFalsy();
                        expect(element.get(0)).toBe($('[name=email]').get(0));
                    }
                });
            });

            $.each(['a', '.', '1.3e', '1.23.1', '+33e', '.4E3'], function(j, value) {
                $('[name=email]').val(value);
                Core.validate({
                    element: '[name=email]',
                    rule: 'number',
                    onItemValidated: function(error, message, element) {
                        expect(error).toBeTruthy();
                        expect(message).toBeTruthy();
                        expect(element.get(0)).toBe($('[name=email]').get(0));
                    }
                });
            });
        });

        test('date', function() {
            $.each(['1912-03-22', '1912-3-22', '2222-02-02', '01/31/1999', '1989年1月2号', '1989年1月2日'], function(j, value) {
                $('[name=email]').val(value);
                Core.validate({
                    element: '[name=email]',
                    rule: 'date',
                    onItemValidated: function(error, message, element) {
                        expect(error).toBeFalsy();
                        expect(message).toBeFalsy();
                        expect(element.get(0)).toBe($('[name=email]').get(0));
                    }
                });
            });

            $.each(['12-03-22', '2212-113-02', '1/31/1999', '89年1月2号'], function(j, value) {
                $('[name=email]').val(value);
                Core.validate({
                    element: '[name=email]',
                    rule: 'date',
                    onItemValidated: function(error, message, element) {
                        expect(error).toBeTruthy();
                        expect(message).toBeTruthy();
                        expect(element.get(0)).toBe($('[name=email]').get(0));
                    }
                });
            });
        })

    });
});
