
// load sea.js
(function(m, o, d, u, l, a, r) {
    if(m[d]) return;
    function f(n, t) { return function() { r.push(n, arguments); return t; } }
    m[d] = a = { args: (r = []), config: f(0, a), use: f(1, a) };
    m.define = f(2);
    u = o.createElement('script');
    u.id = d + 'node';
    u.src = '../../../dist/seajs/1.1.0/sea.js';
    l = o.getElementsByTagName('head')[0];
    l.insertBefore(u, l.firstChild);
})(window, document, 'seajs');


// and its friends
seajs.config({
    alias: {
        'events': 'events/0.9.1/events',
        'class': 'class/0.9.1/class',
        'base': 'base/0.9.7/base',
        'widget': 'widget/0.9.3/widget',
        'widget-templatable': 'widget/0.9.3/templatable',

        '$': 'jquery/1.7.2/jquery',
        'jquery': 'jquery/1.7.2/jquery',
        'zepto': 'zepto/0.8.0/zepto',

        'json': 'json/1.0.2/json',
        'underscore': 'underscore/1.3.3/underscore',
        'cookie': 'cookie/1.0.2/cookie',
        'handlebars': 'handlebars/1.0.0/handlebars',
        'store': 'store/1.3.3/store',
        'swfobject': 'swfobject/2.2.0/swfobject',
        'moment': 'moment/1.6.2/moment',
        'async': 'async/0.1.18/async',
        'backbone': 'backbone/0.9.2/backbone',

        'iframe-shim': 'iframe-shim/0.9.0/iframe-shim',
        'overlay': 'overlay/0.9.1/overlay',
        'mask': 'overlay/0.9.1/mask',
        'position': 'position/0.9.1/position',
        'dropdown': 'dropdown/0.9.0/dropdown'

    },
    preload: [this.JSON ? '' : 'json', 'plugin-text']
});
