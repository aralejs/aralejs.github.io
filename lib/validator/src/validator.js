define(function(require, exports, module) {
    var Core = require('./core'),
        Widget = require('widget');

    var Validator = Core.extend({
        setup: function() {
            Validator.superclass.setup.call(this);

            this.on('itemValidate', function() {
                console.log('itemValidate');
            });

            this.on('itemValidated', function() {
                console.log('itemValidated');
            });

            this.on('formValidate', function() {
                console.log('formValidate');
            });

            this.on('formValidated', function() {
                console.log('formValidated');
            });
        }
    });

    module.exports = Validator;
});
