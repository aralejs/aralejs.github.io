define(function(require, exports, module) {

    var $ = require('$'),
        easing = require('easing'),
        AnimDialog = require('../src/animDialog');

    // SimpleDialog
    // -------
    // SimpleDialog 组件继承自 Dialog 组件，提供了显隐的基本动画。

    var SimpleDialog = AnimDialog.extend({

    });

    module.exports = SimpleDialog;

});


