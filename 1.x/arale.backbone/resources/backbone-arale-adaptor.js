(function() {
    Backbone.View.prototype.addEvents = function(events) {
        var eventSplitter = /^(\S+)\s*(.*)$/;
        if (!(events || (events = this.events))) return;
        if (_.isFunction(events)) events = events.call(this);
        var handlers = this._getHandlers();
        handlers.length > 0 && $E.disConnect(handlers);
        for (var key in events) {
            var method = this[events[key]];
            if (!method) throw new Error('Event "' + events[key] + '" does not exist');
            var match = key.match(eventSplitter);
            var eventName = match[1], selector = match[2];
            //method = _.bind(method, this);
            method = arale.hitch(this, method);
            //eventName += '.delegateEvents' + this.cid;
            if (selector === '') {
                //$(this.el).bind(eventName, method);
                this._getHandlers().push($E.connect(this.el, eventName, method));
            } else {
                //$(this.el).delegate(selector, eventName, method);
                this._getHandlers().push($E.delegate(this.el, eventName, method, selector));
            }
        }
    };

    Backbone.View.prototype._getHandlers = function(events) {
        if(!this._handlers) {
            this._handlers = [];
        }
        return this._handlers;
    };

    //override default to leave make to create nothing, because default make uses jQuery.
    Backbone.View.prototype.make = function(tagName, attributes, content) {};

    var historyStarted = false;
    var isExplorer = /msie [\w.]+/;

    _.extend(Backbone.History.prototype, {
        // Start the hash change handling, returning `true` if the current URL matches
        // an existing route, and `false` otherwise.
        start : function(options) {

                    // Figure out the initial configuration. Do we need an iframe?
                    // Is pushState desired ... is it available?
                    if (historyStarted) throw new Error("Backbone.history has already been started");
                    this.options          = _.extend({}, {root: '/'}, this.options, options);
                    this._wantsPushState  = !!this.options.pushState;
                    this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
                    var fragment          = this.getFragment();
                    var docMode           = document.documentMode;
                    var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
                    if (oldIE) {
                        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
                        this.navigate(fragment);
                    }

                    // Depending on whether we're using pushState or hashes, and whether
                    // 'onhashchange' is supported, determine how we check the URL state.
                    if (this._hasPushState) {
                        //$(window).bind('popstate', this.checkUrl);  Shawn
                        $E.connect(window, 'popstate', this.checkUrl);
                    } else if ('onhashchange' in window && !oldIE) {
                        //$(window).bind('hashchange', this.checkUrl); Shawn
                        $E.connect(window, 'hashchange', this.checkUrl);
                    } else {
                        setInterval(this.checkUrl, this.interval);
                    }

                    // Determine if we need to change the base url, for a pushState link
                    // opened by a non-pushState browser.
                    this.fragment = fragment;
                    historyStarted = true;
                    var loc = window.location;
                    var atRoot  = loc.pathname == this.options.root;
                    if (this._wantsPushState && !this._hasPushState && !atRoot) {
                        this.fragment = this.getFragment(null, true);
                        window.location.replace(this.options.root + '#' + this.fragment);
                        // Return immediately as browser will do redirect to new url
                        return true;
                    } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
                        this.fragment = loc.hash.replace(hashStrip, '');
                        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
                    }

                    if (!this.options.silent) {
                        return this.loadUrl();
                    }
                }
    });
})();
