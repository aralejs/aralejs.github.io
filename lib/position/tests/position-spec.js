define(function(require) {

    var Position = require('../src/position');
    var $ = require('$');

    describe('position', function() {

        var pinElement, baseElement, noopDiv;
        $(document.body).css('margin', 0);        

        beforeEach(function() {
            pinElement = $('<div style="width:100px;height:100px;">pinElement</div>').appendTo(document.body);
            // for ie6 bug
            noopDiv = $('<div></div>').appendTo(document.body);
            baseElement = $('<div style="margin:20px;border:5px solid #000;padding:20px;width:200px;height:200px;">baseElement</div>').appendTo(document.body);            
        });

        afterEach(function() {
            baseElement.remove();
            noopDiv.remove();
            pinElement.remove();
        });

        test('相对屏幕定位：Position.pin(pinElement, { x: 100, y: 100 })', function() {
            Position.pin(pinElement, { x: 100, y: 100 });
            expect(pinElement.offset().top).toBe(100);
            expect(pinElement.offset().left).toBe(100);
        });

        test('基本情况：Position.pin({ element: pinElement, x: 0, y: 0 }, { element:baseElement, x: 100, y: 100 })', function() {
            Position.pin({ element: pinElement, x: 0, y: 0 }, { element:baseElement, x: 100, y: 100 });
            expect(pinElement.offset().top).toBe(120);
            expect(pinElement.offset().left).toBe(120);
        });

        test('第一个参数简略写法：Position.pin(pinElement, { element:baseElement, x: 100, y: 100 })', function() {
            Position.pin({ element: pinElement, x: 0, y: 0 }, { element:baseElement, x: 100, y: 100 });
            expect(pinElement.offset().top).toBe(120);
            expect(pinElement.offset().left).toBe(120);
        });

        test('带px的字符串参数：Position.pin(pinElement, { element:baseElement, x: "100px", y: "100px" })', function() {
            Position.pin({ element: pinElement, x: 0, y: 0 }, { element:baseElement, x: "100px", y: "100px" });
            expect(pinElement.offset().top).toBe(120);
            expect(pinElement.offset().left).toBe(120);
        });

        test('负数定位点：Position.pin({ element: pinElement, x: -100, y: -100 }, { element:baseElement, x: 0, y: 0 })', function() {
            Position.pin({ element: pinElement, x: -100, y: -100 }, { element:baseElement, x: 0, y: 0 });
            expect(pinElement.offset().top).toBe(120);
            expect(pinElement.offset().left).toBe(120);
        });

        test('百分比：Position.pin(pinElement, { element:baseElement, x: "100%", y: "50%" })', function() {
            Position.pin(pinElement, { element:baseElement, x: '100%', y: '50%' });
            expect(pinElement.offset().top).toBe(145);
            expect(pinElement.offset().left).toBe(270);
        });

        test('负百分比：Position.pin(pinElement, { element:baseElement, x: "-100%", y: "-50%" })', function() {
            Position.pin(pinElement, { element:baseElement, x: '-100%', y: '-50%' });
            expect(pinElement.offset().top).toBe(-105);
            expect(pinElement.offset().left).toBe(-230);
        });

        test('别名：Position.pin({ element:pinElement, x: "left", y: "left" }, { element:baseElement, x: "right", y: "center" })', function() {
            Position.pin({ element:pinElement, x: "left", y: "left" }, { element:baseElement, x: 'right', y: 'center' });
            expect(pinElement.offset().top).toBe(145);
            expect(pinElement.offset().left).toBe(270);
        });

        test('百分比小数：Position.pin(pinElement, { element:baseElement, x: "99.5%", y: "50.5%" })', function() {
            Position.pin(pinElement, { element:baseElement, x: "99.5%", y: "50.5%" });
            expect(pinElement.offset().top).toBeGreaterThan(145.99);
            expect(pinElement.offset().top).toBeLessThan(147.01);            
            expect(pinElement.offset().left).toBeGreaterThan(267.99);
            expect(pinElement.offset().left).toBeLessThan(269.01);
        });

        test('居中定位：Position.center(pinElement, baseElement);', function() {
            Position.center(pinElement, baseElement);
            expect(pinElement.offset().top).toBe(95);
            expect(pinElement.offset().left).toBe(95);
        });

        test('屏幕居中定位：Position.center(pinElement );', function() {
            Position.center(pinElement);
            expect(($(window).outerHeight()-100)/2).toBeGreaterThan(pinElement.offset().top-0.51);
            expect(($(window).outerHeight()-100)/2).toBeLessThan(pinElement.offset().top+0.51);
            expect(($(window).outerWidth()-100)/2).toBeGreaterThan(pinElement.offset().left-0.51);
            expect(($(window).outerWidth()-100)/2).toBeLessThan(pinElement.offset().left+0.51); 
        });

        test('offsetParent不为body：', function() {
            var offsetParent = $('<div style="margin:20px;border:10px solid #000;padding:20px;position:relative;"></div>').appendTo(document.body);
            baseElement.appendTo(offsetParent);
            Position.pin(pinElement, { element:baseElement, x: 100, y: 100 });
            expect(parseInt(pinElement.offset().top) - parseInt(baseElement.offset().top)).toBe(100);
            expect(parseInt(pinElement.offset().left) - parseInt(baseElement.offset().left)).toBe(100);
            offsetParent.remove();
        });

        test('offsetParent绝对定位：', function() {
            var offsetParent = $('<div style="position:absolute;top:50px;left:50px;"></div>').appendTo(document.body);
            baseElement.appendTo(offsetParent);
            Position.pin(pinElement, { element:baseElement, x: 100, y: 100 });
            expect(parseInt(pinElement.offset().top)).toBe(170);
            expect(parseInt(pinElement.offset().left)).toBe(170);
            offsetParent.remove();
        });

        test('加号应用：', function() {
            Position.pin(pinElement, { element:baseElement, x: "100%+20px", y: "50%+15px" });
            expect(parseInt(pinElement.offset().top)).toBe(160);
            expect(parseInt(pinElement.offset().left)).toBe(290);
        });

        test('减号应用：', function() {
            Position.pin(pinElement, { element:baseElement, x: "100%-20px", y: "50%-15px" });
            expect(parseInt(pinElement.offset().top)).toBe(130);
            expect(parseInt(pinElement.offset().left)).toBe(250);
        });

        test('加减号混用：', function() {
            Position.pin(pinElement, { element:baseElement, x: "100%-20px+10px", y: "50%-15px+5px" });
            expect(parseInt(pinElement.offset().top)).toBe(135);
            expect(parseInt(pinElement.offset().left)).toBe(260);
        });

        test('相对自身定位：', function() {
            baseElement.remove();
            Position.pin(pinElement, { element:pinElement, x: "100%", y: 0 });
            expect(parseInt(pinElement.offset().top)).toBe(0);
            expect(parseInt(pinElement.offset().left)).toBe(100);
        });

        test('fixed定位：', function() {
            pinElement.css('position', 'fixed');
            Position.pin(pinElement, { x: "300px", y: 250 });
            expect(pinElement.css('position')).toBe('fixed');
            expect(pinElement.css('top')).toBe('250px');
            expect(pinElement.css('left')).toBe('300px');
        });

    });
});
