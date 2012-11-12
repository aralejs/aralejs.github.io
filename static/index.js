seajs.config({
    alias: {
        '$': 'jquery/1.7.2/jquery'
    }
});

seajs.use(['$', 'popup/0.9.8/popup'], function($, Popup) {

    seajs.use('http://aralejs.org/package.js', function(data) {
        for(var i=0; i<data.length; i++) {
            var item = $('<a class="module" href="#"></a>');
            item.html(data[i].name)
                .attr('href', '/' + data[i].name + '/')
                .data('description', data[i].description)
                .data('version', data[i].version);
            $('.modules-' + data[i]['tag']).append(item).prev().show();
            cardPopup(item);
        }
    });

    // alipay 组件
    seajs.use('http://aralejs.alipay.im/package.js', function(data) {
        if (!data) {
            return;
        }
        for(var i=0; i<data.length; i++) {
            var item = $('<a class="module" href="#"></a>');
            item.html(data[i].name)
                .attr('href', '/' + data[i].name + '/')
                .data('description', data[i].description || '暂无描述')
                .data('version', data[i].version);

            $('.modules-alipay').append(item);
            $('.modules-alipay').prev().show();
            cardPopup(item);
        }
    });

    $('#search').on('keyup', function(e) {
        if (e.keyCode === 13 && $('.module:visible').attr('href')) {
            location.href = $('.module:visible').attr('href');
        }
        var that = this;
        $('.module').each(function(i, item) {
            item = $(item);
            if (item.html().indexOf(that.value) !== -1) {
                item.show();
            } else {
                item.hide();
            }
        });
    });
    
    function cardPopup(item) {
        // 卡片
        var popup = new Popup({
            element: '#card',
            trigger: item,
            align: {
                baseXY: [0, -2],
                selfXY: [0, '100%']
            }
        });
        popup.on('before:show', function() {
            $('#card .card-name').html(item.html());
            $('#card .card-description').html(item.data('description') || '');
            $('#card .card-version').html(item.data('version') || '');
        });
    }
    
});
