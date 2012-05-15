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

    // ### Base (arale)
    // arale base contains:
    //
    // - events
    // - class
    // - options
    var Base = require('base');

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
        // i18n support
        lang: 'zh_CN',
        // start of a week, default is Sunday.
        startDay: 'Sun',

        // when initialize a calendar, which date should be focused.
        // default is today.
        focus: null,

        // width of calendar
        width: 400,

        // height of calendar
        height: 300,

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
        available: null
    };

    // default theme gallery
    var themes = ['simple'];

    // ## Calendar
    var Calendar = Base.extend({
        now: moment(),
        options: defaults,

        // ### Initialize
        initialize: function(options) {
            this.setOptions(options);
        },

        // ### Options
        width: function(value) {
            return this._getOrSetOption('width', value);
        },
        height: function(value) {
            return this._getOrSetOption('height', value);
        },
        format: function(value) {
            return this._getOrSetOption('format', value);
        },
        _getOrSetOption: function(name, value) {
            if (value === undefined) {
                return this.options[name];
            }
            this.options[name] = value;
            return value;
        },

        // ### Display
        show: function() {
        },

        hide: function() {
        },

        destroy: function() {
        },

        // ### Template Cache
        _flushCache: function() {
        },
        _getCache: function(key) {
        }
    });

    module.exports = Calendar;

    // Helper
    // -------
    // theme support for calendar.
    // default theme is a simple word, custom theme is a url path
    function getThemeCSS(theme) {
        if (themes.indexOf(theme) === -1) {
            // - single word: simple
            // TODO: full path
            return 'themes/' + theme + '.css';
        }
        if (theme.slice(-1) === '/') {
            // - path: /path/to/
            return theme + 'calendar.css';
        }
        // - full path: /path/to/calendar.css
        return theme;
    }
});
