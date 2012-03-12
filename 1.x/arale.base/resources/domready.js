
/**
 * domReady
 * @param {Function} fn 回掉函数.
 * @example
 * arale.domReady(function() {
 *     alert('dom loaded');
 * });
 */
arale.domReady = function(fn) {
	var domReady = arale.domReady;
	if (domReady.loaded) {
		fn();
		return;
	}
	var observers = domReady.observers || (domReady.observers = []);
	observers[observers.length] = fn;
	if (domReady.callback) {
		return;
	}
	domReady.callback = function() {
		if (domReady.loaded) {
			return;
		}
		domReady.loaded = true;
		if (domReady.timer) {
			clearInterval(domReady.timer);
			domReady.timer = null;
		}
		for (var i = 0, length = observers.length; i < length; i++) {
			var fn = observers[i];
			observers[i] = null;
			fn();
		}
		domReady.callback = domReady.observers = null;
	};
	if (document.readyState && (arale.browser.Engine.gecko || arale.browser.Engine.webkit)) {
		domReady.timer = setInterval(function() {
			var state = document.readyState;
			if (state == 'loaded' || state == 'complete') {
				domReady.callback();
			}
		}, 50);
	}else if (document.readyState && arale.browser.Engine.trident) {
		var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
		document.write('<script type="text/javascript" defer="defer" src="' + src + '" ' +
		'onreadystatechange="if (this.readyState == \'complete\') arale.domReady.callback();"' +
		'><\/script>');
	}else {
		if (window.addEventListener) {
			document.addEventListener('DOMContentLoaded', domReady.callback, false);
			window.addEventListener('load', domReady.callback, false);
		} else if (window.attachEvent) {
			if(document.readyState == 'complete') {
				domReady.callback();
				return;
			}
			window.attachEvent('onload', domReady.callback);
		} else {
			var fn = window.onload;
			window.onload = function() {
				domReady.callback();
				if (fn) fn();
			};
		}
	}
};
