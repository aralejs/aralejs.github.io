# Online Status

- order: 9

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
table .version{width: 180px;}
#card{width:auto;}
.face {
    font-weight: bold;
    margin-right: 6px;
    color: #FF7207;
}
</style>

<script>
seajs.config({
    alias: {
        'status-arale': 'http://aralejs.org/status-arale.js',
        'status-arale-dev': 'http://aralejs.alipay.im/status-arale.js',
        'status-gallery': 'http://aralejs.org/status-gallery.js',
        'status-gallery-dev': 'http://aralejs.alipay.im/status-gallery.js',
        'status-alipay': 'http://aralejs.alipay.im/status-alipay.js'
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
            globalData['arale'] = data;
            createTable(data, 'arale');
            $('.J-alipayStatus').show();
        });

        seajs.use(['status-gallery-dev'], function(data) {
            globalData['gallery'] = data;
            createTable(data, 'gallery');
            $('.J-alipayStatus').show();
        });
    }, function() {
        seajs.use(['status-arale'], function(data) {
            globalData['arale'] = data;
            createTable(data, 'arale');
        });

        seajs.use(['status-gallery'], function(data) {
            globalData['gallery'] = data;
            createTable(data, 'gallery');
        });
    });
    
    seajs.use(['status-alipay'], function(data) {
        if(!data) return;
        globalData['alipay'] = data;
        createTable(data, 'alipay');
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
        //$.ajax({
        //    url: 'http://aralejs.alipay.im/status-alipay.js',
        //    dataType: 'script',
        //    timeout: 500,
        //    success: function() {
        //        success();
        //    },
        //    error: function() {
        //        failure();
        //    }
        //});
    }
    
    function createTable(data, root) {
        var table = $('<table><tr><th class="name">组件名</th><th class="version">版本</th><th class="status J-alipayStatus">开发环境</th><th class="status J-alipayStatus">测试环境</th><th class="status">线上</th></tr></table>').appendTo('#status-' + root);
    
        $.each(data, function(key, value){
            var name = key;
    
            // 生成所有版本
            var s = ['<select>'];
            $.each(value, function(key, value){
                var files = [], version = key;
                $.each(value, function(key, value){
                    files.push([root, name, version, key].join('/'));
                });
                s.push('<option value="' + version + '" data-files="' + files.join(';') + '">' + version + '</option>');
            });
            s.push('</select>');
    
            var tr = $('<tr data-name="' +  key + '" data-root="' + root + '" id="' + root + '-' + key + '">' +
                '<td class="name"><span class="face">☺</span> ' + key + '</td>' +
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
                        var part = o.match(/^([^/]*)\/([^/]*)\/([^/]*)\/(.*)$/);
                        var link = prefix[s] + '/' + o;
                        var status = globalData[part[1]][part[2]][part[3]][part[4]][s];
                        return '<div>' + (status == 200 ? assert(1) : assert(0)) +
                            '<a href="' + link + '" target="_blank" style="margin-left:5px;">' + link + '</a></div>';
                    });
                    $('#card').html(files.join(''));
                });
            });
        });

        $('#status-' + root).on('change', 'select', function() {
            testStatus(this);
        });
        
        // 为了让 aralejs.org/docs/online-status.html#arale.dialog
        // 这样的链接锚点能够正确的指向
        if (location.hash !== '') {
            location.href = location.href;
            $(location.hash)[0] && $(location.hash).css({
                'background-color': '#CDEDAC',
                'font-weight': 'bold'
            });
        }
    }

    // 检测某个组件的版本在各环境是否存在
    function testStatus(o){
        var f = [], count = 0,
            dev = test = online = 1,
            deverror = testerror = onlineerror = 0;
            tr =  $(o).parents('tr');
            root = tr.data('root'),
            name = tr.data('name'),
            version = o.value,
            files = globalData[root][name][version];

            for(file in files) {
                f.push(file);
                if (files[file]['dev'] !== 200) {
                    dev = 2;
                    deverror++;
                }
                if (files[file]['test'] !== 200) {
                    test = 2;
                    testerror++;
                }
                if (files[file]['online'] !== 200) {
                    online = 2;
                    onlineerror++;
                }
                count++;
            }
            if (deverror === count) {
                dev = 0;
            }
            if (testerror === count) {
                test = 0;
            }
            if (onlineerror === count) {
                online = 0;
            }

            tr.find('.dev').html(assert(dev));
            tr.find('.test').html(assert(test));
            tr.find('.online').html(assert(online));
    }

    // 1:true 0:false 2:half
    function assert(value) {
        if (value === 1) {
            return '<span class="assert" style="color:#1A9B20">✔</span>';
        } else if(value === 0) {
            return '<span class="assert" style="color:#FF4C4C">✗</span>'
        } else if(value === 2) {
            return '<span class="assert" style="color: #FFB800;">✙</span>'
        }
    }
});

</script>
