define(function(require, exports, module) {
    var $ = require('jquery');

    exports.parseRule = function(str) {
        //valueBetween{min: 1, max: 2}
        var match = str.match(/([^{}:\s]*)(\{.*\})?/);
        console.log(match);

        return {
            name: match[1],
            param: $.parseJSON(match[2])
        };
    };
});
