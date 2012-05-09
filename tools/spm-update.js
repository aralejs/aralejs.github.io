//
// 从 seajs/modules 库中更新指定模块
//
// Usage:
//
//   $ cd arale
//   $ node tools/spm-update.js
//

var path = require('path');
var Install = require('spm').Install;

update(process.argv[2], process.argv[3]);


function update(name, force) {
    new Install([name], {
        force: force === '-f' || force === '--force',
        to: path.join(__dirname, '../dist')
    }).run();
}
