define("#switchable/0.8.1/slide-debug", ["./switchable"], function(require, exports, module) {
    var Switchable = require('./switchable');
    var Slide = module.exports = Switchable.extend({
        options: {
            autoplay: true,
            circular: true
        }
    });
});
