(function(data, util, fn, global) {
    var RP = fn.Require.prototype,
        base = data.config.base,
        debug = data.config.debug,
        load = RP.load,
        arTypeReg = /a(?:ralex?|lipay)/,
        modUrls = [], 
        cbs = [];
    var getComboUrl = function() {
        var url = data.config.base,
            mid;
        var n_modUrls = modUrls;
        modUrls = [];
        
        while((mid = n_modUrls.shift()) != null) {
            url += getComboPart(mid) + ',';
        }
        if (url.charAt(url.length -1) == ',') {
            url = url.substring(0, url.length - 1);
        }
        return url;
    };
    var getComboPart = function(url) {
        var mid = url.substring(url.lastIndexOf('/') + 1);
        if (debug) {
            if (mid.indexOf('-src.js') < 0) {
                mid = mid.replace('.js', '-src.js');
            }
        }
        var mType = mid.substring(0, mid.indexOf('.'));
        if (arTypeReg.test(mType)) {
            mid = 'ar/' + mid;
        } else {
            mid = mType + '/' + mid;
        }
        return mid; 
    };
    var invokeCb = function() {
        var n_cbs = cbs;
        cbs = [];
        while(n_cbs.length) {
             n_cbs.shift()();
        }
    };

    var wait;
    RP.load = function(url, callback, charset) {
        var args = arguments;
        //检查id, 如果符合我们的id规则, 则进行combo式的, 等待式的url处理. 如果是不符合我们规则的, 则直接pass(也就是直接调用原有的load.这个可能没有必要
        //因为我们打包的这个插件本来就是为我们所用的.)
        //我们这里需要收集callback即可.
        console.log('test', arguments);
        if (modUrls.indexOf(url) < 0) {
            modUrls.push(url);
        }
        cbs.push(callback);
        if (wait) {
            clearTimeout(wait);
        }

        wait = setTimeout( function() {
            load.call(RP, getComboUrl(), invokeCb, charset);
        }, 100); 
    }
})(seajs._data, seajs._util, seajs._fn, this);



