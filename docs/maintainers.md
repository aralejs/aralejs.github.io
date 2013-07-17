# 维护人

--------------



维护人信息需要增加到组件的 package.json 中，内容为「公司花名」 + 「公司邮箱」

```
"maintainers":[{
   "name": "贯高",
   "email": "guangao@alipay.com"
},{
   "name": "玉伯",
   "email": "yubo@alipay.com"
}]
```

或

```
"maintainers":[
   "贯高 <guangao@alipay.com>",
   "玉伯 <yubo@alipay.com>"
]
```

字段为一个数组，第一个为第一维护人，后面的为其他维护人


## Arale

<div id="container-arale"></div>

## Alipay

<style>
#doc-wrapper, table {width: 100%}

table .people {
    width: 120px;
}
</style>

<div id="container-alipay"></div>

<script type="text/javascript" src="https://a.alipayobjects.com/alipay/apww/1.2.0/apww.js"></script>
<script type="text/javascript">
seajs.config({
  alias: {
    arale: 'http://spmjs.org/repository/arale/?define',
    alipay: 'http://yuan.alipay.im/repository/alipay/?define',
    apww: 'alipay/apww/1.2.0/apww'
  }
});
seajs.use(['$', 'apww'], function($, apww) {
  seajs.use('arale', function(arale) {
    createTable(arale, '#container-arale', "http://aralejs.org/");
    apww.init({
      trigger:'.J-apww',
      host: 'http://amos.im.alisoft.com',
      classPrefix: 'ui-ww-static'
    });
  });

  seajs.use('alipay', function(alipay) {
    createTable(alipay, '#container-alipay', "http://arale.alipay.im/alipay/");
    apww.init({
      trigger:'.J-apww',
      host: 'http://amos.im.alisoft.com',
      classPrefix: 'ui-ww-small'
    });
  });

  function createTable(data, container, dest) {
    var table = $('<table><tr><th class="name" >组件名</th><th class="people">第一维护人</th><th class="people">其他维护人</th></tr></table>')
    for (var i in data) {
      var item = data[i];
      var name = item.name;
      var maintainers = item.maintainers;
      var first = maintainers && maintainers.length ? showMaintainer(maintainers[0]) : '';
      var other = maintainers && maintainers.length > 1 ? showMaintainer(maintainers.slice(1)) : ''
      $('<tr><td><a href="' + dest + name + '/">' + name + '</a></td><td>' + first + '</td><td>' + other + '</td></tr>').appendTo(table);
    }
    table.appendTo(container);
  }
  var re = /^\s*(.*?)\s+<(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)>\s*$/;
  function showMaintainer(maintainers) {
    if (Object.prototype.toString.call(maintainers) === '[object Array]') {
      var r = [];
      for(var i in maintainers) {
        r.push(showMaintainer(maintainers[i]));
      }
      return r.length ? r.join('<br>') : '';
    } else {
      var name, email;
      if (Object.prototype.toString.call(maintainers) === '[object Object]') {
        name = maintainers.name || '';
        email = maintainers.email || '';
      } else {
        var m = maintainers.match(re);
        if (m) {
          name = m[1];
          email = m[2];
        } else {
          name = email = '';
        }
      }
      return '<a href="mailto:' + email + '">' + name + '</a> ' +
        '<a class="J-apww" href="" data-account="' + name + '"></a>'
    }
  } 
});
</script>