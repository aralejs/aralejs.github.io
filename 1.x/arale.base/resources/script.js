//TODO
//1.先把传入内容节点放
(function(arale){
	var support = {};
	var script = document.createElement('script'),
		id = 'script' + arale.now(),
		rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		rnotwhite = /\S/;

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}
	if ( window[ id ] ) {
		support.scriptEval = true;
		delete window[ id ];
	}
	var merge = function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	};
	var nodeName = function(node, name) {
		return node && node.nodeName.toLowerCase() === name;
	};
	var makeArray = function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = arale.typeOf(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp") {
				[].push.call( ret, array );
			} else {
				merge( ret, array );
			}
		}
		return ret;
	};
	var buildFragment = function(elem, scripts) {
		var ret = [];
		var fragment = document.createDocumentFragment();
		if(typeof elem === 'string'){
			var div = document.createElement('div');
			div.innerHTML = elem;
			elem = div.childNodes;
		}
		if (elem.nodeType) {
			ret.push(elem);
		} else {
			ret = merge(ret, elem);	
		}
		for ( i = 0; ret[i]; i++ ) {
			if ( scripts && nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
				scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
			} else {
				if ( ret[i].nodeType === 1 ) {
					ret.splice.apply( ret, [i + 1, 0].concat(makeArray(ret[i].getElementsByTagName("script"))) );
				}
				fragment.appendChild( ret[i] );
			}
		}
		return fragment;
	};	
	// Evalulates a script in a global context
	arale.globalEval = function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if (support.scriptEval) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}
			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	};
	var globalEvalScript = function(scripts) {
		if(scripts && scripts.length) {
			var elem = scripts.shift();
			if(elem.type && elem.src) {
				arale.loader.loadScriptByUrl(elem.src, function() {
					globalEvalScript(scripts);
				});	
			} else {
				arale.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
				globalEvalScript(scripts);
			}
		}
	};
	arale.domManip = function(args, callback){
		var scripts = [];
		var fragment = buildFragment(args, scripts);
		callback.call(arale, fragment);
		globalEvalScript(scripts);
		/**
		for(var i=0, len = scripts.length; i <  len; i++) {
			var elem = scripts[i];
			arale.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
		}
		*/
	};	
}(arale));
