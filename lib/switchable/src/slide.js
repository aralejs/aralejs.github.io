define(function(require, exports, module) {
    var Base = require('./base');
    var Slide = module.exports = Base.extend({
        options: {
            autoplay: true,
            circular: true
        }
    });
});
