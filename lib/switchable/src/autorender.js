define(function(require, exports, module) {
    var $ = require('jquery');

    module.exports = autoRender = function(hook, rootElement) {
        hook = '.' + (hook || 'AR_Widget');
        $.each($(hook, rootElement), function(index, elem) {
            var config;
            var elem = $(elem);
            var type = elem.attr('data-widget-type');

            if (type && ('Tabs Slide Carousel Accordion'.indexOf(type) > -1)) {
                try {
                    config = elem.attr('data-widget-config');
                    if (config) {
                        config = config.replace(/'/g, '"');
                    }

                    var options = $.parseJSON(config) || {};
                    options.element = elem[0];
                    seajs.use(type, function(W) {
                        new W(options);
                    });
                } catch (ex) {
                    alert('error');
                }
            }
        });
    };
});
