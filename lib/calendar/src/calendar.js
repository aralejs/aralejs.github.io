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
    var model = require('./model');

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
            'click {{dataset.role.date}}': 'selectDate',
            'click {{dataset.role.week}}': 'selectWeek',
            'click {{dataset.role.prevMonth}}': 'selectPrevMonth',
            'click {{dataset.role.nextMonth}}': 'selectNextMonth',
            'click {{dataset.role.prevYear}}': 'selectPrevYear',
            'click {{dataset.role.nextYear}}': 'selectNextYear'
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
                this.model = model(this);
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
            this.model = model(this);
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

    // Template Cache
    function flushCache() {
    }
    function getCache(key) {
    }
});
