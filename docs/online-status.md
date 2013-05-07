# 模块线上状态

- order: 5
- category: arale

--------------

<style>
.J-alipayStatus{display:none}
</style>

本页面提供了现有组件的发布状态，可以查看某组件的所有版本，以及其具体版本是否已上线。

- <span class="assert" style="color:#1A9B20">✔</span> 所有文件均存在。
- <span class="assert" style="color:#FF4C4C">✗</span> 所有文件均不存在。 
- <span class="assert" style="color: #FFB800;">✙</span> 部分文件存在，可能存在漏发或多余的文件。


请尽量使用最新版，如测试环境不存在该文件，可联系我们，或使用次新版。


## Arale

<div id="status-arale"></div>


## Gallery

<div id="status-gallery"></div>



## Alipay

<div id="status-alipay" class="J-alipayStatus"></div>

<div id="card"></div>

<style>
#doc-wrapper, table {width: 100%}
table td, table th {text-align:left;padding: 5px 0;}
table .status {width: 80px; cursor: pointer; padding: 0px 10px;}
table .status:hover {background-color: #fff;}
table .status span{cursor:pointer;}
table .version{width: 100px;}
#content table .name a {color: #6381A6;}
#card{width:auto;}
.face {
    font-weight: bold;
    margin-right: 6px;
    color: #FF7207;
}
</style>

`````js
seajs.config({
    alias: {
        'status-arale': '/status-arale.js',
        'status-arale-dev': 'http://arale.alipay.im/status-arale.js',
        'status-gallery': '/status-gallery.js',
        'status-gallery-dev': 'http://arale.alipay.im/status-gallery.js',
        'status-alipay': 'http://arale.alipay.im/status-alipay.js'
    }
});

seajs.use(['$', 'popup'], function($, Popup){
    var globalData = {},
        prefix = {
            online: 'https://a.alipayobjects.com',
            test: 'https://a.test.alipay.net',
            dev: 'http://assets.dev.alipay.net'
        };

    test(function() {
        seajs.use(['status-arale-dev'], function(data) {
            globalData['arale'] = data.arale;
            createTable(data.arale, 'arale');
            $('.J-alipayStatus').show();
        });

        seajs.use(['status-gallery-dev'], function(data) {
            globalData['gallery'] = data.gallery;
            createTable(data.gallery, 'gallery');
            $('.J-alipayStatus').show();
        });
    }, function() {
        seajs.use(['status-arale'], function(data) {
            globalData['arale'] = data.arale;
            createTable(data.arale, 'arale');
        });

        seajs.use(['status-gallery'], function(data) {
            globalData['gallery'] = data.gallery;
            createTable(data.gallery, 'gallery');
        });
    });
    
    seajs.use(['status-alipay'], function(data) {
        if(!data) return;
        globalData['alipay'] = data.alipay;
        createTable(data.alipay || {}, 'alipay');
        $('.J-alipayStatus').show();
    });

    function test(success, failure) {
        var isCalled = false;
        seajs.use(['status-alipay'], function(data) {
            if (!isCalled) {
                if (data) {
                    success();
                    isCalled = true;
                } else {
                    failure();
                    isCalled = true;
                }
            }
        });
        setTimeout(function() {
            if (!isCalled) {
                failure();
                isCalled = true;
            }
        }, 500);
    }
    
    function createTable(data, family) {
        var table = $('<table><tr><th class="name">组件名</th><th class="version">版本</th><th class="status J-alipayStatus">开发环境</th><th class="status J-alipayStatus">测试环境</th><th class="status">线上</th></tr></table>').appendTo('#status-' + family);

        $.each(data, function(key, value){
            var name = key;
    
            // 生成所有版本
            var s = ['<select>'];
            $.each(value, function(key, value){
                var version = key;
                var files = $.map(value, function(value, key){
                    return [value.path, value.code, value.name].join('|');
                }).join(';');
                s.push('<option value="' + version + '" data-files="' + files + '">' + version + '</option>');
            });
            s.push('</select>');
            
            var keylink = '';
            if (family === 'arale') {
                keylink = '<a href="/' + key + '/">' + key + '</a>';
            } else if (family === 'alipay') {
                keylink = '<a href="http://arale.alipay.im/' + family + '/' + key + '/">' + key + '</a>';
            } else {
                keylink = key;
            }
    
            var tr = $('<tr data-name="' +  key + '" data-family="' + family + '" id="' + family + '-' + key + '">' +
                '<td class="name"><span class="face">☺</span> ' + keylink + '</td>' +
                '<td class="version">' + s.join('') + '</td>' +
                '<td class="dev status J-alipayStatus" data-status="dev"></td>' +
                '<td class="test status J-alipayStatus" data-status="test"></td>' +
                '<td class="online status" data-status="online"></td>' +
                '</tr>');
            table.append(tr);

            testStatus(tr.find('select')[0]);

            tr.find('.status').each(function() {
                var item = this;
                new Popup({
                    trigger: item,
                    element: '#card',
                    align: {
                        baseXY: [0, '50%'],
                        selfXY: ['100%+5', '50%']
                    }
                }).before('show', function(){
                    var selected = $(item).parents('tr').find('select :selected'),
                        files = selected.data('files');

                    files = $.map(files.split(';'), function(o){
                        var s = $(item).data('status');
                        var part = o.split('|');
                        if (part[2] !== s) return '';

                        var link = prefix[s] + '/' + part[0];
                        var status = part[1];
                        return '<div>' + 
                            ((status === '200') ? 
                                '<span class="assert" style="color:#1A9B20">✔</span>' :
                                '<span class="assert" style="color:#FF4C4C">✗</span>') +
                            '<a href="' + link + '" target="_blank" style="margin-left:5px;">' + link + '</a>' +
                            '</div>';
                    });
                    $('#card').html(files.join(''));
                });
            });
        });

        $('#status-' + family).on('change', 'select', function() {
            testStatus(this);
        });
        
        // 为了让 aralejs.org/docs/online-status.html#arale.dialog
        // 这样的链接锚点能够正确的指向
        if (location.hash !== '' && $(location.hash)[0]
            && $(location.hash).attr('highlight') !== 'true') {
            location.href = location.href;
            $(location.hash).css({
                'background-color': '#CDEDAC',
                'font-weight': 'bold'
            });
            $(location.hash).attr('highlight', 'true');
        }
    }

    // 检测某个组件的版本在各环境是否存在
    function testStatus(o){
        var tr =  $(o).parents('tr');
            family = tr.data('family'),
            name = tr.data('name'),
            version = o.value,
            files = globalData[family][name][version];

        tr.find('.dev').html(assert(files, 'dev'));
        tr.find('.test').html(assert(files, 'test'));
        tr.find('.online').html(assert(files, 'online'));
    }

    // 1:true 0:false 2:half
    function assert(files, type) {
        var afterFilter = $.grep(files, function(o, i) {
            return o.name === type;
        });
        var count = 0, returned = '<span class="assert" style="color:#1A9B20">✔</span>';
        $.each(afterFilter, function(i, o) {
            if (o.code !== 200) {
                returned = '<span class="assert" style="color: #FFB800;">✙</span>';
                count++;
            }
        });
        if (count === afterFilter.length) {
            returned = '<span class="assert" style="color:#FF4C4C">✗</span>';
        }
        return returned;
    }
});
`````
