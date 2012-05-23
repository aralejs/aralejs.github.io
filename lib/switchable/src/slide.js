define(function(require, exports, module) {
    var Switchable = require('./switchable');
    var Slide = module.exports = Switchable.extend({
        options: {
            autoplay: true,
            circular: true
        }
    });
});
