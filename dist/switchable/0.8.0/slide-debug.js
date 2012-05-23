define("#switchable/0.8.0/slide-debug", ["./base"], function(require, exports, module) {
    var Base = require('./base');
    var Slide = module.exports = Base.extend({
        options: {
            autoplay: true,
            circular: true
        }
    });
});
