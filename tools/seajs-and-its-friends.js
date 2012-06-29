
// load sea.js
(function(m, o, d, u, l, a, r) {
    if(m[d]) return;
    function f(n, t) { return function() { r.push(n, arguments); return t; } }
    m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
    m.define = f(2);
    u = o.createElement('script');
    u.id = d + 'node';
    u.src = '../../../dist/seajs/1.1.9/sea.js';
    l = o.getElementsByTagName('head')[0];
    l.insertBefore(u, l.firstChild);
})(window, document, 'seajs');


// and its friends
seajs.config({

    alias: {

        // 外来模块
        '$': 'jquery/1.7.2/jquery',
        'jquery': 'jquery/1.7.2/jquery',
        'zepto': 'zepto/0.9.0/zepto',
        'underscore': 'underscore/1.3.3/underscore',
        'json': 'json/1.0.2/json',
        'handlebars': 'handlebars/1.0.0/handlebars',
        'moment': 'moment/1.6.2/moment',
        'async': 'async/0.1.18/async',
        'store': 'store/1.3.3/store',
        'swfobject': 'swfobject/2.2.0/swfobject',
        'backbone': 'backbone/0.9.2/backbone',
        'jasmine': 'jasmine/1.1.0/jasmine-html',


        // Infrastructure
        /* seajs 1.2 尚未开始 */
        'events': 'events/0.9.1/events',                     // 100%
        'class': 'class/0.9.2/class',                        // 100%
        'base': 'base/0.9.16/base',                          // 95%
        'widget': 'widget/0.9.16/widget',                    // 95%
        'templatable': 'widget/0.9.16/templatable',          // 95%
        'daparser': 'widget/0.9.16/daparser',                // 95%


        // Utilities
        'cookie': 'cookie/1.0.2/cookie',                     // 100%
        'easing': 'easing/0.9.3/easing',                     // 100%
        'iframe-shim': 'iframe-shim/0.9.1/iframe-shim',      // 95%
        'position': 'position/0.9.1/position',               // 95%

        'validator-core': 'validator/0.8.1/core-debug.js',         // 60%
        'validator': 'validator/0.8.1/validator-debug.js',         // 60%
        /* querystring 待迁移 */


        // Widgets
        'overlay': 'overlay/0.9.7/overlay',                  // 95%
        'mask': 'overlay/0.9.7/mask',                        // 95%
        'base-dialog': 'dialog/0.9.0/base-dialog',             // 70%
        'anim-dialog': 'dialog/0.9.0/anim-dialog',             // 70%
        'confirm-box': 'dialog/0.9.0/confirm-box',             // 70%

        'triggerable': 'triggerable/0.9.3/triggerable',      // 95%
        'dropdown': 'triggerable/0.9.3/dropdown',            // 95%

        'switchable': 'switchable/0.9.5/switchable',         // 90%
        'tabs': 'switchable/0.9.5/tabs',                     // 90%
        'slide': 'switchable/0.9.5/slide',                   // 90%
        'accordion': 'switchable/0.9.5/accordion',           // 90%
        'carousel': 'switchable/0.9.5/carousel',             // 90%

        'calendar': 'calendar/0.8.0/calendar'                // 80%


        // Others
        /* spm */
        /* araledoc */


        // 二期组件
        // ua
        // placeholder
        // popup
        // tooltip
        // 等待详细规划和讨论
    },

    preload: [this.JSON ? '' : 'json', 'seajs/plugin-text']
});
