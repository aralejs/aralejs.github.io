/* @author kangpangpang@gmail.com */
define(function(require, exports) {
    
    function Observable() {
        this._events = {};
    }
    Observable.prototype = {
        on: function(type, listener) {

        },
        off: function(type, listener) {
             
        },
        trigger: function(type) {
                 
        }
    };
    Observable.constructor = Observable;
    exports.Observable = Observable;
});


