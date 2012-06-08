define(function(require, exports, module) {

    var $ = require('jquery');
    var Base = require('base');
    var moment = require('moment');

    // Create a model data on calendar. For example, now is May, 2012.
    // And the week begin at Sunday.
    var CalendarModel = Base.extend({

        attrs: {
            year: {
                setter: function(val) {
                    return createYearModel(val);
                }
            },

            month: {
                setter: function(val) {
                    return createMonthModel(this._lang, val);
                }
            },

            day: {
                setter: function(val) {
                    return createDayModel(this._lang, val);
                }
            },

            date: {
                setter: function(val) {
                    return createDateModel(
                        val, this._available, this._startDay
                    );
                }
            },

            time: {
                setter: function(val) {
                    return createTimeModel(val);
                }
            },

            mode: {
                setter: function(current) {
                    var o = {
                        date: false,
                        month: false,
                        year: false
                    };
                    o[current] = true;
                    return o;
                }
            },

            i18n: null
        },

        initialize: function(config) {
            this._lang = config.lang;
            this._current = config.focus.clone();
            this._startDay = config.startDay;
            this._available = config.available;

            config.i18n = config.i18n || {};
            config.i18n.today = 'Today';

            var i18n = {};
            for (var key in config.i18n) {
                i18n[key] = {key: key};
                i18n[key].value = translate(config.lang, config.i18n[key]);
            }

            this.set('i18n', i18n);
            this.set('mode', 'date');
            this.renderData();
        },

        renderData: function() {
            this.set('year', this._current.year());
            this.set('month', this._current.month());
            this.set('day', this._startDay);
            this.set('date', this._current.clone());
            this.set('time');
        },

        changeTime: function(key, number) {
            this._current.add(key, number);
            this.renderData();
        },

        changeStartDay: function(day) {
            this._startDay = day;
            this.renderData();
        },

        changeMode: function(mode) {
            this.set('mode', mode);
            this.renderData();
        },

        selectDate: function(date, month) {
            if (month) this._current.month(month);
            if (date) this._current.date(date);
            this.renderData();
            return this._current.clone();
        },

        toJSON: function() {
            var object = {};
            var attrs = this.attrs;

            for (var attr in attrs) {
                object[attr] = this.get(attr);
            }

            return object;
        },

        _available: null,
        _startDay: 0,
        _current: null,
        _lang: null
    });


    // Helpers
    // -------

    var showMonths = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    var DAYS = [
        'sunday', 'monday', 'tuesday', 'wednesday',
        'thursday', 'friday', 'saturday'
    ];

    function parseStartDay(startDay) {
        startDay = (startDay || 0).toString().toLowerCase();

        if ($.isNumeric(startDay)) {
            startDay = parseInt(startDay);
        }
        else {
            for (var i = 0; i < DAYS.length; i++) {
                if (DAYS[i].indexOf(startDay) === 0) {
                    startDay = i;
                    break;
                }
            }
        }
        return startDay;
    }

    function createMonthModel(lang, month) {
        var items = [];
        for (i = 0; i < showMonths.length; i++) {
            var selected = false;
            if (i == month) selected = true;
            items.push({
                value: i,
                label: translate(lang, showMonths[i]),
                selected: selected
            });
        }
        var current = {
            value: month,
            label: translate(lang, showMonths[month])
        };

        var list = [];
        for (var i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }
        return {current: current, items: list};
    }

    function createYearModel(year/*, range*/) {
        //TODO
        return {current: year};
    }


    var DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function createDayModel(lang, startDay) {
        // Translate startDay to number. 0 is Sunday, 6 is Saturday.
        startDay = parseStartDay(startDay);
        var items = [];
        for (var i = startDay; i < 7; i++) {
            items.push({label: translate(lang, DAY_LABELS[i]), value: i});
        }
        for (i = 0; i < startDay; i++) {
            items.push({label: translate(lang, DAY_LABELS[i]), value: i});
        }
        return {startDay: startDay, items: items};
    }


    function createDateModel(current, range, startDay) {
        var items = [], delta, d;
        startDay = parseStartDay(startDay);

        var pushData = function(d, status) {
            items.push({
                month: d.month(),
                date: d.date(),
                day: d.day(),
                status: status,
                available: isAvailable(d, range)
            });
        };

        // reset to the first date of the month
        var measure = current.clone().date(1);

        // Calculate days of previous month
        // that should be on current month's sheet
        delta = measure.day() - startDay;
        if (delta != 0) {
            var previous = measure.clone().add('months', -1);
            var days = previous.daysInMonth();
            // delta in a week
            if (delta < 0) delta += 7;
            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previous.date(days - i);
                pushData(d, 'previous');
            }
        }

        var formattedCurrent = current.format('YYYY-MM-DD');
        for (i = 1; i <= measure.daysInMonth(); i++) {
            d = measure.date(i);

            var status = '';
            if (d.format('YYYY-MM-DD') === formattedCurrent) {
                status = 'focus';
            }

            pushData(d, status);
        }

        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            var next = measure.clone().add('months', 1);
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = next.date(i);
                pushData(d, 'next');
            }
        }
        var list = [];
        for (var i = 0; i < items.length / 7; i++) {
            list.push(items.slice(i * 7, i * 7 + 7));
        }

        var focus = {
            date: current.date(),
            day: current.day()
        };

        return {focus: focus, items: list};
    }

    function createTimeModel(val) {
        var now = moment(val);
        return {hour: now.hours(), minute: now.minutes()};
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
        lang || (lang = {});
        return lang[key] || key;
    }

    module.exports = CalendarModel;
});
