seajs.use(['jquery', './easing-graph', '../src/easing'], function($, Graph) {

    var data = [
        {
            group: 'default',
            easings: ['linear', 'swing']
        },
        {
            group: 'ease',
            easings: ['None', 'In', 'Out', 'Both', 'InStrong', 'OutStrong', 'BothStrong']
        },
        {
            group: 'back',
            easings: ['In', 'Out', 'Both']
        },
        {
            group: 'elastic',
            easings: ['In', 'Out', 'Both']
        },
        {
            group: 'bounce',
            easings: ['In', 'Out', 'Both']
        }
    ];

    var $container = $('#container');


    for (var i = 0, len = data.length; i < len; i++) {
        var o = data[i];

        var group = o.group;
        var prefix = group === 'default' ? '' : group;

        var easingNames = $.map(o.easings, function(name) {
            return prefix + name;
        });

        var easings = $.map(easingNames, function(name) {
            return $.easing[name];
        });

        $('<div/>', {
            id: group,
            'class': 'graph-holder',
            html: '<h2>' + group + '</h2>' + '<p>' +
                    easingNames.join(' / ') + '</p>'
        }).appendTo($container);

        Graph(group, easings);
    }

});
