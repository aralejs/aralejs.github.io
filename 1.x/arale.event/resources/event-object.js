/**
 * @name arale.event.object
 * @namespace
 * 事件对象的封装,包括自定义事件和dom事件
 * @description
 * 可以直接使用$E.来操作方法
 */
var arale = require('arale.base'),
    $A = require('arale.array');

arale.module('arale.event.object', (function(arale) {
    //fix delete currentTarget
    var doc = document,
        props = 'altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' ');
    var EventObject = function(target, domEvent) {
        this.currentTarget = target;
        this.originalEvent = domEvent || {};
        //TODO如果自定义事件对象的处理
        if (domEvent && domEvent.type) {
            this.type = domEvent.type;
            this._fix();
        } else {
            this.type = domEvent;
            this.target = target;
        }
    };
    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }
    arale.augment(EventObject, /** @lends arale.event.object */ {
        _fix: function(event) {
               var that = this, originalEvent = this.originalEvent, l = props.length,
             prop, ct = this.currentTarget,
            ownerDoc = (ct.nodeType === 9) ? ct : (ct.ownerDocument || doc); // support iframe
            // clone properties of the original event object
            while (l) {
                prop = props[--l];
                that[prop] = originalEvent[prop];
            }
            // fix target property, if necessary
            if (!that.target) {
                that.target = that.srcElement || doc; // srcElement might not be defined either
            }
            // check if target is a textnode (safari)
            if (that.target.nodeType === 3) {
                that.target = that.target.parentNode;
            }
            // add relatedTarget, if necessary
            if (!that.relatedTarget && that.fromElement) {
                that.relatedTarget = (that.fromElement === that.target) ? that.toElement : that.fromElement;
            }
            // calculate pageX/Y if missing and clientX/Y available
            if (that.pageX === undefined && that.clientX !== undefined) {
                var docEl = ownerDoc.documentElement, bd = ownerDoc.body;
                that.pageX = that.clientX + (docEl && docEl.scrollLeft || bd && bd.scrollLeft || 0) - (docEl && docEl.clientLeft || bd && bd.clientLeft || 0);
                that.pageY = that.clientY + (docEl && docEl.scrollTop || bd && bd.scrollTop || 0) - (docEl && docEl.clientTop || bd && bd.clientTop || 0);
            }
            // add which for key events
            if (!that.which) {
                that.which = (that.charCode) ? that.charCode : that.keyCode;
            }
            // add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if (that.metaKey === undefined) {
                that.metaKey = that.ctrlKey;
            }
            // add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if (!that.which && that.button !== undefined) {
                that.which = (that.button & 1 ? 1 : (that.button & 2 ? 3 : (that.button & 4 ? 2 : 0)));
            }
        },
        /**
         * 阻止事件原有的行为
         * @example
         * $E.connect(d,"onclick",function(e){e.preventDefault()});
         */
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if (!e) {
                return;
            }
            // if preventDefault exists run it on the original event
            if (e.preventDefault) {
                e.preventDefault();
            }
            // otherwise set the returnValue property of the original event to false (IE)
            else {
                e.returnValue = false;
            }

            this.isDefaultPrevented = true;
        },
        /**
         * 阻止事件冒泡
         * @example
         * $E.connect(d,"onclick",function(e){e.stopPropagation()});
         */
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if(!e) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            else {
                e.cancelBubble = true;
            }
        },
        /**
         *    Stops the propagation to the next bubble target and
         * prevents any additional listeners from being exectued
         * on the current target.
         * @example
         *  $E.connect(d,"onclick",function(e){e.stopImmediatePropagation()});
         */
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        /**
         * Stops the event propagation and prevents the default
         * event behavior.
         * @param immediate {boolean} if true additional listeners
         * on the current target will not be executed
         * @example
         *  $E.connect(d,"onclick",function(e){e.halt()});
         */
        halt: function(immediate) {
            if (immediate) {
                this.stopImmediatePropagation();
            } else {
                this.stopPropagation();
            }

            this.preventDefault();
        },
        stopEvent: function(evt) {
            this.stopPropagation();
            this.preventDefault();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    });
    var exportsObject = {
        /**
         * 根据一个原生的事件对象,获取一个事件包装对象,主要是为了fix一些浏览器的差异
         * @memberOf arale.event.object
         * @param {Object || Node || String } target Node对象或者 element ID 或者普通的Object
         * @param {Event} event 原生的事件对象
         * @example
         * var e = e || window.event;
         * var eobject = $E.getEventObject(source,e);
         */
        getEventObject: function(target, event) {
            return new EventObject(target, event);
        }
    };
    return exportsObject;
})(arale), 'exports', module);
