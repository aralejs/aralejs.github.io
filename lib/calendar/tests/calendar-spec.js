define(function(require) {
    var CalendarModel = require('../src/model');
    var moment = require('moment');
    var now = moment();

    var config = {
        lang: null,
        focus: now,
        range: null,
        showTime: true,
        startDay: 'Sun'
    };

    var model;

    describe('CalendarModel', function() {
        test('initialize i18n', function() {
            var i18nConfig = config;
            i18nConfig.i18n = {
                'i18n': 'internationalization',
                'l10n': 'localization'
            };
            i18nConfig.lang = {
                'internationalization': '国际化',
                'localization': '本地化'
            };
            model = new CalendarModel(i18nConfig);
            var i18n = model.get('i18n');
            expect(i18n.i18n.key).toBe('internationalization');
            expect(i18n.i18n.value).toBe('国际化');
            expect(i18n.l10n.key).toBe('localization');
            expect(i18n.l10n.value).toBe('本地化');

            // default i18n
            expect(i18n.today.value).toBe('Today');
        });
    });

    var Calendar = require('../src/calendar');

    describe('Calendar', function() {
    });

});
