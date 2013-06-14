seajs.use(['$', 'placeholder', 'sticky', 'word-color', 'autocomplete'], function($, Placeholder, Sticky, wordColor, Autocomplete) {

  Sticky.stick('#document-wrapper', 0);

  var modules = [];

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
      var item = $('<div class="module">\
        <a class="module-name" target="_blank" href="#"></a>\
        <span class="module-version"></span>\
        <p class="module-description"></p>\
        </div>');

      var pkg = data[i];
      var family = pkg.family || pkg.root;

      item.find(".module-name").html(pkg.name)
                                .attr('href', '/' + pkg.name + '/')
                                .attr('title', pkg.name);
      item.find(".module-version").html(pkg.version);
      item.find(".module-description").html(pkg.description)
                                      .attr('title', pkg.description);

      if (family === 'gallery' || family === 'jquery') {
        item.find(".module-name").attr('href', pkg.homepage);
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
      $.each(data, function(index, value) {
        var temp = (value.root||value.family) + '.' + value.name;
        value.description = value.description || '';
        if (temp.indexOf(query) > -1 ||
            value.description.indexOf(query) > -1) {
          result.unshift({
            matchKey: temp,
            desc: value.description,
            url: value.homepage
          });
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
