(function() {
  seajs.config({
    base: 'http://static.alipayobjects.com/',
    alias: {
      'popup': 'arale/popup/0.9.13/popup',
      'autocomplete': 'arale/autocomplete/1.0.0/autocomplete',
      'placeholder': 'arale/placeholder/1.0.0/placeholder',
      'fixed': 'arale/fixed/1.0.0/fixed',
      'afc163': '/sea-modules/afc163'
    },
    preload: ['seajs/plugin-combo'],
    comboExcludes: /word\-color\.js/
  });

  seajs.use(
    ['$', 'popup', 'autocomplete', 'placeholder', 'fixed', 'afc163/word-color/1.0.0/word-color', 'http://aralejs.org/package.js'],
    function($, Popup, Autocomplete, Placeholder, Fixed, wordColor, araleModules) {

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
            var temp = (value.root||value.family) + '.' + value.name;
            value.description = value.description || '';
            if (temp.indexOf(query) > -1) {
              result.unshift({matchKey: temp, url: value.homepage});
            } else if (value.description.indexOf(query) > -1) {
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

      Fixed('#document-wrapper');

      $.get('http://arale.alipay.im/repository/alipay/packages.json?callback=?', function(alipayModules) {
        if (!alipayModules) {
          return;
        }
        insertAlipayModules(alipayModules);
        modules = araleModules.concat(alipayModules);

        $('#J-alipay').show();
      }, 'jsonp');

      function insertAraleModules(data) {
        if ($('#module-wrapper').length === 0) {
          return;
        }

        // 按字母顺序排序
        data = data.sort(function(a, b) {
          return a.name[0] > b.name[0];
        });

        $('.modules').empty();
        for(var i=0; i<data.length; i++) {
          var item = $('<a class="module" target="_blank" href="#"></a>');
          var module = data[i];
          var root = module.root || module.family;
          item.html(module.name)
          .attr('href', '/' + module.name + '/')
          .data('name', module.name)
          .data('description', module.description)
          .data('version', module.version);
          if (root === 'gallery') {
            item.attr('href', module.homepage);
            $('.modules-gallery').append(item).prev().show();
          } else if (root === 'arale') {
            item.append('<img alt="Build Status" src="https://secure.travis-ci.org/aralejs/' + item.html() + '.png">');
            if (module.tag) {
                $('.modules-' + module.tag).append(item).prev().show();
            } else if (module.keywords) {
                $('.modules-' + module.keywords[0]).append(item).prev().show();                
            }
          }
        }
        cardPopup('.module');
        color('.module');
      }

      function insertAlipayModules(data) {
        if ($('#module-wrapper').length === 0) {
          return;
        }

        data = data.sort(function(a, b) {
          return a.name[0] > b.name[0];
        });

        for(var i=0; i<data.length; i++) {
          var item = $('<a class="module" target="_blank" href="#"></a>');
          item.html(data[i].name)
          .attr('href', 'http://arale.alipay.im/' + (data[i].root || data[i].family) + '/' + data[i].name + '/')
          .data('description', data[i].description || '暂无描述')
          .data('name', data[i].name)
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
          duration: 100,
          delay: -1,
          align: {
            baseXY: [0, -5],
            selfXY: [0, '100%']
          }
        });
        popup.on('before:show', function() {
          var at = $(this.activeTrigger);
          $('#card .card-name').html(at.data('name'));
          $('#card .card-description').html(at.data('description') || '');
          $('#card .card-version').html(at.data('version') || '');
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
