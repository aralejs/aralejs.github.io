
define(function(require, exports){

    BatchPaste = exports;

    var tempClipboard = null;
    var pasteHandler = function(){};

    // init.
    if(document.addEventListener){
        document.addEventListener("keydown", _keydown, false);
    }else{
        document.attachEvent("onkeydown", _keydown);
    }

    /*
     * make temp clipboard object.
     * @return {HTMLElement<TextArea>}
     */
    function makeTempClipBoard(){
        var clip = document.createElement("textarea");
        clip.style.display = "none";
        clip.style.position = "absolute";
        clip.style.width = "1px";
        clip.style.height = "1px";
        clip.style.left = "-1000px";
        clip.style.top = "-1000px";

        return clip;
    };

    /*
     * keyboard event handler.
     * @param {KeyBoardEvent} evt.
     */
    function _keydown(evt){
        if(!tempClipboard){
            tempClipboard = makeTempClipBoard();
            if(document.body){
                document.body.appendChild(tempClipboard);
            }else{}
        }
        if(!evt.ctrlKey && !evt.metaKey){return;}
        var keyCode = evt.keyCode || evt.which;
        if(86 != keyCode){return;} // v
        tempClipboard.style.display = "block";
        tempClipboard.value = "";
        try{
            tempClipboard.focus();
        }catch(ex){
            throw new Error("BatchPaste error: focus fail.");
        }
        window.setTimeout(function(){_firePaste(evt);}, 50);
        return true;
    };

    /*
     * trigger paste event handler.
     * @param {KeyBoardEvent} evt.
     */
    function _firePaste(evt){
        tempClipboard.style.display = "none";

        var text = tempClipboard.value;
        if("" == text){return false;}
        var elem = evt.srcElement || evt.target;

        pasteHandler.call(elem, text, evt);
    };

    BatchPaste.paste = function(handler){
        if("function" !== typeof handler){return;}
        pasteHandler = handler;
    };
});
