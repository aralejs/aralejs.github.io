define("#switchable/0.9.2/autorender-debug", ["jquery"], function(require, exports, module) {
    var $ = require('jquery');

    module.exports = autoRender = function(hook, rootElement) {
        hook = '.' + (hook || 'AR_Widget');
        $.each($(hook, rootElement), function(index, elem) {
            var configAttr;
            var elem = $(elem);
            var type = elem.attr('data-widget-type');

            if (type && ('tabs slide carousel accordion'.indexOf(type) > -1)) {
                try {
                    configAttr = elem.attr('data-widget-config');
                    if (configAttr) {
                        configAttr = configAttr.replace(/'/g, '"');
                    }

                    var config = $.parseJSON(configAttr) || {};
                    config.element = elem[0];
                    seajs.use(type, function(W) {
                        new W(config);
                    });
                } catch (ex) {
                    //console.log(ex);
                    //alert('error');
                }
            }
        });
    };
});
