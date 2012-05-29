define(function(require, exports, module) {
    var Switchable = require('./switchable');
    var Slide = module.exports = Switchable.extend({
        attrs: {
            autoplay: true,
            circular: true
        }
    });
});
