/**
 * @namespace
 * 返回当前浏览器的相关属性包括浏览器的版本、内核以及平台等信息.
 * <br/>
 * 旨在arale顶层命名空间加入arale.isIE(), arale.isOpera() , arale.isSafari()
 */
define(function(require) {

  var arale = require('./base');

  //rendering engines
  /**
   * 浏览器引擎信息
   * @memberOf arale.browser
   * @name Engine
   * @type Object
   */
  var engine = {
    /** @lends arale.browser.Engine */
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,
    //complete version
    /**
     * 浏览器引擎版本
     * @memberOf arale.browser
     * @type String
     */
    ver: null,
    /**
     * 浏览器引擎名称
     * @memberOf arale.browser
     * @type String
     */
    name: null
  };
  //browsers
  /**
   * 浏览器信息
   * @memberOf arale.browser
   * @type Object
   * @name Browser
   */
  var browser = {
    /** @lends arale.browser.Browser */
    //browsers
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,
    safari: 0,
    //specific version
    /**
     * 浏览器版本
     * @memberOf arale.browser
     * @type String
     */
    ver: null,
    /**
     * 浏览器名称
     * @memberOf arale.browser
     * @type String
     */
    name: ''
  };
  /**
   * 操作系统信息
   * @memberOf arale.browser
   * @type Object
   * @name System
   */
  var system = {
    /** @lends arale.browser.System */
    /**
     * 是否是windows平台
     * @memberOf arale.browser
     * @type Boolean
     */
    win: false,
    /**
     * 是否是mac平台
     * @memberOf arale.browser
     * @type Boolean
     */
    mac: false,
    /**
     * 是否是x11平台
     * @memberOf arale.browser
     * @type Boolean
     */
    x11: false,
    //mobile devices
    /**
     * 是否是iphone平台
     * @memberOf arale.browser
     * @type Boolean
     */
    iphone: false,
    /**
     * 是否是ipod平台
     * @memberOf arale.browser
     * @type Boolean
     */
    ipod: false,
    /**
     * 是否是nokiaN平台
     * @memberOf arale.browser
     * @type Boolean
     */
    nokiaN: false,
    /**
     * 是否是winMobile平台
     * @memberOf arale.browser
     * @type Boolean
     */
    winMobile: false,
    /**
     * 是否是macMobile平台
     * @memberOf arale.browser
     * @type Boolean
     */
    macMobile: false,
    //game systems
    /**
     * 是否是wii平台
     * @memberOf arale.browser
     * @type Boolean
     */
    wii: false,
    /**
     * 是否是ps平台
     * @memberOf arale.browser
     * @type Boolean
     */
    ps: false,
    /**
     * 操作系统名称
     * @memberOf arale.browser
     * @type String
     */
    name: null
  };
  //detect rendering engines/browsers
  var ua = navigator.userAgent;
  if (window.opera) {
    engine.ver = browser.ver = window.opera.version();
    engine.opera = browser.opera = parseFloat(engine.ver);
  }else if (/AppleWebKit\/(\S+)/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.webkit = parseFloat(engine.ver);
    //figure out if it’s Chrome or Safari
    if (/Chrome\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.chrome = parseFloat(browser.ver);
    } else if (/Version\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.safari = parseFloat(browser.ver);
    } else {
      //approximate version
      var safariVersion = 1;
      if (engine.webkit < 100) {
        safariVersion = 1;
      } else if (engine.webkit < 312) {
        safariVersion = 1.2;
      } else if (engine.webkit < 412) {
        safariVersion = 1.3;
      } else {
        safariVersion = 2;
      }
      browser.safari = browser.ver = safariVersion;
    }
  } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.khtml = browser.konq = parseFloat(engine.ver);
  } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
    engine.ver = RegExp['$1'];
    engine.gecko = parseFloat(engine.ver);
    //determine if it’s Firefox
    if (/Firefox\/(\S+)/.test(ua)) {
      browser.ver = RegExp['$1'];
      browser.firefox = parseFloat(browser.ver);
    }
  } else if (/MSIE ([^;]+)/.test(ua)) {
    engine.ver = browser.ver = RegExp['$1'];
    engine.ie = browser.ie = parseFloat(engine.ver);
  }
  //detect browsers
  browser.ie = engine.ie;
  browser.opera = engine.opera;
  //detect platform
  var p = navigator.platform;
  system.win = p.indexOf('Win') == 0;
  system.mac = p.indexOf('Mac') == 0;
  system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0);
  //detect windows operating systems
  if (system.win) {
    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
      if (RegExp['$1'] == 'NT') {
        switch (RegExp['$2']) {
          case '5.0':
            system.win = '2000';
            break;
          case '5.1':
            system.win = 'XP';
            break;
          case '6.0':
            system.win = 'Vista';
            break;
          default:
            system.win = 'NT';
            break;
        }
      } else if (RegExp['$1'] == '9x') {
        system.win = 'ME';
      } else {
        system.win = RegExp['$1'];
      }
    }
  }
  //mobile devices
  system.iphone = ua.indexOf('iPhone') > -1;
  system.ipod = ua.indexOf('iPod') > -1;
  system.nokiaN = ua.indexOf('NokiaN') > -1;
  system.winMobile = (system.win == 'CE');
  system.macMobile = (system.iphone || system.ipod);
  //gaming systems
  system.wii = ua.indexOf('Wii') > -1;
  system.ps = /playstation/i.test(ua);
  /**
   * 是否是IE系列浏览器
   * @memberOf arale
   * @returns {Boolean} 是否是IE系列浏览器
   */
  arale.isIE = function() {
    return browser.ie > 0;
  };
  /**
   * 是否是IE6浏览器
   * @memberOf arale
   * @returns {Boolean} 是否是IE6浏览器
   */
  arale.isIE6 = function() {
    return browser.ie == 6;
  };
  /**
   * 是否是firefox浏览器
   * @memberOf arale
   * @returns {Boolean} 是否是firefox浏览器
   */
  arale.isFF = function() {
    return browser.firefox > 0;
  };
  /**
   * 是否是chrome浏览器
   * @memberOf arale
   * @returns {Boolean} 是否是chrome浏览器
   */
  arale.isChrome = function() {
    return browser.chrome > 0;
  };
  /**
   * 判断是否是safari浏览器
   * @memberOf arale
   * @returns {Boolean} 是否是safari浏览器
   */
  arale.isSafari = function() {
    return browser.safari > 0;
  };
  /**
   * 是否是opera浏览器
   * @memberOf arale
   * @returns {Boolean} 是否是opera浏览器
   */
  arale.isOpera = function() {
    return browser.opera > 0;
  };
  /**
   * 判断是否是mac操作系统
   * @memberOf arale
   * @returns {Boolean} 是否是mac操作系统
   */
  arale.isMac = function() {
    return system.mac;
  };
  browser.name = arale.isIE() ? 'ie' : (arale.isFF() ? 'firefox' : (arale.isChrome() ? 'chrome' : (arale.isSafari() ? 'safari' : (arale.isOpera() ? 'opera' : 'unknown'))));
  var s = system;
  system.name = s.win ? 'win' : (s.mac ? 'mac' : (s.x11 ? 'x11' : (s.iphone ? 'iphone' : (s.ipod ? 'ipod' : (s.nokiaN ? 'nokiaN' : (s.winMobile ? 'winMobile' : (s.macMobile ? 'macMobile' : (s.wii ? 'wii' : (s.ps ? 'ps' : 'unknown')))))))));
  var e = engine;
  engine.name = e.ie ? 'ie' : (e.gecko ? 'gecko' : (e.webkit ? 'webkit' : (e.khtml ? 'khtml' : (e.opera ? 'opera' : 'unknown'))));

  arale.browser = {
    /** @lends arale.browser */
    /**
     * 浏览器名称
     * @memberOf arale.browser
     * @type String
     */
    name: browser.name,
    Engine: engine,
    Browser: browser,
    System: system,
    /**
     * @memberOf arale.browser
     * @returns {String} 浏览器版本
     */
    ver: function() {
      return this.Browser.ver;
    },
    /**
     * 获取不同浏览器下的XMLHTTP对象
     * @memberOf arale.browser
     * @example
     * var xhr = arale.browser.Request()
     * @returns {Object} XMLHTTP对象
     */
    Request: function() {
      if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
      }else if (typeof ActiveXObject != 'undefined') {
        if (typeof arguments.callee.activeXString != 'string') {
          var versions = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP', 'MSXML2.XMLHttp.6.0'];
          for (var i = 0, len = versions.length; i < len; i++) {
            try {
              var xhr = new ActiveXObject(versions[i]);
              arguments.callee.activeXString = versions[i];
              return xhr;
            }catch (ex) {//skip
            }
          }
        }
        return new ActiveXObject(arguments.callee.activeXString);
      } else {
        throw new Error('No XHR object available.');
      }
    }
  };
});
