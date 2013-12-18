seajs.use([
  '$',
  'placeholder',
  'sticky',
  'word-color',
  'autocomplete',
  'keymaster',
  'moment',
  "/package.json"],
  function($, Placeholder, Sticky, wordColor, Autocomplete, key, moment, package) {

  Sticky.stick('#document-wrapper', 0);

  var modules = [];
  var deprecatedModules = package['module-tags'].deprecated.join(' ');

  var urls = [
    'http://spmjs.org/repository/arale/?define',
    'http://spmjs.org/repository/gallery/?define',
    'http://spmjs.org/repository/jquery/?define'
  ];

  seajs.use(urls, function(arale, gallery, jquery) {
    $('.modules-utility').empty();
    modules = modules.concat(arale);
    modules = modules.concat(gallery);
    modules = modules.concat(jquery);

    insertModules(arale);
    insertModules(gallery);
    insertModules(jquery);
    color('.module');
  });

  seajs.use('http://yuan.alipay.im/repository/alipay/?define', function(alipay) {
    if (alipay) {
      $('.side-area li:last-child').show();
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
      return a.name.charCodeAt(0) - b.name.charCodeAt(0);
    });

    for (var i = 0; i < data.length; i++) {
      var item = $('<div class="module">\
        <a class="module-name" target="_blank" href="#"></a>\
        <span class="module-version"></span>\
        <p class="module-description"></p>\
        </div>');

      var pkg = data[i];
      var family = pkg.family || pkg.root;

      // 三十天内更新的标注为新模块
      if (moment().diff(moment(pkg.created_at), 'days') <= 30) {
        item.addClass('module-new');
        item.attr('title', "新模块");
      }

      // 增加 deprecated 信息

      var family_name = family + '/' + pkg.name;
      if (deprecatedModules.indexOf(family_name) >= 0) {
        item.addClass('module-deprecated');
        item.attr('title', "即将废弃的模块");
      }

      item.find(".module-name").html(pkg.name)
                               .attr('href', '/' + pkg.name + '/')
                               .attr('title', pkg.name);
      item.find(".module-version").html(pkg.version);
      item.find(".module-description").html(pkg.description)
                                      .attr('title', pkg.description);

      if (family === 'gallery' || family === 'jquery') {
        item.find(".module-name").attr('href', "https://spmjs.org/" + family + '/' + pkg.name);
        $('.modules-' + family).append(item).prev().show();
      } else if (family === 'arale') {
        if (pkg.keywords) {
          $('.modules-' + pkg.keywords[0]).append(item).prev().show();
        } else {
          $('.modules-widget').append(item).prev().show();
        }
      } else if (family === 'alipay') {
        var url = [
          'http://arale.alipay.im',
          (pkg.family || pkg.root),
          pkg.name
        ].join('/') + '/';
        item.find(".module-name").attr('href', url);
        $('.modules-alipay').append(item).prev().show();
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
    template:
        '<div class="{{classPrefix}}">\
            <ul class="{{classPrefix}}-ctn" data-role="items">\
                {{#each items}}\
                    <li data-role="item" class="{{../classPrefix}}-item" data-value="{{matchKey}}">\
                        <div>{{highlightItem ../classPrefix matchKey}}</div>\
                        <div class="ui-autocomplete-desc">{{desc}}</div>\
                    </li>\
                {{/each}}\
            </ul>\
         </div>',
    dataSource: function() {
      this.trigger('data', modules);
    },
    filter: function(data, query) {
      var result = [];
      query = query.toLowerCase().replace(/^\s+|\s+$/g, '');

      $.each(data, function(index, value) {
        value.description = (value.description || '').toLowerCase();
        value.family = value.family.toLowerCase();
        value.name = value.name.toLowerCase();
        var FamilyAndName = value.family + '.' + value.name;
        var keywords = value.keywords ? value.keywords.join(' ') : '';

        var item = {
          matchKey: FamilyAndName,
          desc: value.description,
          url: "https://spmjs.org/" + value.family + '/' + value.name,
          score: 0  //匹配度
        };

        // make sure that "arale.class" can be matched
        if (FamilyAndName.indexOf(query) > -1) {
          item.score += 0.01;
        }

        if (value.family.indexOf(query) > -1) {
          item.score += 1;
        }
        if (value.family.indexOf(query) === 0) {
          item.score += 10;
        }

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

  // 首页将搜索功能定位到搜索框中
  if ($('#module-wrapper').length !== 0) {
    key.filter = function(event) {
      return (event.target || event.srcElement).tagName;
    };
    key('command+f, ctrl+f', function(e, handler) {
      $('#search').focus();
      return false;
    });
    key('esc', function(e, handler) {
      $('#search').blur();
    });
  }

});
