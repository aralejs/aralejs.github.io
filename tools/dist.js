/* @author lifesinger@gmail.com */

// 简洁版构建脚本，等 spm 完善好后，此脚本可废弃
// Usage: $ node dist.js moduleName

var fs = require('fs');
var path = require('path');
var uglifyjs = require('uglify-js');
var jsp = uglifyjs.parser;
var pro = uglifyjs.uglify;

var module = process.argv[2];
var SRC_DIR = path.join('../lib', module, 'src');
var DIST_DIR = path.join('../dist', module);

var meta = JSON.parse(fs.readFileSync(path.join(SRC_DIR, '../package.json')));
DIST_DIR = path.join(DIST_DIR, meta.version);


// main
Object.keys(meta['dist']).forEach(function(filename) {
   build(filename);
});

console.log('Successfully built to: ' + DIST_DIR);


function build(filename) {
    var code = fs.readFileSync(path.join(SRC_DIR, filename));

    var id = '#' + module + '/' + meta.version + '/' + module;
    var deps = parseDependencies(code);

    code = code.replace('define(function',
            'define("' + id + '", ["' + deps.join('","') + '"],function');

    var minfile = path.join(DIST_DIR, filename);
    var debugfile = minfile.replace('.js', '-debug.js');

    mkdirS(DIST_DIR);
    fs.writeFileSync(debugfile, code);
    fs.writeFileSync(minfile, compress(code));
}


function parseDependencies(code) {
    var pattern = /(?:^|[^.])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g;
    var ret = [], match;

    code = removeComments(code);
    while ((match = pattern.exec(code))) {
        if (match[2]) {
            ret.push(match[2]);
        }
    }

    return unique(ret);
}


function removeComments(code) {
    return code
            .replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n')
            .replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
}


function unique(arr) {
    var o = {};
    arr.forEach(function(item) {
        o[item] = 1;
    });

    return Object.keys(o);
}


function mkdirS(dir) {
    dir = dir.replace(/\\/g, '/');

    var p = dir.replace(/\/$/, '');
    var parts = [];

    while (!/\/$/.test(p) && !path.existsSync(p)) {
        parts.unshift(path.basename(p));
        p = path.dirname(p);
    }

    while (parts.length) {
        p = path.join(p, parts.shift());
        fs.mkdirSync(p, '0777');
    }
}


function compress(code) {
    var ast = jsp.parse(code);

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);

    return pro.gen_code(ast) + ';';
}
