define(function(require, exports, module) {
    var $ = require('jquery');

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

    function currentModel(cal) {
        var lang = cal.get('lang');
        var current = cal._current;
        return {
            year: current.year(),
            month: translate(lang, showMonths[current.month()]),
            date: current.date(),
            day: current.day(),
            hour: current.hours(),
            minute: current.minutes()
        };
    }

    function weeksModel(cal) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        var startDay = cal.get('startDay');
        var lang = cal.get('lang');
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

    function datesModel(cal, startDay) {
        var current = cal._current;
        var available = cal.get('available');

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

    // Create a model data on calendar. For example, now is May, 2012.
    // And the week begin at Sunday.
    // This model should be:
    //
    //     {current: current, dates: [...], weeks: [..]}
    //
    function CalendarModel(cal) {
        var weeks = weeksModel(cal);
        return {
            current: currentModel(cal),
            weeks: weeks,
            dates: datesModel(cal, weeks.start)
        };
    }
    module.exports = CalendarModel;
});
