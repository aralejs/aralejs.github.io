define(function(require, exports, module) {

    var $ = require('jquery');
    var Base = require('base');

    // Create a model data on calendar. For example, now is May, 2012.
    // And the week begin at Sunday.
    // This model should be:
    //
    //     {current: current, dates: [...], weeks: [..]}
    //
    var CalendarModel = Base.extend({

        attrs: {
            current: null,
            weeks: null,
            dates: [],
            focus: null,
            today: ''
        },

        initialize: function(cal) {
            this._lang = cal.lang;
            this._current = cal.focus.clone();
            this._startDay = cal.startDay;
            this._available = cal.available;

            var today = translate(cal.lang, 'Today');
            this.set({
                focus: cal.focus,
                today: today
            });

            this.renderData();
        },

        renderData: function() {
            this.set('current', currentModel(this._lang, this._current));
            this.set('weeks', weeksModel(this._lang, this._startDay));
            var dates = datesModel(
                this._current.clone(), this._available,
                this.get('focus').format('YYYY-MM-DD'), this._startDay
            );
            this.set('dates', dates);
        },

        changeTime: function(arg, number) {
            this._current.add(arg, number);
            this.renderData();
            return this;
        },

        changeStartDay: function(day) {
            this._startDay = day;
            this.renderData();
            return this;
        },

        getDate: function(date) {
            if (date) this._current.date(date);
            return this._current.clone();
        },

        toJSON: function() {
            return {
                current: this.get('current'),
                weeks: this.get('weeks'),
                dates: this.get('dates'),
                focus: this.get('focus'),
                today: this.get('today')
            }
        },

        _available: null,
        _startDay: 0,
        _current: null,
        _lang: null
    });

    var showMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    var showDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

    function currentModel(lang, current) {
        var month = current.month();
        var months = [];
        for (i = 0; i < showMonths.length; i++) {
            var selected = false;
            if (i == month) selected = true;
            months.push({
                value: i,
                label: translate(lang, showMonths[i]),
                selected: selected
            });
        }
        return {
            year: current.year(),
            month: translate(lang, showMonths[month]),
            months: months,
            date: current.date(),
            day: current.day(),
            hour: current.hours(),
            minute: current.minutes()
        };
    }

    function parseStartDay(startDay) {
        if (!startDay) {
            startDay = 0;
        } else if (!$.isNumeric(startDay)) {
            if (startDay in fullDays) startDay = days[startDay];
            if (startDay in shortDays) startDay = shortDays[startDay];
            if (startDay in minDays) startDay = minDays[startDay];
        } else {
            startDay = parseInt(startDay);
        }
        return startDay;
    }

    function weeksModel(lang, startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        var startDay = parseStartDay(startDay);
        var weeks = [];
        for (i = startDay; i < 7; i++) {
            weeks.push({label: translate(lang, showDays[i]), value: i});
        }
        for (i = 0; i < startDay; i++) {
            weeks.push({label: translate(lang, showDays[i]), value: i});
        }
        return {start: startDay, items: weeks};
    }

    function datesModel(current, available, focus, startDay) {
        var items = [];
        var startDay = parseStartDay(startDay);

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
                items.push({
                    date: d.date(),
                    day: d.day(),
                    label: 'previous',
                    available: isAvailable(d, available)
                });
            }
        }

        for (i = 1; i <= current.daysInMonth(); i++) {
            var d = current.date(i);
            if (d.format('YYYY-MM-DD') === focus) {
                var label = 'current focus';
            } else {
                var label = 'current';
            }
            items.push({
                date: d.date(),
                day: d.day(),
                label: label,
                available: isAvailable(d, available)
            });
        }

        // Calculate days of next month
        // that should be on current month's sheet
        var delta = 35 - items.length;
        if (delta != 0) {
            var next = current.clone().add('months', 1);
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                var d = next.date(i);
                items.push({
                    date: d.date(),
                    day: d.day(),
                    label: 'next',
                    available: isAvailable(d, available)
                });
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
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

    module.exports = CalendarModel;
});
