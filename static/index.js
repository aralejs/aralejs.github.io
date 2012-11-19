(function() {

    seajs.config({
        alias: {
            '$': 'jquery/1.7.2/jquery'
        }
    });

    seajs.use(['$',
               'popup/0.9.8/popup',
               'autocomplete/0.8.0/autocomplete',
               'http://aralejs.org/package.js',
               'http://aralejs.alipay.im/package.js'],
    function($, Popup, Autocomplete, araleModules, alipayModules) {

        insertAraleModules(araleModules);

        insertAlipayModules(alipayModules);

        //console.log(araleModules.concat(alipayModules));
        
        // 搜索组件自动完成
        var ac = new Autocomplete({
            trigger: '#search',
            dataSource: araleModules.concat(alipayModules),
            filter: function(data, query) {
                var result = [];
                $.each(data, function(index, value) {
                    var temp = value.root + '.' + value.name;
                    if (temp.indexOf(query) > -1) {
                        result.push({value: temp});
                    }
                });
                return result;
            }
        }).render();

        ac.on('itemSelect', function(value) {
            value = value.split('.');
            if (value[0] === 'arale') {
                location.href = '/' + value[1];
            } else if (value[0] === 'alipay') {
                location.href = 'http://aralejs.alipay.im/' + value[1];
            }
        });

        $('#search').on('keyup', function(e) {
            if (e.keyCode !== 38 && e.keyCode !== 40) {
                ac.set('selectedIndex', 0);
            }
        });

        function insertAraleModules(data) {
            // 按字母顺序排序
            data = data.sort(function(a, b) {
                return a.name[0] > b.name[0];
            });

            if ($('#module-wrapper').length === 0) {
                return;
            }

            for(var i=0; i<data.length; i++) {
                var item = $('<a class="module" target="_blank" href="#"></a>');
                item.html(data[i].name)
                    .attr('href', '/' + data[i].name + '/')
                    .data('description', data[i].description)
                    .data('version', data[i].version);
                $('.modules-' + data[i]['tag']).append(item).prev().show();
                cardPopup(item);
            }
        }

        function insertAlipayModules(data) {
            data = data.sort(function(a, b) {
                return a.name[0] > b.name[0];
            });

            if ($('#module-wrapper').length === 0) {
                return;
            }

            for(var i=0; i<data.length; i++) {
                var item = $('<a class="module" target="_blank" href="#"></a>');
                item.html(data[i].name)
                    .attr('href', 'http://aralejs.alipay.im/' + data[i].name + '/')
                    .data('description', data[i].description || '暂无描述')
                    .data('version', data[i].version);

                $('.modules-alipay').append(item);
                $('.modules-alipay').prev().show();
                cardPopup(item);
            }
        }

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

})();
