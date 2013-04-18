seajs.use(['$', 'popup', 'placeholder', 'fixed', 'word-color', 'autocomplete'], function($, Popup, Placeholder, Fixed, wordColor, Autocomplete) {


  Fixed('#document-wrapper');
  cardPopup('.module');

  var modules = [];

  var urls = [
    'http://spmjs.org/repository/arale/?define',
    'http://spmjs.org/repository/gallery/?define'
  ];

  seajs.use(urls, function(arale, gallery) {
    $('.modules-utility').empty();
    modules = modules.concat(arale);
    modules = modules.concat(gallery);

    insertModules(arale);
    insertModules(gallery);
    color('.module');
  });

  seajs.use('http://arale.alipay.im/repository/alipay/packages.json?callback=define', function(alipay) {
    if (alipay) {
      modules = modules.concat(alipay);
      insertModules(alipay);
      color('.module');
    }
  });

  function insertModules(data) {

    if ($('#module-wrapper').length === 0) {
      return;
    }

    data = data.sort(function(a, b) {
      return a.name[0] > b.name[0];
    });

    for (var i = 0; i < data.length; i++) {
      var item = $('<a class="module" target="_blank" href="#"></a>');

      var pkg = data[i];
      var family = pkg.family || pkg.root;

      item.html(pkg.name)
      .attr('href', '/' + pkg.name + '/')
      .data('name', pkg.name)
      .data('description', pkg.description)
      .data('version', pkg.version);
      if (family === 'gallery') {
        item.attr('href', pkg.homepage);
        $('.modules-gallery').append(item).prev().show();
      } else if (family === 'arale') {
        if (pkg.tag) {
          $('.modules-' + pkg.tag).append(item).prev().show();
        } else if (pkg.keywords) {
          $('.modules-' + pkg.keywords[0]).append(item).prev().show();
        }
      } else if (family === 'alipay') {
        var url = pkg.homepage;
        if (!url) {
          url = [
            'http://arale.alipay.im',
            (pkg.family || pkg.root),
            pkg.name
          ].join('/') + '/';
        }
        item.attr('href', url);
        $('.modules-alipay').append(item).prev().show();
      }
    }
  }


  function cardPopup(items) {
    // 卡片
    var popup = new Popup({
      element: '#card',
      delegateNode: '.modules',
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

  var ac = new Autocomplete({
    trigger: '#search',
    selectFirst: true,
    dataSource: function() {
      this.trigger('data', modules);
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
      location.href = 'http://arale.alipay.im/alipay/' + value[1];
    } else {
      location.href = item.url;
    }
  });
});
