define("#switchable/0.9.0/slide-debug", ["./switchable"], function(require, exports, module) {
    var Switchable = require('./switchable');
    var Slide = module.exports = Switchable.extend({
        attrs: {
            autoplay: true,
            circular: true
        }
    });
});
