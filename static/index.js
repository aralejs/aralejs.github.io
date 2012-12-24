(function() {
  seajs.config({
    alias: {
      'popup': 'arale/popup/0.9.11/popup',
      'autocomplete': 'arale/autocomplete/1.0.0/autocomplete',
      'placeholder': 'arale/placeholder/1.0.0/placeholder',
      'afc163': '/sea-modules/afc163'
    },
    preload: ['seajs/plugin-combo'],
    comboExcludes: /word\-color\.js/
  });

  seajs.use(
    ['$', 'popup', 'autocomplete', 'placeholder', 'afc163/word-color/1.0.0/word-color', 'http://aralejs.org/package.js'],
    function($, Popup, Autocomplete, Placeholder, wordColor, araleModules) {

      var modules;

      insertAraleModules(araleModules);

      // 搜索组件自动完成
      var ac = new Autocomplete({
        trigger: '#search',
        selectFirst: true,
        dataSource: function() {
          if (modules) {
            this.trigger('data', modules);
          } else {
            this.trigger('data', araleModules);
          }
        },
        filter: function(data, query) {
          var result = [];
          $.each(data, function(index, value) {
            var temp = value.root + '.' + value.name;
            if (temp.indexOf(query) > -1) {
              result.push({matchKey: temp, url: value.homepage});
            }
          });
          return result;
        }
      }).render();

      ac.on('itemSelect', function(item) {
        ac.get('trigger').val('正转到 ' + item.matchKey).attr('disabled', 'disabled');
        var value = item.matchKey.split('.');
        if (value[0] === 'arale') {
          location.href = '/' + value[1];
        } else if (value[0] === 'alipay') {
          location.href = 'http://aralejs.alipay.im/' + value[1];
        } else {
          location.href = item.url;
        }
      });
    
        /*
      $('#search').focus().on('keyup', function(e) {
        if (e.keyCode !== 38 && e.keyCode !== 40) {
          ac.set('selectedIndex', 0);
        }
      });*/

      seajs.use(['http://aralejs.alipay.im/package.js'], function(alipayModules) {
        if (!alipayModules) {
          return;
        }
        insertAlipayModules(alipayModules);
        modules = araleModules.concat(alipayModules);

        $('#J-alipay').show();
      });

      function insertAraleModules(data) {
        // 按字母顺序排序
        data = data.sort(function(a, b) {
          return a.name[0] > b.name[0];
        });

        if ($('#module-wrapper').length === 0) {
          return;
        }
        $('.modules').empty();
        for(var i=0; i<data.length; i++) {
          var item = $('<a class="module" target="_blank" href="#"></a>');
          var module = data[i];
          item.html(module.name)
          .attr('href', '/' + module.name + '/')
          .data('description', module.description)
          .data('version', module.version);
          if (module.root === 'gallery') {
            item.attr('href', module.homepage);
            $('.modules-gallery').append(item).prev().show();
          } else {
            $('.modules-' + module.tag).append(item).prev().show();
          }
        }
        cardPopup('.module');        
        color('.module');
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
        }
        cardPopup('.modules-alipay .module');        
        color('.modules-alipay .module');        
      }

      function cardPopup(items) {
        // 卡片
        var popup = new Popup({
          element: '#card',
          trigger: items,
          effect: 'fade',
          align: {
            baseXY: [0, -2],
            selfXY: [0, '100%']
          }
        });
        popup.on('before:show', function() {
          $('#card .card-name').html(this.activeTrigger.html());
          $('#card .card-description').html(this.activeTrigger.data('description') || '');
          $('#card .card-version').html(this.activeTrigger.data('version') || '');
        });
      }

      function color(items) {
        items = $(items);
        items.each(function(index, item) {
            item = $(item);
            item.css('border-color', toRgba(wordColor(item.html()), 0.65));
        });
      }

      function toRgba(rgb, opacity) {
        if ($.browser.msie && $.browser.version < 9) {
            return rgb;
        }
        return rgb.replace('rgb', 'rgba').replace(')', ',' + opacity + ')');
      }

    });
})();
