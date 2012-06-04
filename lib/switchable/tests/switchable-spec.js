define(function(require) {

    var Switchable = require('../src/switchable');
    var Carousel = require('../src/carousel');
    var Slide = require('../src/slide');
    var Accordion = require('../src/accordion');
    var Tabse = require('../src/tabs');
    var $ = require('$');

    describe('Switchable', function() {
       
        var element1, element2, element3;
        $(document.body).css('margin', 0);        

        function testTriggerAndPanelActive(sw, active) {
            var triggers = sw.triggers;
            var panels = sw.panels;
            var trigger, panel;
            for (var i = 0, len = sw.length; i < len; i++) {
                trigger = $(triggers[i]);
                panel = $(panels[i]);
                if (active == i) {
                    expect(trigger.attr('class')).toContain('ui-active');
                    expect(panel.css('display')).toBe('block');
                } else {
                    expect(trigger.attr('class')).toEqual('ui-switchable-trigger-internal');
                    expect(panel.css('display')).toEqual('none');
                }
            }
        }
      
        beforeEach(function() {
            // 测试元素1
            var elem = [];
            elem.push('<div id="demo1">');
            elem.push('<ul class="ui-switchable-nav">');
            elem.push('<li>NA</li>><li>NB</li>><li>NC</li></ul>');
            elem.push('<div class="ui-switchable-content">');
            elem.push('<div style="display: none">CA</div>');
            elem.push('<div style="display: none">CB</div>');
            elem.push('<div style="display: none">CC</div></div>');
            elem.push('</div>');
            element1 = $(elem.join('')).appendTo(document.body);
            // 测试元素2
            var elem2 = [];
            elem2.push('<div id="demo2">');
            elem2.push('<ul>');
            elem2.push('<li>NA</li>><li>NB</li>><li>NC</li></ul>');
            elem2.push('<div>'); 
            elem2.push('<div class="ui-switchable-panel" style="display: none">CA</div>');
            elem2.push('<div class="ui-switchable-panel" style="display: none">CB</div>');
            elem2.push('<div class="ui-switchable-panel" style="display: none">CC</div></div>');
            elem2.push('</div>');
            element2 = $(elem2.join('')).appendTo(document.body);
            // 测试元素3
            var elem3 = [];
            elem3.push('<div id="demo3">');
            elem3.push('<div class="ui-switchable-content">'); 
            elem3.push('<div>CA</div>'); 
            elem3.push('<div style="display: none">CB</div>');
            elem3.push('<div style="display: none">CC</div></div>');
            elem3.push('</div>');
            element3 = $(elem3.join('')).appendTo(document.body);

        });
        afterEach(function() {
            element1.remove();
            element2.remove();
        });
        test('Switchable初始化', function() {
            var switchable = new Switchable({
                element: '#demo1'
            });
            expect(switchable instanceof Switchable).toBe(true);
            expect(switchable.triggers.length).toBe(3);
            expect(switchable.panels.length).toBe(3);
            expect($('.ui-switchable-nav').attr('class')).toBe('ui-switchable-nav');
            expect($('.ui-switchable-content').attr('class')).toBe('ui-switchable-content');
        });

        test('panels和triggers传入', function() {
            var switchable = new Switchable({
                element: '#demo2',
                triggers: $('ul').children(),
                panels: $('.ui-switchable-panel')
            });

            expect(switchable instanceof Switchable).toBe(true);
            expect(switchable.triggers.length).toBe(3);
            expect(switchable.panels.length).toBe(3);
        });

        test('Switchable 属性配置', function() {
            var switchable = new Switchable({
                element: '#demo1',
                triggerType: 'click',
                activeIndex: 1
            });
            expect(switchable.get('triggerType')).toBe('click');
            expect(switchable.get('activeIndex')).toBe(1);
        });

        test('triggers自动初始化', function() {
            var switchable = new Switchable({
                element: '#demo3',
                navClass: 'ui-switchable-nav'
            });
            expect(switchable.triggers.length).toBe(3);
            expect(switchable.panels.length).toBe(3);
            expect($(switchable.triggers[0]).html()).toBe('1');
            expect($(switchable.triggers[1]).html()).toBe('2');
        });

        test('触发默认位置', function() {
            var sw = new Switchable({
                element: '#demo1',
                activeIndex: 1
            });
            testTriggerAndPanelActive(sw, 1);            
        });

        test('switchTo', function() {
            var sw = new Switchable({
                element: '#demo1'
            });
            testTriggerAndPanelActive(sw, 0);            
            sw.switchTo(2);
            testTriggerAndPanelActive(sw, 2);            

            //test critical value 
            sw.switchTo(5);
            testTriggerAndPanelActive(sw, 2);            
            sw.switchTo(-1);
            testTriggerAndPanelActive(sw, 0);            
            sw.switchTo('abc');
            testTriggerAndPanelActive(sw, 0);            
        });

        test('activeIndex事件监听', function() {
            var sw = new Switchable({
                element: '#demo1'
            });
            sw.set('activeIndex', 2);
            testTriggerAndPanelActive(sw, 2);            
        });

        test('prev next', function() {
            var sw = new Switchable({
                element: '#demo1'
            });

            sw.next();
            testTriggerAndPanelActive(sw, 1);            
            sw.next();
            testTriggerAndPanelActive(sw, 2);            
            sw.next();

            testTriggerAndPanelActive(sw, 0);            

            sw.prev();
            testTriggerAndPanelActive(sw, 2);            
            sw.prev();
            testTriggerAndPanelActive(sw, 1);            
            sw.prev();
            testTriggerAndPanelActive(sw, 0);            
            sw.prev();
            testTriggerAndPanelActive(sw, 2);            

        });

        test('Carcousel', function() {
            var cc = new Carousel({
                element: '#demo1'
            });
            expect(cc.get('circular')).toBeTruthy();
            cc.switchTo(2);

            cc.next();
            testTriggerAndPanelActive(cc, 0);            
            
            cc.prev();
            testTriggerAndPanelActive(cc, 2);            
        });
        test('Slide', function() {
            var sw = new Switchable({
                element: '#demo1'
            });
        });
        test('Accordion', function() {
            var sw = new Switchable({
                element: '#demo1'
            });
        });
        
        test('插件安装', function() {
            var sw = new Switchable({
                element: '#demo1'
            });
        });
      

 
        // 待补充
    });
});
