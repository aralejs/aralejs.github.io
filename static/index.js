seajs.use([
  'jquery',
  'arale-sticky',
  'word-color',
  'arale-autocomplete',
  'keymaster',
  'moment'],
  function($, Sticky, wordColor, Autocomplete, key, moment) {

  Sticky.stick('#document-wrapper', 0);

  var modules = [];
  var deprecatedModules = '';

  var urls = [
    'http://spmjs.io/repository/search?q=arale&define'
  ];

  seajs.use(urls, function(arale) {
    $('.modules-utility').empty();
    insertModules(arale);
    var data = [];
    for (var i=0; i<arale.data.results.length; i++) {
      arale.data.results[i].label = arale.data.results[i].name;
      data.push(arale.data.results[i]);
    }
    modules = modules.concat(data);
    color('.module');
  });

  seajs.use('http://spm.alipay-inc.com/repository/search?q=alipay&define', function(alipay) {
    if (alipay) {
      $('.side-area li:last-child').show();
      insertModules(alipay);
      var data = [];
      for (var i=0; i<alipay.data.results.length; i++) {
        alipay.data.results[i].label = alipay.data.results[i].name;
        data.push(alipay.data.results[i]);
      }
      modules = modules.concat(data);
      color('.module');
    }
  });

  function insertModules(data) {
    if ($('#module-wrapper').length === 0) {
      return;
    }

    try {
      data = data.data.results;
    } catch(e) {}

    data = data.sort(function(a, b) {
      return a.name.charCodeAt(0) - b.name.charCodeAt(0);
    });

    for (var i = 0; i < data.length; i++) {
      var item = $('<div class="module">\
        <a class="module-name" target="_blank" href="#"></a>\
        <span class="module-version"></span>\
        <p class="module-description"></p>\
        </div>');

      var pkg = data[i];
      var family = pkg.name.split('-')[0];

      pkg.keywords = pkg.keywords || [];

      // 三十天内更新的标注为新模块
      if (moment().diff(moment(pkg.created_at), 'days') <= 30) {
        item.addClass('module-new');
        item.attr('title', "新模块");
      }

      // 增加 deprecated 信息
      if (deprecatedModules.indexOf(pkg.name) >= 0) {
        item.addClass('module-deprecated');
        item.attr('title', "即将废弃的模块");
      }

      var moduleName = pkg.name.indexOf('-') > 0
        ? pkg.name.split('-').slice(1).join('-')
        : pkg.name;

      item.find(".module-name").html(moduleName)
                               .attr('href', '/' + pkg.name.replace(/^arale-/, '') + '/')
                               .attr('title', pkg.name);
      item.find(".module-version").html(pkg.version);
      item.find(".module-description").html(pkg.description)
                                      .attr('title', pkg.description);

      if (family === 'gallery' || family === 'jquery') {
        item.find(".module-name").attr('href', "https://spmjs.org/" + family + '/' + pkg.name);
        $('.modules-' + family).append(item).prev().show();
      } else if (family === 'alipay') {
        var url = 'http://spm.alipay-inc.com/docs/' + pkg.name + '/latest/';
        item.find(".module-name").attr('href', url);
        $('.modules-alipay').append(item).prev().show();
      } else if (family === 'arale' || pkg.keywords.indexOf('arale')) {
        if (pkg.keywords) {
          $('.modules-' + pkg.keywords[0]).append(item).prev().show();
        } else {
          $('.modules-widget').append(item).prev().show();
        }
      }
    }
  }

  function color(items) {
    items = $(items);
    items.each(function(index, item) {
      item = $(item);
      item.css('border-left-color', toRgba(wordColor(item.find('.module-name').html()), 0.65));
    });
  }

  function toRgba(rgb, opacity) {
    if (!$.support.opacity) {
      return rgb;
    }
    return rgb.replace('rgb', 'rgba').replace(')', ',' + opacity + ')');
  }

  var ac = new Autocomplete({
    trigger: '#search',
    selectFirst: true,
    html: '<div>{{matchKey}}</div><div class="ui-select-desc">{{desc}}</div>',
    dataSource: function() {
      return modules;
    },
    filter: function(data, query) {
      if (!query) {
        return [];
      }
      var result = [];
      query = query.toLowerCase().replace(/^\s+|\s+$/g, '');

      $.each(data, function(index, value) {
        value.description = (value.description || '').toLowerCase();
        value.name = value.name.toLowerCase();
        var keywords = value.keywords ? value.keywords.join(' ') : '';

        var item = {
          matchKey: value.name,
          desc: value.description,
          url: 'http://spmjs.io/package/' + value.name,
          score: 0  //匹配度
        };

        if (value.name.indexOf(query) > -1) {
          item.score += 20;
          item.score -= value.name.length/0.99; // shorter would be better
        } else if (value.description.indexOf(query) > -1) {
          item.score += 0.1;
        }

        if (keywords.indexOf(query) > -1) {
          item.score += 1;
        }

        value.keywords && value.keywords.forEach(function(k) {
          if (k === query && k !== value.name) {
            item.score += 5;
          }
        });

        if (value.name.indexOf(query) === 0) {
          item.score += 100;
        }

        if (item.score > 0) {
          result.push(item);
        }

      });

      result = result.sort(function(a, b) {
        return b.score - a.score;
      });

      return result.slice(0, 12);

    }
  }).render();

  ac.on('itemSelected', function(item) {
    $(ac.get('trigger')).val('正转到 ' + item.matchKey).attr('disabled', 'disabled');
    location.href = item.url;
  });

});
