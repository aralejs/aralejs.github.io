define(function(require) {

    var Cookie = require('../src/cookie');


    describe('Cookie', function() {

        describe('get', function() {

            document.cookie = '_sea_test_1=1';
            document.cookie = '_sea_test_2';
            document.cookie = '_sea_test_3=';
            document.cookie = '_sea_test_4[t]=xx';

            it('should return the cookie value for the given name.', function() {

                expect(Cookie.get('_sea_test_1')).toBe('1');
                expect(Cookie.get('_sea_test_2')).toBe('');
                expect(Cookie.get('_sea_test_3')).toBe('');
                expect(Cookie.get('_sea_test_4[t]')).toBe('xx');

            });

            it('should return undefined for non-existing name.', function() {

                expect(Cookie.get('_sea_test_none')).toBeUndefined();
                expect(function(){ Cookie.get(true); }).toThrow();
                expect(function(){ Cookie.get({}); }).toThrow();
                expect(function(){ Cookie.get(null); }).toThrow();

            });

            it('should throw error for invalid name.', function() {

                expect(function(){ Cookie.get(true); }).toThrow();
                expect(function(){ Cookie.get({}); }).toThrow();
                expect(function(){ Cookie.get(null); }).toThrow();

            });

        });

        describe('set', function() {

            it('should set a cookie with a given name and value.', function() {

                Cookie.set('_sea_test_11', 'xx');
                expect(Cookie.get('_sea_test_11')).toBe('xx');

                Cookie.set('_sea_test_12', 'xx', { expires: -1 });
                expect(Cookie.get('_sea_test_12')).toBeUndefined();

                Cookie.set('_sea_test_13', '2', {
                    expires: new Date(2099, 1, 1),
                    path: '/'
                });
                expect(Cookie.get('_sea_test_13')).toBe('2');

                Cookie.remove('_sea_test_14');
                Cookie.set('_sea_test_14', '4', {
                    domain: document.domain,
                    path: '/',
                    secure: true
                });
                expect(Cookie.get('_sea_test_14')).toBeUndefined();

            });

        });

        describe('remove', function() {

            it('should remove a cookie from the machine.', function() {

                Cookie.set('_sea_test_21', 'xx');
                Cookie.remove('_sea_test_21');
                expect(Cookie.get('_sea_test_21')).toBeUndefined();

                Cookie.set('_sea_test_22', 'xx', {
                    expires: new Date(2099, 1, 1),
                    path: '/'
                });
                Cookie.remove('_sea_test_22', {
                    path: '/'
                });
                expect(Cookie.get('_sea_test_22')).toBeUndefined();

            });
        });

    });

});
