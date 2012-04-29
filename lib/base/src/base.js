/* @author lifesinger@gmail.com */

define(function(require) {
    var Class = require('./class');
    var Options = require('./options');
    var Events = require('./events');

    return Class.create({
        Implements: [Options, Events]
    });
});
