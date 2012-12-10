define("afc163/word-color/1.0.0/word-color-debug", [], function(require, exports, module) {

    var MAGIC_NUMBER = 5;

    var COLOR_LIMITE = 242;

    var wordColor = function(word) {

        word = word.trim();
        var rgb = [0, 0, 0];
        
        for (var i=0; i<word.length; i++) {
            var level = parseInt(i/rgb.length);
            rgb[i%3] += parseInt(getAHashNum(word[i]) / getRatio(level));
        }
        for (var j=0; j<rgb.length; j++) {
            if (rgb[j] > 255) {
                rgb[j] = 255;
            }
        }

        return 'rgb(' + rgb.join(',') + ')';

    };
    
    function getRatio(level) {
        return Math.pow(MAGIC_NUMBER, level);         
    }

    function getAHashNum(char) {
        return parseInt((char.charCodeAt() << MAGIC_NUMBER) % COLOR_LIMITE);
    }

    module.exports = wordColor;

});

