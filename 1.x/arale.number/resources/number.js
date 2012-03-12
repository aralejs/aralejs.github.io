/**
 * @name arale.number
 * @class
 * @param {Number} number 要封装的数值
 * @returns {CNumber} 封装后的对象
 * @example
 * $N(123)
 */
var arale = window.arale || require('arale.base');
arale.module('arale.number', (function(){
	
	var CNumber = arale.dblPrototype(new Number(0), function(number){
		this.number = number;
	});
	
	arale.augment(CNumber, {
        /** @lends arale.number.prototype */
		
        /**
         * 等同于toString(16),将数值类型以十六进制的字符串形式返回
         * @param {Number} [num] 数值
         * @example
         * N(22).toColorPart();// return '16'; 
         * @returns {String} 返回处理后的字符串
         */
		toColorPart : function(num){
		    num = num || this.number;
			function R(s,e){
			    var r = [];
			    for(i=s;i<e;i++){
			        r.push(i)
			    }
			    return r;
			}

			function times(str,count) {
			    return count < 1 ? '' : new Array(count + 1).join(str);
			}

			function toPaddedString(num, length, radix) {
			    var string = num.toString(radix || 10);
			    return times('0', (length - string.length)) + string;
			}

			return toPaddedString(num, 2, 16);
		},
		
        /**
         * 使用0将数值填充到要求位数，包括小数点后的精确位数
         * @param {num} length 整数需要补全的位数
         * @param {num} [opt_precision] 小数点后需要补全的位数
         * @example
         * N(123).pad(5,2); //return '00123.00'
         * @returns {String} 返回处理后的字符串
         */
		pad : function(length, opt_precision){
			var s = opt_precision ? this.number.toFixed(opt_precision) : String(this.number);
			var index = s.indexOf('.');  
		    if (index == -1) {
		       index = s.length;
		    }
		    return new Array(Math.max(0, length - index)+1).join('0') + s;
		}
		
	});
	
	CNumber.prototype['toString'] = function(){
		return this.number;
	};
	var NumberFactory = function(number){	
		return new CNumber(number);
	}
	NumberFactory.fn = CNumber.prototype;
	window.N = module.exports = NumberFactory;
	return NumberFactory;
}), '$N');
