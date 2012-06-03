define(function(require) {

    var Switchable = require('../src/switchable');
    var $ = require('$');

    describe('Switchable', function() {
       
        var element;
        $(document.body).css('margin', 0);        

        beforeEach(function() {
            var elem = [];
            elem.push('<div id="#demo1">');
            elem.push('<ul class="ui-switchable-nav">');
            elem.push('<li>NA</li>><li>NB</li>><li>NC</li></ul>');
            elem.push('<div class="ui-switchable-content">');
            elem.push('<div style="display: none">CA</div>');
            elem.push('<div style="display: none">CB</div>');
            elem.push('<div style="display: none">CC</div></div>');
            elem.push('</div>');
            var element = $(elem.join('')).appendTo(document.body);
        });
        afterEach(function() {
            baseElement.remove();
            noopDiv.remove();
            pinElement.remove();
        });
        test('Switchable初始化：, function() {
            var switchable = new Switchable({
                element: '#demo1'
            });
            console.log(switchable)

        });


 
        // 待补充
    });
});
