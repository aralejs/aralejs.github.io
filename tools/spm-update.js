//
// 从 seajs/modules 库中更新指定模块
//
// Usage:
//
//   $ cd arale
//   $ node tools/spm-update.js
//

var path = require('path');
update(process.argv[2]);


function update(name) {
    new Install([name], {
        to: path.join(__dirname, '../dist')
    }).run();
}
