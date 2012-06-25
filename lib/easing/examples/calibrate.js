seajs.config({
    alias: {
        'raphael': 'http://modules.seajs.org/raphael/2.1.0/raphael.js'
    }
})

seajs.use(['jquery', 'raphael', '../src/easing'], function($, Raphael) {

    var easings = [
        [
            'linear',
            'swing'
        ],
        [
            'easeNone',
            'easeIn',
            'easeOut',
            'easeBoth',
            'easeInStrong',
            'easeOutStrong',
            'easeBothStrong'
        ],
        [
            'backIn',
            'backOut',
            'backBoth'],
        [
            'elasticIn',
            'elasticOut',
            'elasticBoth'
        ],
        [
            'bounceIn',
            'bounceOut',
            'bounceBoth'
        ]
    ];

    var easingFns = $.easing;

    var steps = 20;
    var resolution = 200;
    var width = 500;
    var height = 500;
    var content = $('#content');
    var gap = [0, 0, 60, 190, 0];

    for (var i = 0; i < easings.length; i++) {
        var easing = easings[i];

        var holder = $('<div/>', {
            'class': 'graph-holder',
            html: '<h2></h2>'
        }).appendTo(content);

        drawEasing(holder, width, height, easing, gap[i]);
    }


    function drawEasing(holder, w, h, easings, gap) {
        var paper = Raphael(holder[0], w, h + gap * 2);

        var x = .5, y = .5 + gap;
        var stepX = w / steps, stepY = h / steps;
        var pathGrid = '';

        for (var i = 0; i < steps + 1; i++) {
            pathGrid += ('M' + x + ',' + (y + i * stepY) + 'l' +
                    w + ',' + 0);
            pathGrid += ('M' + (x + i * stepX) + ',' + y + 'l' +
                    0 + ',' + h);
        }

        paper.path(pathGrid).attr({
            stroke: '#333'
        });

        var stepX2 = w / resolution;
        var hue = (Math.random() * 360);

        function nextColour() {
            var colour = 'hsl(' + [hue, 50, 50] + ')';
            hue = (hue + 43) % 360;
            return colour;
        }

        var title = [];

        for (var j = 0; j < easings.length; j++) {
            var color = nextColour();
            var path = '';

            title.push('<span style="color:' +
                    Raphael.getRGB(color).hex + '">' +
                    easings[j] + '</span>');

            for (i = 0; i < resolution; i++) {
                var sx = (stepX2 * i);
                var sy = (y + easingFns[easings[j]](i / resolution) * h);
                path += 'M' + sx + ',' + (-(sy - gap) + gap + h) +
                        'l' + '1,0' + 'l' + '0,1' +
                        'l' + '-1,0' + 'l' + '0,-1z';
            }

            paper.path(path).attr({
                stroke: color
            });
        }

        holder.find('h2').html(title.join(' / '));
    }

});
