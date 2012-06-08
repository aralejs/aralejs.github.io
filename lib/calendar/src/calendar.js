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
                        available: this.get('available'),
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

    // ## Calendar
    var Calendar = Overlay.extend({
        Implements: [Templatable],

        attrs: defaults,

        events: {
            'click [data-role=month]': '_selectMonth',
            'click [data-role=week]': '_selectWeek',
            'click [data-role=date]': '_selectDate',
            'click [data-role=today]': '_selectToday',
            'click [data-role=mode-month]': '_changeToMonthMode',
            'click [data-role=prev-month]': 'prevMonth',
            'click [data-role=next-month]': 'nextMonth',
            'click [data-role=mode-year]': '_changeToYearMode',
            'click [data-role=prev-year]': 'prevYear',
            'click [data-role=next-year]': 'nextYear'
        },

        setup: function() {
            // load theme css
            require.async(getThemeCSS(this.get('theme')));

            var that = this;
            var model = this.model;

            var trigger = this.get('trigger');
            $(trigger).on(this.get('triggerType'), function() {
                that.render().show();
            });

            model.on('change:year change:month', function() {
                that.renderPartial('[data-role=month-year]');
            });

            model.on('change:week', function() {
                that.renderPartial('[data-role=control]');
            });

            model.on('change:date', function() {
                that.renderPartial('[data-role=datalist]');
            });

            model.on('change:time', function() {
                that.renderPartial('[data-role=time]');
            });

            model.on('change:mode', function() {
                that.renderPartial('[data-role=datalist]');
                that.renderPartial('[data-role=control]');
            });

            setInterval(function() {
                model.changeTime();
            }, 1000);
        },

        _selectDate: function(ev) {
            var el = $(ev.target);
            var date = this.model.selectDate(
                el.attr('data-date'), el.attr('data-month')
            );
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

        _selectToday: function() {
            var value = moment().format(this.get('format'));
            console.log(value);
        },

        _selectWeek: function(ev) {
            var el = $(ev.target);
            this.model.changeStartDay(el.attr('data-value'));
        },

        _selectMonth: function(ev) {
            var el = $(ev.target);
            this.model._current.month(el.attr('data-value'));
            this.model.changeMode('date');
        },

        _changeToMonthMode: function() {
            console.log('change');
            this.model.changeMode('month');
        },

        prevMonth: function() {
            this.model.changeTime('months', -1);
            return this;
        },

        nextMonth: function() {
            this.model.changeTime('months', 1);
            return this;
        },

        _changeToYearMode: function() {
            this.model.changeMode('year');
        },

        prevYear: function() {
            this.model.changeTime('years', -1);
            return this;
        },

        nextYear: function() {
            this.model.changeTime('years', 1);
            return this;
        },

        show: function() {
            this.element.show();
            return this;
        },

        hide: function() {
            this.element.hide();
            return this;
        }
    });

    module.exports = Calendar;


    // Helpers
    // -------

    // theme support for calendar.
    // default theme is a simple word, custom theme is a url path
    function getThemeCSS(theme) {
        if (themes.indexOf(theme) != -1) {
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
