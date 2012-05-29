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
    var Templatable = require('../../widget/src/templatable');
    //var Templatable = require('widget-templatable');

    var template = require('./calendar.tpl');
    console.log(template);

    // ### Overlay (arale)
    // Calendar will stay in an overlay. Thanks to [pianyou](http://pianyou.me/)
    // for his fantastic position model.

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
                this.model = prepareData(
                    this._current, this.get('startDay'), this.get('available')
                );
                console.log(this.model);
                //this.model = {'now': 'xxxx'};
            });
            Calendar.superclass.initialize.call(this, config);
        },

        setup: function() {
            // load theme css
            //require.async(getThemeCSS(this.options.theme));
        },

        // ### Actions
        // - select a day on calendar
        select: function(day) {
            this._current.day(day - 1);
            this.trigger('select', this._current.clone());
            return this._current.format(this.options.format);
        },

        // - change year or month on calendar:
        //
        //      var cal = Calendar();
        //      cal.changeTo(11);  // change to December
        //      cal.changeTo(2011);  // change to 2011
        //      cal.changeTo(2011, 11);
        //      cal.changeTo([2011, 11]);
        //      cal.changeTo([null, 11]);
        //      cal.changeTo({year: 2011, month: 11});
        changeTo: function(year, month) {
            if (month) {
                this._current.year(year);
                this._current.month(month);
                return this;
            }
            if ($.isNumeric(year)) {
                if (year < 12) {
                    month = year;
                    year = null;
                }
            } else if ($.isArray(year)) {
                month = year[1];
                year = year[0];
            } else if ($.isPlainObject(year)) {
                month = year.month;
                year = year.year;
            }
            if (year) this._current.year(year);
            if (month) this._current.month(month);
            //this.trigger('change', this._current.clone());
            return this;
        },

        // ### Display
        show: function() {
        },

        hide: function() {
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
    // Create a model data on calendar. For example, now is May, 2012.
    // And the week begin at Sunday.
    // This model should be:
    //
    //     {active: active, dates: [...], weeks: [..]}
    //
    function prepareData(active, startDay, available) {
        var returns = {active: active.clone()};

        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        if (!startDay) {
            startDay = 0;
        } else if (!$.isNumeric(startDay)) {
            if (startDay in fullDays) startDay = days[startDay];
            if (startDay in shortDays) startDay = shortDays[startDay];
            if (startDay in minDays) startDay = minDays[startDay];
        } else {
            startDay = 0;
        }
        var weeks = [];
        for (i = startDay; i < 7; i++) {
            weeks.push(showDays[i]);
        }
        for (i = 0; i < startDay; i++) {
            weeks.push(showDays[i]);
        }

        returns.weeks = weeks;

        var list = [];

        // reset to the first date of the month
        active.date(1);

        // Calculate days of previous month
        // that should be on current month's sheet
        var delta = active.day() - startDay;
        if (delta != 0) {
            var previous = active.clone().add('months', -1);
            var days = previous.daysInMonth();
            // delta in a week
            if (delta < 0) delta += 7;
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                list.push({
                    value: days - i,
                    label: 'previous',
                    available: isAvailable(previous.date(days - i), available)
                });
            }
        }

        for (i = 1; i <= active.daysInMonth(); i++) {
            list.push({
                value: i,
                label: 'active',
                available: isAvailable(active.date(i), available)
            });
        }

        // Calculate days of next month
        // that should be on current month's sheet
        var delta = 35 - list.length;
        if (delta != 0) {
            var next = active.clone().add('months', 1);
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                list.push({
                    value: i,
                    label: 'next',
                    available: isAvailable(next.date(i), available)
                });
            }
        }

        returns.dates = list;
        return returns;
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

    // Template Cache
    function flushCache() {
    }
    function getCache(key) {
    }
});
