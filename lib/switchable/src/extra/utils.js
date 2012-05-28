define(function(require, exports, module) {


    // Thanks to:
    // https://github.com/kissyteam/kissy
    var utils = module.exports;

    var $ = require('jquery');

    var _ = require('underscore');
    var toString = Object.prototype.toString;

    var OP = Object.prototype;
    var toString = OP.toString;
    var FALSE = false;

    /**
     * Executes the supplied function in the context of the supplied
     * object 'when' milliseconds later. Executes the function a
     * single time unless periodic is set to true.
     * @param {Function|String} fn the function to execute or the name of
     * the method in the 'o' object to execute.
     * @param {Number} when the number of milliseconds to wait until the
     * fn is executed.
     * @param {Boolean} [periodic] if true, executes continuously at
     * supplied interval until canceled.
     * @param {Object} [context] the context object.
     * @param {data} that is provided to the function. This accepts
     *        either a single item or an array. If an array is provided,
     *        the function is executed with one parameter for
     *        each array item. If you need to pass a single array
     *        parameter, it needs to be wrapped in an array [myarray].
     * @return {Object} a timer object. Call the cancel() method on this
     *         object to stop the timer.
     */
    var later = utils.later = function(fn, when, periodic, context, data) {
        when = when || 0;
        var m = fn,
            d = $.makeArray(data),
            f,
            r;

        if (_.isString(fn)) {
            m = context[fn];
        }

        if (!m) {
            console.error('method undefined');
            //TODO 需要错误处理
        }

        f = function() {
            m.apply(context, d);
        };

        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

        return {
            id: r,
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    };

    /**
     * buffers a call between a fixed time
     * @param {function} fn 需要buffer的函数.
     * @param {object} context 可选。 函数执行context.
     * @param {Number} ms 是否延迟执行.
     * @return {function} Returns a wrapped function that calls fn buffered.
     */
    utils.buffer = function(fn, ms, context) {
        ms = ms || 150;

        if (ms === -1) {
            return (function() {
                fn.apply(context || this, arguments);
            });
        }
        var bufferTimer = null;

        function f() {
            f.stop();
            bufferTimer = later(fn, ms, FALSE, context || this, arguments);
        }

        f.stop = function() {
            if (bufferTimer) {
                bufferTimer.cancel();
                bufferTimer = 0;
            }
        };

        return f;
    };

});
