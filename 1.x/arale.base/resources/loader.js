arale.module('arale.loader', function() {
    var Queue = function() {
        this._queue = [];
        this.running = false;
    };
    function empty(arr) {
        arr.length = 0;
    };
    function each(arr, callback, context) {
        for (var i = 0, len = arr.length; i < len; i++) {
            callback.call(context || null, arr[i]);
        }
    };
    Queue.prototype = {
        get: function() {
            return this._queue.shift();
        },
        size: function() {
            return this._queue.length;
        },
        add: function(params) {
            this._queue.push(params);
        },
        status: function(status) {
            if (typeof status !== 'undefined') {
                return (this.running = status);
            }
            return this.running;
        },
        run: function() {
            if (!this.running && this.size() > 0) {
                this.status(true);
                var params = this.get();
                params && this._apply.apply(this, params);
                empty(params);
            }
        },
        _apply: function(paths, modules, callbackList, deps) {
          //这个是局限于此类独特的一个方法,因为我们执行的逻辑都是一样的,只是不同的参数,所以我们把我们的的处理逻辑放到这里
            var that = this;
            loaderScript(getPaths(paths), function() {
                for (var i = 0, len = modules.length; i < len; i++) {
                    deps.getModule(modules[i]).moduleStatus(deps.LOAD.loaded);
                }
                each(callbackList, function(callback) {
                    callback();
                });
                that.status(false);
                that.run();
            });
        }
    };
    var loaderQueue = new Queue(), LOADER_LOADED = '/moduleloaded/', deps = arale.deps;
    var loadScriptDomElement = function(url, onload) {
        var domscript = document.createElement('script');
        domscript.charset = 'UTF-8';
        domscript.src = url;
        if (onload) {
			domscript.onloadDone = false;
			domscript.onload = function() {
				if (domscript.onloadDone) {
					return;
				}
				onload.call(domscript);
				domscript.onloadDone = true;
			}
			//domscript.onload = onload;
            domscript.onreadystatechange = function() {
                if (('loaded' === domscript.readyState || 'complete' === domscript.readyState) && !domscript.onloadDone) {
					//domscript.onloadDone = true;
					if(url.indexOf('cashier.module') > 0) {
						if(!window.Cashier || ((typeof Cashier.Module) == 'undefined')) {
							return;
						}
					}
                    domscript.onload();
                }
            };
        }
        document.getElementsByTagName('head')[0].appendChild(domscript);
    };
    var loadCssDomElement = function(href) {
        var cssFile = document.createElement('link');
        cssFile.setAttribute('rel', 'stylesheet');
        cssFile.setAttribute('type', 'text/css');
        cssFile.setAttribute('href', href);
        document.getElementsByTagName('head')[0].appendChild(cssFile);
    };
    var loaderScript = loadScriptDomElement;
    //init var
    var loading = null, cssLoading, readyLoader = [], cssReadyLoader = [], callbacks = [];
	var context = arale.getComboPath(), cssContext = arale.getCssComboPath(), WT = araleConfig.waitTime;
	//generator url
	var srcFileReg = /(?:.*).css|(.*)src\.js/;
	var noneSrcFileReg = /(.*)(.js)/;
	var getSrcFile = function(fileName) {
		if(!srcFileReg.test(fileName)) {
			var matcher =fileName.match(noneSrcFileReg);
			if(matcher.length > 2) {
				return matcher[1] + '-src' + matcher[2];
			}
		} else {
			return fileName;
		}
	};
    var getPaths = function(paths) {
		if (arale.depSrc) {
			for(var i = paths.length -1 ; i > -1; i--) {
				paths[i] = getSrcFile(paths[i]);
			} 
		}
        if (araleConfig.__tmp) {    //如果是拆分后的系统，则新规则生效
            for(var i = 0, l = paths.length; i < l; i++) {
                var fileName = paths[i];
                if (fileName.indexOf('arale') > -1 || fileName.indexOf('alipay') > -1) {
                    paths[i] = 'static/ar/' + fileName;
                } else {
                    paths[i] = fileName.slice(0, fileName.indexOf('.')) + '/' + fileName;
                }
            }
        }

        var path = context + paths.join(',');
        if (arale.debug) {
            path = path + '&date=' + new Date().getTime() + '&debug=1';
        }
        return path;
    };
    /**
    *开始加载
    **/
    var startLoader = function(watiTime) {
        if (loading) {
            clearTimeout(loading);
        }
        loading = setTimeout(function() {
            var paths = [], modules = [], moduleList = readyLoader, tempModule;
            //init status
			readyLoader = [];
            for (var i = 0, len = moduleList.length; i < len; i++) {
                tempModule = moduleList[i];
                if (!tempModule.isProxy()) {
                    paths.push(tempModule.getPath());
                }
            }
			if (paths.length === 0) {
                return;
            }
            callbacks.splice(0, 0, function() {
                var loaded = deps.LOAD.loaded;
                each(moduleList, function(module) {
                    module.moduleStatus(loaded);
                });
            });
            var callbackList = [].slice.call(callbacks, 0);
            empty(callbacks);
            loaderQueue.add([paths, modules, callbackList, deps]);
            loaderQueue.run();
        }, watiTime || WT);
    };
    var getModules = function(module, moduleList) {
        each(module.getDeps(), function(m) {
            var module = deps.getModule(m);
            getModules(module, moduleList);
            if (moduleList.indexOf(m) < 0) {
                moduleList.arr.push(m);
            }
        });
    };
    //默认是不阻塞队列的.如果阻塞的话,所有的请求都会被加到队列中,不会被执行.目前先支持第一个阻塞,后续中间在有阻塞的请求会有问题
    //考略多阻塞的话,会很麻烦,也没有必要
    var blockQueue = new Queue(), blocked = false;
    blockQueue.run = function() {
        //后续是否又有新的阻塞请求
        var params, isBlock;
        while (params = this.get()) {
            isBlock = blockLoader.apply(null, params);
            if (isBlock) {
                break;
            }
        }
    };
    var blockLoader = function(modules, callback, block) {
        var params = [].slice.call(arguments, 0);
        if (blocked) {
            blockQueue.add(params);
            return;
        }
        if (block) {
            params[1] = function() {
                callback.call();
                blocked = false;
                blockQueue.run();
            };
            params[2] = 1;
            blocked = block;
        }
        loader.apply(null, params);
        return block;
    };
    var loader = function(modules, callback, waitTime) {
        var Allsuccess = true;
        //保存我们即将加载的子module,需要在加载完成后设置状态
        var loadingModules = [];
        if (!callback) {
            callback = function() {};
        }
        if (arale.isString(modules)) {
            modules = [modules];
        }
        each(modules, function(module) {
            var subModule = deps.getModule(module), subSuccess;
            if (arale.isArray(subModule)) {
                //如果此module是第一次加载,他依赖的子module还没有被转换为整体module.我们需要循环去判断他
                //依赖的key对应的module是否加载过
                each(subModule, function(depName) {
                    var tempModule = deps.getModule(depName), status = tempModule.moduleStatus();
                    //判断一个module是否加载过,如果没有加载,设置为正在加载中,准备加载
                    switch (tempModule.moduleStatus()) {
                        case deps.LOAD.loaded:
                            return;
                        case deps.LOAD.unload:
                            //如果没有成功加载,添加到我们的队列中,在我们成功加载后,需要设置加载成功状态
                            readyLoader.push(tempModule);
                            tempModule.moduleStatus(deps.LOAD.loading);
                        case deps.LOAD.loading:
                             Allsuccess && (Allsuccess = false);
                        default:
                            return;
                    }
                });
				//创建一个替身,以后只需要判断这个代理就行了
				var proxyModule = deps.depsToModule(module);
				//set proxyModule status when subModule all loaded 
				if (Allsuccess) {
					proxyModule.moduleStatus(deps.LOAD.loaded);
				} else {
					proxyModule.moduleStatus(deps.LOAD.loading);
					readyLoader.push(proxyModule);
				}
            }else if (deps.isDep(subModule)) {
                if (subModule.moduleStatus() != deps.LOAD.loaded) {
                    Allsuccess = false;
                }
            }else {
				throw new Error('error module:' + (subModule || module || modules));
            }
        });
        if (Allsuccess) {
            //如果此模块已经加载,直接执行callback
            callback();
        } else {
            //如果此module正在加载,或者即将加载,把callback追加到callbacks队列中
            callbacks.push(callback);
            startLoader(waitTime);
        }
    };
    var loadCss = function() {
        if (cssLoading) {
            clearTimeout(cssLoading);
        }
        cssLoading = setTimeout(function() {
            if (cssReadyLoader.length > 0) {
                loadCssDomElement(getPaths(cssReadyLoader));
                cssReadyLoader = [];
            }
        }, 50);
    };
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
//    return loader;
}, '$Loader');
Loader = $Loader;
arale.deps.depsToModule('${project.build.finalName}.js').moduleStatus(arale.deps.LOAD.loaded);

