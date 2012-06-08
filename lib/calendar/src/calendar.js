// # Calendar
//
// Calendar is also known as date-picker. It is widely used in web apps.
//
// This calendar is a part of [arale](http://aralejs.org) project, therefore,
// it is suitable for any project that is powered by [seajs](http://seajs.org).
//
// ## Syntax Overview:
//
//     var Calendar = require('calendar');
//     var cal = new Calendar({
//         trigger: 'input.date-picker',
//         format: "YYYY-MM-DD"
//     }).render();
//
// Need more complex task? Head over to Options section.
//

define(function(require, exports, module) {

    // ## Required Library
    // This calendar is a part of arale project,
    // it requires some arale modules.

    // ### seajs
    // seajs is a module loader for the web.

    // ### jquery
    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require('jquery');

    // ### moment
    // Thanks to [moment](http://momentjs.com/), parsing, manipulating
    // and formatting dates are much easier now.
    var moment = require('moment');

    // ### Widget (arale)
    var Overlay = require('overlay');
    // template mixin for widget
    var Templatable = require('templatable');

    var template = require('./calendar.tpl');
    var CalendarModel = require('./model');

    // ## Options
    // default options for calendar
    var defaults = {
        // ### trigger and input
        // element, usually input[type=date], or date icon
        trigger: null,
        triggerType: 'focus',

        // fill inputElement with selected date.
        // if not specified, inputElement will be trigger element.
        inputElement: null,

        // output format
        format: 'YYYY-MM-DD',

        // ### overlay
        // offset of trigger
        offset: {x: 0, y: 0},
        // zIndex for overlay
        zIndex: 999,

        // ### display
        // start of a week, default is Sunday.
        startDay: 'Sun',

        showTime: false,

        lang: null,

        // when initialize a calendar, which date should be focused.
        // default is today.
        focus: {
            value: '',
            getter: function(val) {
                return moment(val ? val : undefined);
            }
        },

        // ### range for selecting
        //
        // determine if a date is available for selecting, accept:
        //
        // - list: [start, end]. ``start`` and ``end`` can be anything
        //   that moment.parse accepts.
        // - function: a function return ``true`` or ``false``, the function
        //   accepts a moment date, and it determines if this date is available
        //   for selecting.
        //
        // for example:
        //
        //     var cal1 = new Calendar({
        //         range: ["2000-11-23", "2012-12-12"]
        //     });
        //
        //     var cal2 = new Calendar({
        //         range: function(date) {
        //             return date.day() != 0;
        //         }
        //     });
        range: null,

        // if you are designing your own theme,
        // you may need to change the width and height
        // but in most cases, you don't need to worry about it.
        theme: 'simple',

        template: template,

        model: {
            getter: function() {
                if (!this.hasOwnProperty('model')) {
                    var modelConfig = {
                        lang: this.get('lang'),
                        focus: this.get('focus'),
                        range: this.get('range'),
                        showTime: this.get('showTime'),
                        startDay: this.get('startDay')
                    };
                    this.model = new CalendarModel(modelConfig);
                }

                return this.model;
            }
        }
    };

    // default theme gallery
    var themes = ['simple'];

    var Calendar = Overlay.extend({
        Implements: [Templatable],

        attrs: defaults,

        events: {
            'click [data-role=mode-year]': '_changeMode',
            'click [data-role=prev-year]': 'prevYear',
            'click [data-role=next-year]': 'nextYear',
            'click [data-role=mode-month]': '_changeMode',
            'click [data-role=prev-month]': 'prevMonth',
            'click [data-role=next-month]': 'nextMonth',

            'click [data-role=previous-10-year]': '_selectYear',
            'click [data-role=next-10-year]': '_selectYear',
            'click [data-role=year]': '_selectYear',
            'click [data-role=month]': '_selectMonth',
            'click [data-role=day]': '_selectDay',
            'click [data-role=date]': '_selectDate',
            'click [data-role=today]': '_selectToday'
        },

        setup: function() {
            var that = this;

            // load theme css
            require.async(getThemeCSS(this.get('theme')));

            // bind trigger
            var trigger = this.get('trigger');
            $(trigger).on(this.get('triggerType'), function() {
                that.render().show();
            });

            // bind model change event
            var model = this.model;
            var hash = {
                'change:year change:month': '[data-role=month-year]',
                'change:day': '[data-role=control]',
                'change:date': '[data-role=data-container]',
                'change:time': '[data-role=time-container]',
                'change:mode': [
                    '[data-role=data-container]', '[data-role=control]'
                ]
            };

            $.each(hash, function(eventType, selectors) {
                model.on(eventType, function() {
                    $.isArray(selectors) || (selectors = [selectors]);
                    $.each(selectors, function(i, selector) {
                        that.renderPartial(selector);
                    });
                });
            });

            if (that.get('showTime')) {
                setInterval(function() {
                    model.set('time');
                }, 1000);
            }
        },

        _changeMode: function(ev) {
            var mode = $(ev.target).data('role').substring(5);
            this.model.changeMode(mode);
        },

        prevYear: function() {
            this.model.changeTime('years', -1);
            return this;
        },

        nextYear: function() {
            this.model.changeTime('years', 1);
            return this;
        },

        prevMonth: function() {
            this.model.changeTime('months', -1);
            return this;
        },

        nextMonth: function() {
            this.model.changeTime('months', 1);
            return this;
        },

        _selectYear: function(ev) {
            var el = $(ev.target);
            if (el.data('role') === 'year') {
                this.model.changeMode('date', {year: el.data('value')});
            } else {
                this.model.changeMode('year', {year: el.data('value')});
            }
        },

        _selectMonth: function(ev) {
            var el = $(ev.target);
            this.model.changeMode('date', {month: el.data('value')});
        },

        _selectDay: function(ev) {
            var el = $(ev.target);
            this.model.changeStartDay(el.data('value'));
        },

        // todo
        _selectDate: function(ev) {
            var el = $(ev.target);
            var date = this.model.selectDate({
                year: el.data('year'),
                month: el.data('month'),
                date: el.data('date')
            });
            if (el.hasClass('disabled')) {
                this.trigger('disabled', date);
                return this;
            }
            var value = date.format(this.get('format'));
            var inputElement = this.get('inputElement') || this.get('trigger');
            if (inputElement) {
                $(inputElement).val(value);
                this.hide();
            }
            console.log(value);
        },

        // todo
        _selectToday: function() {
            var value = moment().format(this.get('format'));
            console.log(value);
        }
    });

    module.exports = Calendar;


    // Helpers
    // -------

    // theme support for calendar.
    // default theme is a simple word, custom theme is a url path
    function getThemeCSS(theme) {
        if (themes.join('|').indexOf(theme) !== -1) {
            // - single word: simple
            return './themes/' + theme + '.css';
        }
        if (theme.slice(-1) === '/') {
            // - path: /path/to/
            return theme + 'calendar.css';
        }
        // - full path: /path/to/calendar.css
        return theme;
    }

});
