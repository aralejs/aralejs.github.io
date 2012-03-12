(function(window, arale) {
    var History = window.History = window.History||{};
    if ( typeof History.Adapter !== 'undefined' ) {
        throw new Error('History.js Adapter has already been loaded...');
    }

    History.Adapter = {
        bind: function(el, event, callback) {
            $E.connect(el, event, callback);
        },

        trigger: function(el, evt){
            $E.trigger(el, evt);
        },

        onDomLoad: function(callback) {
            $E.domReady(callback);
        }
    };

    if ( typeof History.init !== 'undefined' ) {
        History.init();
    }

})(window, arale);
