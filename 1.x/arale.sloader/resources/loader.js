//TODO 如何处理Loader.use标准模块和非标准模块. 目前如果对于核心模块
(function(arale) {
    var Loader = window.Loader;
    var moduleIdReg = /\.(?:js|css)$/;
    var isModuleId = function(id) {
        if (mo)
    };
    window.Loader = {
        use: function(ids, callback) {
            var args = [].slice.call(0),
                callback = args.splice(args.length-1)[0];
            if (arale.isString(callback)) {
                args.push(callback);
                callback = function() {};
            }
            var isAllModule = true;
            //如果不是不是标准的moduleId, 
            for (var i = 0, len = args.length; i < len && isAllModule; i++) {
            
            }
            while(isAllModule && )
            ()
        },
        css: function() {
             
        },
        useCss: function() {
                
        },
        loadScriptByUrl: function() {
                         
        }
    };
}(arale));

return {
        use: blockLoader,
        waituse: function() {
            throw new Error('Deprecated method.');
            return;
            var params = [].slice.call(arguments, 0);
            $E.domReady(function() {
                blockLoader.apply(null, params);
            });
        },
        css: function(cssPath) {
            if (cssPath) {
                cssReadyLoader.push(cssPath);
                loadCss();
            }
		},
		useCss: function() {
            var files = [].slice.call(arguments,0);
            if (araleConfig.__tmp) {
                for (var i = 0, l = files.length; i < l; i++) {
                    var fileName = files[i];
                    if (fileName.indexOf('alice') > -1 || fileName.indexOf('arale') > -1 || fileName.indexOf('alipay') > -1) {
                        files[i] = "static/al/" + fileName;
                    } else {
                        files[i] = fileName.slice(0, fileName.indexOf('.')) + '/' + fileName;
                    }
                }
            }
			loadCssDomElement(cssContext + files.join(','));
		},
		loadScriptByUrl: function(url, callback) {
			loadScriptDomElement(url, callback);	
		}
    };

