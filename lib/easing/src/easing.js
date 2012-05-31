define(function(require, exports, module) {

    var toString = Object.prototype.toString;
    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }
    
    var easing = module.exports = {
        //Uniform speed between points.
        'easeNone': function(t) {
            return t;
        },
        /**
         * Begins slowly and accelerates towards end. (quadratic)
         */
        'easeIn': function(t) {
            return t * t;
        },

        /**
         * Begins quickly and decelerates towards end.  (quadratic)
         */
        'easeOut': function(t) {
            return (2 - t) * t;
        },

        /**
         * Begins slowly and decelerates towards end. (quadratic)
         */
        'easeBoth': function(t) {
            return (t *= 2) < 1 ?
                .5 * t * t :
                .5 * (1 - (--t) * (t - 2));
        },

        /**
         * Begins slowly and accelerates towards end. (quartic)
         */
        'easeInStrong': function(t) {
            return t * t * t * t;
        },
        /**
         * Begins quickly and decelerates towards end.  (quartic)
         */
        'easeOutStrong': function(t) {
            return 1 - (--t) * t * t * t;
        },
        /**
         * Begins slowly and decelerates towards end. (quartic)
         */
        'easeBothStrong': function(t) {
            return (t *= 2) < 1 ?
                .5 * t * t * t * t :
                .5 * (2 - (t -= 2) * t * t * t);
        },

        /**
         * Snap in elastic effect.
         */

        'elasticIn': function(t) {
            var p = .3, s = p / 4;
            if (t === 0 || t === 1) return t;
            return -(pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
        },

        /**
         * Snap out elastic effect.
         */
        'elasticOut': function(t) {
            var p = .3, s = p / 4;
            if (t === 0 || t === 1) return t;
            return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
        },

        /**
         * Snap both elastic effect.
         */
        'elasticBoth': function(t) {
            var p = .45, s = p / 4;
            if (t === 0 || (t *= 2) === 2) return t;

            if (t < 1) {
                return -.5 * (pow(2, 10 * (t -= 1)) *
                    sin((t - s) * (2 * PI) / p));
            }
            return pow(2, -10 * (t -= 1)) *
                sin((t - s) * (2 * PI) / p) * .5 + 1;
        },

        /**
         * Backtracks slightly, then reverses direction and moves to end.
         */
        'backIn': function(t) {
            if (t === 1) t -= .001;
            return t * t * ((BACK_CONST + 1) * t - BACK_CONST);
        },

        /**
         * Overshoots end, then reverses and comes back to end.
         */
        'backOut': function(t) {
            return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1;
        },

        /**
         * Backtracks slightly, then reverses direction, overshoots end,
         * then reverses and comes back to end.
         */
        'backBoth': function(t) {
            var temp = ((BACK_CONST *= (1.525)) + 1) * t;
            if ((t *= 2) < 1) {
                return .5 * (t * t * (temp - BACK_CONST));
            }
            return .5 * ((t -= 2) * t * (temp + BACK_CONST) + 2);
        },

        /**
         * Bounce off of start.
         */
        'bounceIn': function(t) {
            return 1 - Easing.bounceOut(1 - t);
        },

        /**
         * Bounces off end.
         */
        'bounceOut': function(t) {
            var s = 7.5625, r;

            if (t < (1 / 2.75)) {
                r = s * t * t;
            }
            else if (t < (2 / 2.75)) {
                r = s * (t -= (1.5 / 2.75)) * t + .75;
            }
            else if (t < (2.5 / 2.75)) {
                r = s * (t -= (2.25 / 2.75)) * t + .9375;
            }
            else {
                r = s * (t -= (2.625 / 2.75)) * t + .984375;
            }

            return r;
        },

        /**
         * Bounces off start and end.
         */
        'bounceBoth': function(t) {
            if (t < .5) {
                return Easing.bounceIn(t * 2) * .5;
            }
            return Easing.bounceOut(t * 2 - 1) * .5 + .5;
        },
        get: function(easingName) {
            if (isFunction(easingName)) return easingName;
            return easing[easingName] || 'linear';
        },
        defaults: function(target) {
            if (!target) return;
            for (var prop in easing) {
                if (easing.hasOwnProperty(prop)) {
                    if (target[prop] == null) target[prop] = easing[prop];
                }
            }
            return easing;
        } 
    };
    
});
