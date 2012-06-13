# Batch Paste

支持批量粘贴的通用解决方案。

## 使用说明

```
define(function(){
    var BatchPaste = require("batchpaste");
    var CSV = require("csv");

    BatchPaste.paste(function(evt, text){
        var a = CSV.parse(text, "\t");
        a.each(function(e, i){
            alert(e.join());
        })
    });
});
```

## 批量粘贴相比文件上传的优势：

1. 客户端分布式处理，无需服务器提供文件存储，复杂的文件解析逻辑。
2. 与普通页面表单行为＆校验逻辑一致。
3. 及时的异常输入反馈。
4. 实时的处理能力(文件上传需要分时处理)。
5. 前端都无需太多的额外开发，后端无需任何开发。
