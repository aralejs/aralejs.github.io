// Calendar
// ============
//
// Calendar is also known as datepicker. It is widely used in web apps.
//
// This calendar is a part of [arale](http://aralejs.org) project, therefore,
// it is suitable for any project that is powered by [seajs](http://seajs.org).
//
// Syntax Overview:
//
//     var Calendar = require('calendar');
//     var cal = Calendar({
//         srcNode: element,
//         format: "YYYY-MM-DD"
//     });
//
// Need more complex task? Head over to Custom section.

define(function(require, exports, module) {

    // Calendar is designed for desktop, we don't need to consider ``zepto``.
    var $ = require('jquery');

    // Thanks to [moment](http://momentjs.com/), parsing, manipulating
    // and formatting dates are much easier now.
    var moment = require('moment');

    // Calendar will stay in an overlay. Thanks to [pianyou](http://pianyou.me/)
    // for his fantastic position model.
    var Overlay = require('overlay');

    var Calendar = function(options) {
        if (!(this instanceof Calendar)) {
            return new Calendar(options);
        }
    }

    // Helper
    // -------
    module.exports = Calendar;
});
