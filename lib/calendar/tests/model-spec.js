define(function(require) {
    var CalendarModel = require('../src/model');
    var moment = require('moment');
    var now = moment();
    var defaults = {
        lang: null,
        focus: now,
        range: null,
        showTime: true,
        startDay: 'Sun'
    };

    var config;
    var model;

    describe('CalendarModel', function() {
        test('initialize i18n', function() {
            config = defaults;
            config.i18n = {
                'i18n': 'internationalization',
                'l10n': 'localization'
            };
            config.lang = {
                'internationalization': '国际化',
                'localization': '本地化'
            };
            model = new CalendarModel(config);
            var i18n = model.get('i18n');
            expect(i18n.i18n.key).toBe('internationalization');
            expect(i18n.i18n.value).toBe('国际化');
            expect(i18n.l10n.key).toBe('localization');
            expect(i18n.l10n.value).toBe('本地化');

            // default i18n
            expect(i18n.today.value).toBe('Today');
        });
        test('dateCustomize', function() {
            config = defaults;
            config.dateCustomize = function(date) {
                return 'hello-world';
            };
            model = new CalendarModel(config);
            var date = model.get('date');
            var aDate = date.items[0][0];
            expect(aDate.className.indexOf('hello-world') > 0).toBe(true);
        });
    });
});
