define(function(require, exports, module) {

    var $ = require('jquery');
    var Base = require('base');
    var moment = require('moment');

    var dateCustomize;
    var startDay = 0;

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
                        val, this.range
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
                    o.time = this._showTime;
                    return o;
                }
            },

            i18n: null
        },

        initialize: function(config) {
            this._lang = config.lang || {};
            startDay = config.startDay;
            this._activeTime = config.focus.clone();
            dateCustomize = config.dateCustomize;

            this.range = config.range;
            this._showTime = config.showTime;

            config.i18n = config.i18n || {};
            config.i18n.today = 'Today';

            var i18n = {};
            for (var key in config.i18n) {
                i18n[key] = {key: config.i18n[key]};
                i18n[key].value = translate(this._lang, config.i18n[key]);
            }

            this.set('i18n', i18n);
            this.set('mode', 'date');
            this.renderData();
        },

        renderData: function() {
            this.set('year', this._activeTime.year());
            this.set('month', this._activeTime.month());
            this.set('date', this._activeTime.clone());
            this.set('day');
            this.set('time');
        },

        changeTime: function(key, number) {
            this._activeTime.add(key, number);
            this.renderData();
        },

        changeStartDay: function(day) {
            startDay = day;
            this.renderData();
        },

        changeMode: function(mode, obj) {
            obj || (obj = {});
            if ('month' in obj) {
                this._activeTime.month(obj.month);
            }
            if (obj.year) this._activeTime.year(obj.year);
            this.set('mode', mode);
            this.renderData();
        },

        selectDate: function(time) {
            if (time) {
                this._activeTime = moment(time);
                this.renderData();
            }
            return this._activeTime.clone();
        },

        isInRange: function(date) {
            return isInRange(date, this.range);
        },

        toJSON: function() {
            var object = {};
            var attrs = this.attrs;

            for (var attr in attrs) {
                object[attr] = this.get(attr);
            }

            return object;
        },

        range: null,
        _lang: null,
        _activeTime: null,
        _showTime: false
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
            return startDay;
        }

        for (var i = 0; i < DAYS.length; i++) {
            if (DAYS[i].indexOf(startDay) === 0) {
                startDay = i;
                break;
            }
        }
        return startDay;
    }

    function createMonthModel(lang, month) {
        var items = [], current;

        for (i = 0; i < showMonths.length; i++) {
            current = i == month;

            items.push({
                value: i,
                label: translate(lang, showMonths[i]),
                current: current
            });
        }

        current = {
            value: month,
            label: translate(lang, showMonths[month])
        };

        var list = [];
        for (var i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }

        return {current: current, items: list};
    }

    function createYearModel(year) {
        var items = [
            {
                value: year - 10,
                label: '. . .',
                role: 'previous-10-year',
                current: false
            }
        ];

        for (var i = year - 6; i < year + 4; i++) {
            items.push({
                value: i,
                label: i,
                role: 'year',
                current: false
            });
        }
        items[7] = {value: year, label: year, role: 'year', current: true};
        items.push({
            value: year + 10,
            label: '. . .',
            role: 'next-10-year',
            current: false
        });

        var list = [];
        for (i = 0; i < items.length / 3; i++) {
            list.push(items.slice(i * 3, i * 3 + 3));
        }

        return {current: year, items: list};
    }


    var DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function createDayModel(lang) {
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


    function createDateModel(current, range) {
        var items = [], delta, d, daysInMonth;
        startDay = parseStartDay(startDay);

        var pushData = function(d, className) {
            if (dateCustomize) {
                className += ' ' + dateCustomize(d);
            }
            items.push({
                datetime: d.format('YYYY-MM-DD'),
                date: d.date(),
                day: d.day(),
                className: className,
                available: isInRange(d, range)
            });
        };

        // reset to the first date of the month
        var current_month = current.clone().date(1);
        var previous_month = current_month.clone().add('months', -1);
        var next_month = current_month.clone().add('months', 1);

        // Calculate days of previous month
        // that should be on current month's sheet
        delta = current_month.day() - startDay;
        if (delta < 0) delta += 7;
        if (delta != 0) {
            daysInMonth = previous_month.daysInMonth();

            // *delta - 1**: we need decrease it first
            for (i = delta - 1; i >= 0; i--) {
                d = previous_month.date(daysInMonth - i);
                pushData(d, 'previous-month');
            }
        }

        var formattedCurrent = current.format('YYYY-MM-DD');
        daysInMonth = current_month.daysInMonth();
        for (i = 1; i <= daysInMonth; i++) {
            d = current_month.date(i);

            if (d.format('YYYY-MM-DD') === formattedCurrent) {
                pushData(d, 'focused-element');
            } else {
                pushData(d, '')
            }
        }

        // Calculate days of next month
        // that should be on current month's sheet
        delta = 35 - items.length;
        if (delta != 0) {
            if (delta < 0) delta += 7;
            for (i = 1; i <= delta; i++) {
                d = next_month.date(i);
                pushData(d, 'next-month');
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

    function isInRange(time, range) {
        if (range == null) return true;
        if ($.isArray(range)) {
            var start = range[0];
            var end = range[1];
            var result = true;
            if (start) {
                result = result && time >= moment(start);
            }
            if (end) {
                result = result && time <= moment(end);
            }
            return result;
        }
        if ($.isFunction(range)) {
            return range(time);
        }
        return true;
    }

    function translate(lang, key) {
        lang || (lang = {});
        return lang[key] || key;
    }

    module.exports = CalendarModel;
});
