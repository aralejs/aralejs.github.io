define(function(require, exports, module) {
    var $ = require('jquery');
    var Base = require('base');
    var Position = require('position');
    var Shim = require('iframe-shim');
    var Dropdown = module.exports = Base.extend({
        options: {
            srcId: '', // required
            targetId: '.ui-dropdown',
            position: 'left', // center, right
            triggerMethod: 'hover', // click, hover
            container: 'ui-content',
            animate: 'toggle' // height, width, opacity
        },

        hide: function() {
            this.trigger('hide');
            //Todo: Code here
            this.trigger('hidden');
        },

        show: function() {
            this.trigger('show');
            //Todo: Code here
            this.trigger('shown');
        },

        initialize: function(options) {
            var that = this;
            if (!options.srcId) {
                throw 'options.srcId missing';
            }
            this.setOptions(options);
            $(that.options.srcId).on(that.options.triggerMethod, function() {
                var $target = $(that.options.targetId)
                $target.toggle(that.options.animate);
                //Todo: set Position 
                //Todo: using iframe-shim
            });
        }
    });

});
