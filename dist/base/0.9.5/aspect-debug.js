define("#base/0.9.5/aspect-debug", [], function(require, exports) {

    // Aspect
    // ---------------------
    // Thanks to:
    //  - http://yuilibrary.com/yui/docs/api/classes/Do.html
    //  - http://code.google.com/p/jquery-aop/
    //  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/


    // 在指定方法执行前，先执行 callback
    exports.before = function(methodName, callback, context) {
        return weave.call(this, 'before', methodName, callback, context);
    };


    // 在指定方法执行后，再执行 callback
    exports.after = function(methodName, callback, context) {
        return weave.call(this, 'after', methodName, callback, context);
    };


    // Helpers
    // -------

    function weave(when, methodName, callback, context) {
        var method = getMethod(this, methodName);
        if (!method.__isAspected) {
            wrap.call(this, methodName);
        }
        return this.on(when + ':' + methodName, callback, context);
    }


    function getMethod(host, methodName) {
        var method = host[methodName];
        if (!method) {
            throw 'Invalid method name: ' + methodName;
        }
        return method;
    }


    function wrap(methodName) {
        var old = this[methodName];

        this[methodName] = function() {
            var args = Array.prototype.slice.call(arguments);
            var beforeArgs = ['before:' + methodName].concat(args);

            this.trigger.apply(this, beforeArgs);
            var ret = old.apply(this, arguments);
            this.trigger('after:' + methodName, ret);

            return ret;
        };

        this[methodName].__isAspected = true;
    }

});
