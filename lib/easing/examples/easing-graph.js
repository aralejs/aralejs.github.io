Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", x, y, "L", x + w, y, x + w, y + h, x, y + h, x, y],
            rowHeight = h / hv,
            columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", x, y + i * rowHeight, "L", x + w, y + i * rowHeight]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", x + i * columnWidth, y, "L", x + i * columnWidth, y + h]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};

define(function(require) {

    var $ = require('jquery');

    var Graph = function Graph(id, easings, options) {
        if (!(this instanceof Graph)) {
            return new Graph(id, easings, options);
        }
        this.id = id;
        this.easings = Raphael.is(easings, 'array') ? easings : [easings];
        this.init(options);
        this.render();
    };

    var gproto = Graph.prototype;
    gproto.defaults = {
        width: 500,
        height: 500,
        paddingLeft: 0,
        paddingTop: 200,
        offsetLeft: -1,
        offsetTop: 0,
        cornerRadius: 0,
        resolution: 300,
        gridSize: 20,
        lineStyle: 'points',  // 'solid' or 'points',
        paper: null,
        hue: null
    };

    gproto.init = function(options) {
        this.setOptions(options);
        var opts = this.options
                , tl = this.xyEasingToGrid(0, 1);
        this.paper = this.options.paper || Raphael(this.id, opts.outerWidth, opts.outerHeight);
        this.paper.rect(
                tl[0] - opts.paddingLeft
                , tl[1] - opts.paddingTop
                , opts.outerWidth
                , opts.outerHeight
                , opts.cornerRadius
        ).attr({fill: '#000', stroke: 'none'});
        this.paper.drawGrid(
                tl[0] + 0.5
                , tl[1] + .5
                , opts.width
                , opts.height
                , opts.gridSize
                , opts.gridSize
                , '#555'
        );
        this.paths = this.paper.set();
        this.hue = this.options.hue || ~~(Math.random() * 360);
    };

    gproto.setOptions = function(options) {
        var opts = this.options = $.extend({}, this.defaults, options || {});
        opts.outerWidth = opts.width + opts.paddingLeft * 2;
        opts.outerHeight = opts.height + opts.paddingTop * 2;
        opts.x0 = opts.offsetLeft + opts.paddingLeft;
        opts.x1 = opts.x0 + opts.width;
        opts.y1 = opts.offsetTop + opts.paddingTop;
        opts.y0 = opts.y1 + opts.height;
    };

    gproto.nextColour = function() {
        var colour = 'hsl(' + [this.hue, 50, 50] + ')';
        this.hue = (this.hue + 43) % 360;
        return colour;
    };

    gproto.render = function() {
        var i = this.easings.length;
        while (i--) {
            this.drawEasing(this.easings[i]);
        }
    };

    gproto.clear = function() {
        this.paths.forEach(function(elem) {
            elem.remove();
        }).clear();
    };

    gproto.drawEasing = function(easingFunc, colour) {
        if (!Raphael.is(easingFunc, 'array')) {
            easingFunc = [easingFunc];
        }
        colour || (colour = this.nextColour());
        var easingBg = easingFunc[0]
                , easingFg = easingFunc[1] || easingFunc[0]
                , bgAttrs = {
                    stroke: colour, 'stroke-width': 1, opacity: .4
                }
                , fgAttrs = {
                    stroke: colour, 'stoke-width': 1, opacity: 1
                };
        var bgPath = this.drawEasingLine(easingBg, bgAttrs)
                , fgData = easingFg === easingBg ? bgPath : easingFg;
        this.drawEasingLine(fgData, fgAttrs);
    };

    gproto.drawEasingLine = function(easingFunc, attrs) {
        var path;
        if (Raphael.is(easingFunc, 'array') && easingFunc[0] == 'M') {
            path = easingFunc;
        } else {
            path = ['M', this.options.x0, this.options.y0];
            var steps = this.options.resolution
                    , s = 1
                    , e;
            if (!easingFunc) {
                return;
            }
            for (; s < steps; s++) {
                e = easingFunc(s / steps, s, 0, 1, steps); // Extra params to make jQuery happy
                path = this.drawPoint(path, this.xyEasingToGrid(s / steps, e));
            }
            path = this.drawPoint(path, this.xyEasingToGrid(1, 1));
        }
        this.paths.push(this.paper.path(path).attr(attrs));
        return path;
    };

    gproto.drawPoint = function(path, point) {
        path = this.options.lineStyle == 'points'
                ? path.concat('M', point, 'l', [1, 0], [0, 1], [-1, 0], [0, -1], 'z')
                : path.concat('L', point);
        return path;
    };

    gproto.xyEasingToGrid = function(x, y) {
        var opts = this.options
                , xy = arguments.length > 1 ? [x, y] : x;
        return [
            xy[0] * opts.width + opts.x0
            , (1 - xy[1]) * opts.height + opts.y1
        ]
    };

    gproto.xyGridToEasing = function(x, y) {
        var opts = this.options
                , xy = arguments.length > 1 ? [x, y] : x;
        return [
            (xy[0] - opts.x0) / opts.width
            , 1 - ((xy[1] - opts.y1) / opts.height)
        ]
    };

    return Graph;
});