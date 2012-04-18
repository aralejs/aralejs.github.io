/* @author lifesinger@gmail.com */

var path = require('path');
var Install = require('spm').Install;


exports.update = function(name) {
    new Install([name], {
        to: path.join(__dirname, '../dist')
    }).run();
};
