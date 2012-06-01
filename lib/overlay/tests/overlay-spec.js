define(function(require) {

    var Overlay = require('../src/overlay');
    var $ = require('$');

    describe('overlay', function() {
        
        var overlay;

        beforeEach(function() {
            overlay = new Overlay({
                template: '<div></div>',
                width: 120,
                height: 110,
                zIndex: 90,
                id: 'overlay',
                className: 'ui-overlay',
                visible: false,
                style: {
                    color: '#e80',
                    backgroundColor: 'green',
                    border: '1px solid #000',
                    fontSize: '13px'
                },
                align: {
                    selfXY: [0, 0],
                    baseElement: document.body,
                    baseXY: [100, 100]
                } 
            }).render();
        });

        afterEach(function() {
            overlay.hide();
            overlay.destroy();
        });

        test('基本属性', function() {
            expect(overlay.element.attr('id')).toBe('overlay');
            expect(overlay.element.hasClass('ui-overlay')).toBe(true);
            expect(overlay.element.css('width')).toBe('120px');
            expect(overlay.element.css('height')).toBe('110px');
            expect(overlay.element.css('z-index')).toBe('90');
            expect(overlay.get('visible')).toBe(false);            
            expect(overlay.element.css('color')).toBe('rgb(238, 136, 0)');
            expect(overlay.element.css('background-color')).toBe('rgb(0, 128, 0)');
            expect(overlay.element[0].style.border).toBe('1px solid rgb(0, 0, 0)');
            expect(overlay.element.css('font-size')).toBe('13px');
            expect(overlay.get('align').selfXY[0]).toBe(0);
            expect(overlay.get('align').selfXY[1]).toBe(0);
            expect(overlay.get('align').baseElement).toBe(document.body);
            expect(overlay.get('align').baseXY[0]).toBe(100);
            expect(overlay.get('align').baseXY[1]).toBe(100);
        });

        test('默认属性', function() {
            overlay.hide().destroy();
            overlay = new Overlay({
                template: '<div></div>'
            }).render();
            expect(overlay.element[0].id).toBe('');
            expect(overlay.element[0].className).toBe('');
            expect(overlay.element.css('width')).toBe('0px');
            expect(overlay.element.css('height')).toBe('0px');
            expect(overlay.element.css('z-index')).toBe('99');
            expect(overlay.get('visible')).toBe(true);                        
            expect(overlay.get('style')).toEqual({});
            
            expect(overlay.get('align').selfXY[0]).toBe(0);
            expect(overlay.get('align').selfXY[1]).toBe(0);
            expect(overlay.get('align').baseElement._id).toBe('VIEWPORT');
            expect(overlay.get('align').baseXY[0]).toBe(0);
            expect(overlay.get('align').baseXY[1]).toBe(0);
        });

        test('设置属性', function() {
            overlay.set('style', {
                backgroundColor: 'red'
            });
            overlay.set('width', 300);
            overlay.set('height', 400);
            overlay.set('zIndex', 101);            
            overlay.set('id', 'myid');
            overlay.set('className', 'myclass');
            overlay.set('visible', true);

            expect(overlay.element.css('width')).toBe('300px');
            expect(overlay.element.css('height')).toBe('400px');
            expect(overlay.element.css('z-index')).toBe('101');            
            expect(overlay.element.css('backgroundColor')).toBe('rgb(255, 0, 0)');
            expect(overlay.element.attr('id')).toBe('myid');
            expect(overlay.element.hasClass('myclass')).toBe(true);
            expect(overlay.element.is(':hidden')).toBe(false);
        });

        test('显示隐藏', function() {
            overlay.show();
            expect(overlay.get('visible')).toBe(true);
            expect(overlay.element.is(':hidden')).toBe(false);

            overlay.hide();
            expect(overlay.get('visible')).toBe(false);
            expect(overlay.element.is(':hidden')).toBe(true);
        });

    });
});

