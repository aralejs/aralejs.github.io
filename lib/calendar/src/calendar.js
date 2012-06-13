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

        // output format
        format: 'YYYY-MM-DD',

        // ### overlay
        align: {
            getter: function() {
                var trigger = this.get('trigger');
                if (trigger) {
                    return {
                        selfXY: [0, 0],
                        baseElement: trigger,
                        baseXY: [0, $(trigger).height() + 10]
                    };
                }
                return {
                    selfXY: [0, 0],
                    baseXY: [0, 0]
                };
            }
        },
        hideOnSelect: true,

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
            'click [data-role=today]': '_selectToday',

            'keydown': '_keyControl'
        },

        setup: function() {
            var that = this;

            // bind trigger
            var trigger = this.get('trigger');
            $(trigger).on(this.get('triggerType'), function() {
                that.render().show();
            });
            $(trigger).on('keydown', function(ev) {
                if (ev.keyCode === 38) {
                    that.element.focus();
                    that.model.changeTime('days', -7);
                } else if (ev.keyCode === 40) {
                    that.element.focus();
                    that.model.changeTime('days', 7);
                }
            });

            // bind model change event
            var model = this.model;
            var hash = {
                'change:year change:month': '[data-role=month-year-container]',
                'change:day': '[data-role=pannel-container]',
                'change:date': '[data-role=data-container]',
                'change:time': '[data-role=time-container]',
                'change:mode': [
                    '[data-role=data-container]', '[data-role=pannel-container]'
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

        range: function(range) {
            this.model.range = range;
            this.model.renderData();
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

        _selectDate: function(ev) {
            var el = $(ev.target);
            var date = this.model.selectDate({
                year: el.data('year'),
                month: el.data('month'),
                date: el.data('date')
            });
            this._fillDate(date);
        },

        _selectToday: function() {
            var today = moment();
            this.model.selectDate({
                year: today.year(),
                month: today.month(),
                date: today.date()
            });
        },

        _changeMode: function(ev) {
            var mode = $(ev.target).data('role').substring(5);
            this.model.changeMode(mode);
        },

        _keyControl: function(ev) {
            var modeMap = {
                68: 'date',
                77: 'month',
                89: 'year'
            };
            if (ev.keyCode in modeMap) {
                this.model.changeMode(modeMap[ev.keyCode]);
                return false;
            }
            var codeMap = {
                13: 'enter',
                27: 'esc',
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',

                // vim bind
                72: 'left',
                76: 'right',
                74: 'down',
                75: 'up'
            };
            if (!(ev.keyCode in codeMap)) return;

            var keyboard = codeMap[ev.keyCode];
            var mode = this.model.get('mode');
            if (ev.shiftKey && keyboard === 'right') {
                this.nextYear();
            } else if (ev.shiftKey && keyboard === 'left') {
                this.prevYear();
            } else if (ev.ctrlKey && keyboard === 'right') {
                this.nextMonth();
            } else if (ev.ctrlKey && keyboard === 'left') {
                this.prevMonth();
            } else if (keyboard === 'esc') {
                this.hide();
            } else if (mode.date) {
                this._keyControlDate(keyboard);
            } else if (mode.month) {
                this._keyControlMonth(keyboard);
            } else if (mode.year) {
                this._keyControlYear(keyboard);
            }
            ev.preventDefault();
        },

        _keyControlDate: function(keyboard) {
            if (keyboard === 'enter') {
                var date = this.model.selectDate();
                this._fillDate(date);
                return;
            }
            var moves = {
                'right': 1,
                'left': -1,
                'up': -7,
                'down': 7
            };
            this.model.changeTime('days', moves[keyboard]);
        },

        _keyControlMonth: function(keyboard) {
            if (keyboard === 'enter') {
                var date = this.model.selectDate();
                this.model.changeMode('date', {month: date.month()});
                return;
            }
            var moves = {
                'right': 1,
                'left': -1,
                'up': -3,
                'down': 3
            };
            this.model.changeTime('months', moves[keyboard]);
        },

        _keyControlYear: function(keyboard) {
            if (keyboard === 'enter') {
                var date = this.model.selectDate();
                this.model.changeMode('date', {year: date.year()});
                return;
            }
            var moves = {
                'right': 1,
                'left': -1,
                'up': -3,
                'down': 3
            };
            this.model.changeTime('years', moves[keyboard]);
        },

        _fillDate: function(date) {
            if (!this.model.isInRange(date)) {
                this.trigger('select-disabled-date', date);
                return this;
            }
            this.trigger('select-date', date);

            var trigger = this.get('trigger');
            if (!trigger) {
                return this;
            }
            var $trigger = $(trigger);
            if (typeof $trigger[0].value === 'undefined') {
                return this;
            }
            var value = date.format(this.get('format'));
            $trigger.val(value);
            var hideOnSelect = this.get('hideOnSelect');
            if (hideOnSelect) {
                this.hide();
            }
        }
    });

    module.exports = Calendar;
});
