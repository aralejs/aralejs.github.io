// # Calendar
//
// Calendar is also known as datepicker. It is widely used in web apps.
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
//     });
//
// Need more complex task? Head over to Options section.
//

define(function(require, exports, module) {

    // ## Required Library
    // This calendar is a part of arale project,
    // it requires some arale modules.

    // ### seajs
    // seajs is a moudle loader for the web.

    // ### jquery
    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require('jquery');

    // ### moment
    // Thanks to [moment](http://momentjs.com/), parsing, manipulating
    // and formatting dates are much easier now.
    var moment = require('moment');

    // ### Widget (arale)
    var Widget = require('widget');
    // template mixin for widget
    var Templatable = require('widget-templatable');

    var template = require('./calendar.tpl');

    // ### Overlay (arale)
    // TODO

    // ## Options
    // default options for calendar
    var defaults = {
        // ### trigger and input
        // element, usually input[type=date], or date icon
        trigger: null,

        // if not specify triggerType, calendar will judge it by itself,
        // if the trigger element is input, triggerType will be ``focus``,
        // other trigger elements, triggerType will be ``click``.
        triggerType: null,

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

        // language package
        //
        //     var lang = require('i18n/zh_CN');
        //     var cal = new Calendar({lang: lang});
        //
        lang: null,

        // when initialize a calendar, which date should be focused.
        // default is today.
        focus: null,

        // if you are designing your own theme,
        // you may need to change the width and height
        // but in most cases, you don't need to worry about it.
        theme: 'simple',

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
        //         available: ["2000-11-23", "2012-12-12"]
        //     });
        //
        //     var cal2 = new Calendar({
        //         available: function(date) {
        //             return date.day() != 0;
        //         }
        //     });
        available: null,
        template: template
    };

    // default theme gallery
    var themes = ['simple'];

    // ## Calendar
    var Calendar = Widget.extend({
        Implements: [Templatable],

        attrs: defaults,

        events: {
            'click .ui-calendar-dates td': 'selectDate',
            'click .ui-calendar-weeks td': 'selectWeek',
            'click .ui-calendar-previous-month': 'selectPrevMonth',
            'click .ui-calendar-next-month': 'selectNextMonth',
            'click .ui-calendar-previous-year': 'selectPrevYear',
            'click .ui-calendar-next-year': 'selectNextYear'
        },

        // ### Initialize
        initialize: function(config) {
            this.after('initAttrs', function() {
                // initialize focus day
                if (this.get('focus')) {
                    this.set('focus', moment(config.focus));
                } else {
                    this.set('focus', moment());
                }
                this._current = this.get('focus').clone();
            });
            this.before('parseElement', function() {
                this.model = prepareData(this);
            });
            Calendar.superclass.initialize.call(this, config);
        },

        setup: function() {
            // load theme css
            require.async(getThemeCSS(this.get('theme')));
        },

        selectDate: function(ev) {
            var el = $(ev.target);
            this._current.date(el.text());
            var value = this._current.format(this.get('format'));
            return value;
        },

        selectWeek: function(ev) {
            var el = $(ev.target);
            this.set('startDay', el.attr('data-value'));
            this.sync();
        },

        selectMonth: function(ev) {
        },

        selectPrevMonth: function(ev) {
            this._current.add('months', -1);
            this.sync();
        },

        selectNextMonth: function(ev) {
            this._current.add('months', 1);
            this.sync();
        },

        selectYear: function(ev) {
        },

        selectPrevYear: function(ev) {
            this._current.add('years', -1);
            this.sync();
        },

        selectNextYear: function(ev) {
            this._current.add('years', 1);
            this.sync();
        },

        changeTo: function(obj) {
            if (obj.year) this._current.year(obj.year);
            if (obj.month) this._current.month(obj.month);
            if (obj.date) this._current.date(obj.date);
            if (obj.week) this._current.day(obj.week);
            return this;
        },

        // ### Display
        show: function() {
        },

        hide: function() {
        },
        sync: function(selector) {
            this.model = prepareData(this);
            this.renderPartial('.ui-calendar-weeks');
        },

        templateHelpers: {
            table: function(items, options) {
                var out = '';
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (i % 7 === 0) {
                        out += '<tr>';
                    }
                    out += options.fn(item);
                    if (i % 7 === 6) {
                        out += '</tr>';
                    }
                }
                return out;
            }
        },

        _current: null
    });

    module.exports = Calendar;

    // Helper
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

    // Create a model data on calendar. For example, now is May, 2012.
    // And the week begin at Sunday.
    // This model should be:
    //
    //     {current: current, dates: [...], weeks: [..]}
    //
    function prepareData(obj) {
        var weeks = _prepareWeeks(obj);
        return {
            current: _prepareCurrent(obj),
            weeks: weeks,
            dates: _prepareDates(obj, weeks.start)
        };
    }
    var showMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function _prepareCurrent(obj) {
        var lang = obj.get('lang');
        var current = obj._current;
        return {
            year: current.year(),
            month: translate(lang, showMonths[current.month()]),
            date: current.date(),
            day: current.day(),
            hour: current.hours(),
            minute: current.minutes()
        };
    }

    var fullDays = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    var shortDays = {
        'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4,
        'Fri': 5, 'Sat': 6
    };
    var minDays = {
        'Su': 0, 'Mo': 1, 'Tu': 2, 'We': 3, 'Th': 4, 'Fr': 5, 'Sa': 6
    };
    var showDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    function _prepareWeeks(obj) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        var startDay = obj.get('startDay');
        console.log(startDay);
        var lang = obj.get('lang');
        if (!startDay) {
            startDay = 0;
        } else if (!$.isNumeric(startDay)) {
            if (startDay in fullDays) startDay = days[startDay];
            if (startDay in shortDays) startDay = shortDays[startDay];
            if (startDay in minDays) startDay = minDays[startDay];
        } else {
            startDay = parseInt(startDay);
        }
        var weeks = [];
        for (i = startDay; i < 7; i++) {
            weeks.push({label: translate(lang, showDays[i]), value: i});
        }
        for (i = 0; i < startDay; i++) {
            weeks.push({label: translate(lang, showDays[i]), value: i});
        }
        return {start: startDay, weeks: weeks};
    }
    function _prepareDates(obj, startDay) {
        var current = obj._current;
        var available = obj.get('available');

        var list = [];

        // reset to the first date of the month
        current.date(1);

        // Calculate days of previous month
        // that should be on current month's sheet
        var delta = current.day() - startDay;
        if (delta != 0) {
            var previous = current.clone().add('months', -1);
            var days = previous.daysInMonth();
            // delta in a week
            if (delta < 0) delta += 7;
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                var d = previous.date(days - i);
                list.push({
                    date: d.date(),
                    day: d.day(),
                    label: 'previous',
                    available: isAvailable(d, available)
                });
            }
        }

        for (i = 1; i <= current.daysInMonth(); i++) {
            var d = current.date(i);
            list.push({
                date: d.date(),
                day: d.day(),
                label: 'current',
                available: isAvailable(d, available)
            });
        }

        // Calculate days of next month
        // that should be on current month's sheet
        var delta = 35 - list.length;
        if (delta != 0) {
            var next = current.clone().add('months', 1);
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                var d = next.date(i);
                list.push({
                    date: d.date(),
                    day: d.day(),
                    label: 'next',
                    available: isAvailable(d, available)
                });
            }
        }
        return list;
    }

    function isAvailable(time, available) {
        if (available == null) return true;
        if ($.isArray(available)) {
            var start = available[0];
            var end = available[1];
            var result = true;
            if (start) {
                result = result && time >= moment(start);
            }
            if (end) {
                result = result && time <= moment(end);
            }
            return result;
        }
        if ($.isFunction(available)) {
            return available(time);
        }
        return true;
    }

    function translate(lang, key) {
        if (!lang) return key;
        if (key in lang) return lang[key];
        return key;
    }

    // Template Cache
    function flushCache() {
    }
    function getCache(key) {
    }
});
