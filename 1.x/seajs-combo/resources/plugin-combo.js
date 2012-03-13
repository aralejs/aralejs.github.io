var arTypeReg = /a(?:ralex?|lipay)/, // judge arale core module.
    cbs = [], //collect callback.
    debug,
    modUrls = [],
    load,
    RP = require.constructor.prototype,
    seajsData = seajs.pluginSDK.data, //seajs data
    util = seajs.pluginSDK.util,
    wait;

debug = seajsData.config.debug;

load = RP.load;
RP.load = function(url, callback, charset) {
    cbs.push(callback);
    ~modUrls.indexOf(url) || modUrls.push(url);

    wait && clearTimeout(wait);
    wait = setTimeout(function() {
        load.call(RP, getComboUrl(), invokeCb, charset);
    }, 100); 
};

var getComboUrl = function() {
    var moduleId,
        needChangedModUrls = modUrls,
        url = seajsData.config.base;

    modUrls = [];
    
    while ((mid = needChangedModUrls.shift()) != null) {
        url += changeComboPath(mid) + ',';
    }
    if (url.charAt(url.length -1) == ',') {
        url = url.substring(0, url.length - 1);
    }
    return url;
};

var changeComboPath = function(mid) {
    var comboPart = mid.substring(mid.lastIndexOf('/') + 1);
    if (debug) {
        comboPart = comboPart.replace('.js', '-src.js');
    }

    var moduleType = comboPart.substring(0, mid.indexOf('.'));

    moduleType = arTypeReg.test(moduleType) ? 'ar/' : moduleType + '/';

    return moduleType + comboPart; 
};

var invokeCb = function() {
    var moduleLoadedCbs = cbs;
    cbs = [];
    while (moduleLoadedCbs.length) {
        moduleLoadedCbs.shift()();
    }
};
