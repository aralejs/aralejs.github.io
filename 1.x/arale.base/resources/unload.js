arale.bindunload = (function() {
	var bind, eCenter = [];
	function helper() {
		for(var i = 0, len = eCenter.length; i < len; i++) {
			eCenter[i].call(null);
		}	
	}
	if (window.addEventListener) {
		window.addEventListener('unload', helper, false);
	} else if (window.attachEvent) {
		window.attachEvent('onunload', helper);	
	} else {
		window.onunload = helper;
	}	
	return function(callback) {
		eCenter.push(callback);
	};
}());


