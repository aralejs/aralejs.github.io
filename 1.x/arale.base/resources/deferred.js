(function() {
    var mutator = function() {};
    var freeze = Object.freeze || function() {};
    arale.Deferred = function(canceller) {
        var result, finished, isError, head, nextListener;
        var promise = this.promise = {};
        function complete(value) {
            if (finished) {
                throw new Error('This deferred has already been resolved');
            }
            result = value;
            finished = true;
            notify();
        }
        function notify() {
            var mutated;
            while (!mutated && nextListener) {
                var listener = nextListener;
                nextListener = nextListener.next;
                if (mutated = (listener.progress == mutator)) {
                    finished = false;
                }
                var func = (isError ? listener.error : listener.resolved);
                if (func) {
                    try {
                        var newResult = func(result);
                        if (newResult && typeof newResult.then === 'function') {
                            newResult.then(arale.hitch(listener.deferred, 'reslove'), arale.hitch(listener.deferred, 'reject'));
                            continue;
                        }
                        var unchanged = mutated && newResult === undefined;
                        listener.deferred[unchanged && isError ? 'reject' : 'resolve'](unchanged ? result : newResult);
                    }
                    catch (e) {
                        listener.deferred.reject(e);
                    }
                }else {
                    if (isError) {
                        listener.deferred.reject(result);
                    }else {
                        listener.deferred.resolve(result);
                    }
                }
            }
        }
        this.resolve = this.callback = function(value) {
            this.fired = 0;
            this.results = [value, null];
            complete(value);
        };
        this.reject = this.errback = function(error) {
            isError = true;
            this.fired = 1;
            complete(error);
            this.results = [null, error];
            if (!error || error.log != false) {
               (function(error) {
                   console.log(error);
               })(error);
            }
        };
        this.progress = function(update) {
            var listener = nextListener;
            while (listener) {
                var progress = listener.progress;
                progress && progress(update);
                listener = listener.next;
            }
        };
        this.addCallbacks = function(callback, errback) {
            this.then(callback, errback, mutator);
            return this;
        };
        this.then = promise.then = function(resolvedCallback, errorCallback, progressCallback) {
            var returnDeferred = progressCallback == mutator ? this : new arale.Deferred(promise.cancel);
            var listener = {
                resolved: resolvedCallback,
                error: errorCallback,
                progress: progressCallback,
                deferred: returnDeferred
            };
            if (nextListener) {
                head = head.next = listener;
            } else {
                nextListener = head = listener;
            }
            if (finished) {
                notify();
            }
            return returnDeferred.promise;
        };
        var deferred = this;
        this.cancel = promise.cancel = function() {
            if (!finished) {
                var error = canceller && canceller(deferred);
                if (!(error instanceof Error)) {
                    error = new Error(error);
                }
                error.log = false;
                deferred.reject(error);
            }
        };
        freeze(promise);
    };
    arale.augment(arale.Deferred, {
        addCallback: function(/*Function*/callback) {
            return this.addCallbacks(arale.hitch.apply(arale, arguments));
        },
        addErrback: function(/*Function*/errback) {
            return this.addCallbacks(null, arale.hitch.apply(arale, arguments));
        },
        addBoth: function(/*Function*/callback) {
            var enclosed = arale.hitch.apply(arale, arguments);
            return this.addCallbacks(enclosed, enclosed);
        },
        fired: -1
    });
}());
arale.when = function(promiseOrValue, callback, errback, progressHandler) {
    if (promiseOrValue && typeof promiseOrValue.then === 'function') {
        return promiseOrValue.then(callback, errback, progressHandler);
    }
    return callback(promiseOrValue);
};
