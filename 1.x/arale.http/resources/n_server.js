var http = require('http'),
	util = require('util'),
	url = require('url'),
	querystring = require('querystring'),
	fs = require('fs');


var n_server_js = process.ARGV[1];
var fileDir = process.ARGV[1].substring(0, n_server_js.lastIndexOf('/'));

var Type = function(path) {
	this.contentType = 'text/html';
	this.data = [];
	this.path = path;
};
Type.prototype = {
	outputHeader: function(res) {
		res.writeHeader(200, {'Content-Type': this.contentType, 'charset': 'UTF-8'});
	},
	outputHtmlHead: function(res) {
		res.write('<html><title>title</title><head></head><body>');	
	},
	outputHtmlBody: function(res) {
		res.write('' + this.getData());
	},
	outputHtmlEnd: function(res) {
		res.end('</body></html>');
	},
	output: function(res) {
		this.outputHeader(res);
		this.outputHeader(res);
		this.outputHtmlHead(res);
		this.outputHtmlBody(res);
		this.outputHtmlEnd(res);
	},
	getData: function() {
		throw new Error('This Is A Abstract Class');	
	}
};
var getType = function(path) {
	var index = path.lastIndexOf('.');
	if (index < 0) {
		return "dir";
	}	
	return path.substring(index + 1, path.length);
};
Type.typeMapping = {};
Type.getTypeObj = function(path) {
	console.log(getType(path))
	var clazz = Type.typeMapping[getType(path)];
	if (!clazz) {
		return new OtherType(path);
	} 	
	return new clazz(path);
};
var DirType = function() {
	Type.call(this);
};
Type.typeMapping['dir'] = DirType;
util.inherits(DirType, Type);
DirType.prototype.getData = function() {
	var that = this;
	this.fileList = fs.readdirSync(fileDir).filter(function(name) {
		return name.indexOf('.') > 0 && name != 'n_server.js';
	});
	this.fileList.forEach(function(name) {
		that.data.push(that.getLink(name));
	});
	return this.data.join('<br/>');
};
DirType.prototype.getLink = function(title) {
	return '<a href="/' + title + '">' + title + '</a>';
};

var JsType = function() {
	Type.apply(this, arguments);
	this.contentType = 'text/javascript';
};
Type.typeMapping['js'] = JsType;
Type.typeMapping['json'] = JsType;
util.inherits(JsType, Type);
JsType.prototype.output = function(res) {
	var data = fs.readFileSync(fileDir + this.path);
	this.outputHeader(res);
	res.end(data);
};
var HtmlType = function() {
	Type.apply(this, arguments);
	this.contentType = 'text/html';
};
util.inherits(HtmlType, JsType);
Type.typeMapping['html'] = HtmlType;

var OtherType = function() {

};
OtherType.prototype.output = function() {
	
};
http.createServer( function(req, res) {
	var urlObj = url.parse(req.url),
   		queryObj,
		isDelay = false;
	//res.writeHeader(200, {'Content-Type': 'text/plain'});
	//res.end('Hello World\n');
	if (urlObj.query) {
		queryObj = querystring.parse(urlObj.query);
		if (queryObj.timeout) {
			var timeout = parseInt(queryObj.timeout) || 1;
			isDelay = true;
			setTimeout( function() {
				Type.getTypeObj(urlObj.pathname).output(res);
			}, timeout);	
		}	
	}
	if (!isDelay) {
		Type.getTypeObj(urlObj.pathname).output(res);
	}
}).listen(2000, '127.0.0.1');

