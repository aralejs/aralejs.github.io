define(function(require, exports) {

    // Aspect
    // ---------------------
    // Thanks to:
    //  - http://yuilibrary.com/yui/docs/api/files/event-custom_js_event-do.js.html
    //  - http://code.google.com/p/jquery-aop/
    //  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/

    var BEFORE = 0;
    var AFTER = 1;


    // 在指定方法执行前，执行 callback
    exports.before = function(methodName, callback, context) {
        return inject(this, methodName, BEFORE, callback, context);
    };


    // 在指定方法执行后，执行 callback
    exports.after = function(methodName, callback, context) {
        return inject(this, methodName, AFTER, callback, context);
    };


    // Helpers
    // -------

    function inject(host, methodName, when, callback, context) {
        


        return host;
    }
});
