

/*=====
arale.__cookieProps = function(){
	//	expires: Date|String|Number?
	//		If a number, the number of days from today at which the cookie
	//		will expire. If a date, the date past which the cookie will expire.
	//		If expires is in the past, the cookie will be deleted.
	//		If expires is omitted or is 0, the cookie will expire when the browser closes. << FIXME: 0 seems to disappear right away? FF3.
	//	path: String?
	//		The path to use for the cookie.
	//	domain: String?
	//		The domain to use for the cookie.
	//	secure: Boolean?
	//		Whether to only send the cookie on secure connections
	this.expires = expires;
	this.path = path;
	this.domain = domain;
	this.secure = secure;
}
=====*/
/**
 * @namespace
 * 获取或者设置cookie, 如果一个参数传入则返回对应的cookie值, 如果2个或者更多参数则是设置cookie
 *
 * @memberOf arale
 * @param {String} name  Name of the cookie
 * @param {String} value Value for the cookie
 * @param {Object} 设置cooke额外的属性
 * @example
 * arale.cookie("configObj", arale.toJson(config), { expires: 5 }); //设置从现在开始5天后过期的cookie
 * arale.cookie("configObj", null, {expires: -1}); //删除一个cookie
 * var config = JSON.parse(arale.cookie("configObj"));
 */
var arale = require('arale.base');
!function (arale) {
    
    var cookie = function(/*String*/name, /*String?*/value, /*arale.__cookieProps?*/props) {
	
        var c = document.cookie;
        if (arguments.length == 1) {
            var matches = c.match(new RegExp("(?:^|; )" + cookie._expEscapeString(name) + "=([^;]*)"));
            return matches ? decodeURIComponent(matches[1]) : undefined; // String or undefined
        } else {
            props = props || {};
    // FIXME: expires=0 seems to disappear right away, not on close? (FF3)  Change docs?
            var exp = props.expires;
            if (typeof exp == "number") {
                var d = new Date();
                d.setTime(d.getTime() + exp*24*60*60*1000);
                exp = props.expires = d;
            }
            if (exp && exp.toUTCString) {
                props.expires = exp.toUTCString(); 
            }

            value = encodeURIComponent(value);
            var updatedCookie = name + "=" + value, propName;
            for (propName in props) {
                updatedCookie += "; " + propName;
                var propValue = props[propName];
                if(propValue !== true){ updatedCookie += "=" + propValue; }
            }
            document.cookie = updatedCookie;
        }
    };

    /**
     * 给正则表达式中的特殊字符增加转移字符
     *
     * @param {String} str 
     * @param {String} except 需要排除的字符序列
     */
    cookie._expEscapeString = function(/*String*/str, /*String?*/except){
        return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
            if(except && except.indexOf(ch) != -1){
                return ch;
            }
            return "\\" + ch;
        }); // String
    };

    /**
     * 当前页面是否支持cookie
     */

    cookie.isSupported = function(){
        //	summary:
        //		Use to determine if the current browser supports cookies or not.
        //
        //		Returns true if user allows cookies.
        //		Returns false if user doesn't allow cookies.

        if(!("cookieEnabled" in navigator)){
            this("__djCookieTest__", "CookiesAllowed");
            navigator.cookieEnabled = this("__djCookieTest__") == "CookiesAllowed";
            if(navigator.cookieEnabled){
                this("__djCookieTest__", "", {expires: -1});
            }
        }
        return navigator.cookieEnabled;
    };
   arale.cookie = exports = module.exports = cookie;
}(arale);
