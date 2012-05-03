/* @author lifesinger@gmail.com */

// 简洁版构建脚本，等 spm 完善好后，此脚本可废弃

var fs = require('fs');
var path = require('path');

var module = process.argv[2];
var SRC_DIR = path.join('../lib', module, 'src');
var DIST_DIR = path.join('../dist', module);

var meta = JSON.parse(fs.readFileSync(path.join(SRC_DIR, '../package.json')));
DIST_DIR = path.join(DIST_DIR, meta.version);

Object.keys(meta['dist']).forEach(function(filename) {
   build(filename);
});


function build(filename) {

}
