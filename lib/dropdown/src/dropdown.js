define(function(require, exports, module) {
    var $ = require('jquery');
    var Base = require('base');
    var Position = require('position');
    var Shim = require('iframe-shim');

    var Dropdown = module.exports = Base.extend({
        init: function(options) {
            var defaults = {};
            $.extend(options, defaults);
        },
        hide: function() {
        },
        show: function() {
        }
    });

});
