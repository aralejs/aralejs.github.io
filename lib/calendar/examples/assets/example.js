seajs.config({
    map: [
        [/^(.+)\/widget\.js.*$/, '$1/../../../lib/widget/src/widget.js'],
        [/^(.+)\/templatable\.js.*$/, '$1/../../../lib/widget/src/templatable.js']
    ]
});

seajs.use(
    ['jquery', '../src/calendar', '../src/i18n/zh_CN', 'widget'],
    function($, Calendar, lang, Widget) {

        // for debug
        this.$ = $;

        var available = function(time) {
            var day = time.day();
            return day != 2;
        };

        var cal1 = new Calendar({trigger: '#date-1'});

        var cal2 = new Calendar({trigger: '#date-2', lang: lang});

        var range = function(time) {
            var day = time.day();
            return day != 2;
        };
        var cal3 = new Calendar({trigger: '#date-3', range: range});
        cal3.on('select-disabled-date', function(date) {
            $('#date-3-explain').text('you select a disabled date');
        });
        var cal4 = new Calendar({trigger: '#date-4'});
        var cal5 = new Calendar({trigger: '#date-5'});
        cal4.on('select-date', function(date) {
            cal5.range([date, null]);
        }).on('select-disabled-date', function(date) {
            $('#date-4-explain').text('not available');
        });
        cal5.on('select-date', function(date) {
            cal4.range([null, date]);
        }).on('select-disabled-date', function(date) {
            $('#date-5-explain').text('not available');
        });;

        Widget.autoRenderAll();
    }
);
