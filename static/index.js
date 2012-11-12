seajs.config({
    alias: {
        '$': 'jquery/1.7.2/jquery'
    }
});

seajs.use(['$', 'popup/0.9.7/popup'], function($, Popup) {

    $.get('http://aralejs.org/-update/package.json?callback=?', function(data) {
        for(var i=0; i<data.length; i++) {
            var item = $('<a class="module" href="#"></a>');
            item.html(data[i].name)
                .attr('href', '/' + data[i].name + '/')
                .data('description', data[i].description)
                .data('version', data[i].version);

            $('.modules-' + data[i]['tag']).append(item);
            cardPopup(item);        
        }
    }, 'jsonp');

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
            trigger: item
        });
        popup.on('after:show', function() {
            $('#card .card-name').html(item.html());
            $('#card .card-description').html(item.data('description') || '');
            $('#card .card-version').html(item.data('version') || '');
        });
    }
    
});
