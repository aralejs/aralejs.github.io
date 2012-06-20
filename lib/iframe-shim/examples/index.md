# iframe-shim

<style>
    .cell {
        position:relative;
    }

    .overlay{
        position:absolute;
        width:200px;
        height:50px;
        border:1px solid green;
        background:#fff;
        z-index:10;
    }

    .opacity0{
        filter:alpha(opacity=70);
        -moz-opacity:0.7;
        opacity: 0.7;
    }
</style>

## Example

正常情况，创建一个遮罩

<div id="example1" class="cell">
    <div class="overlay opacity0" style="height:100px;">
        .overlay
    </div>
    <p>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    </p>
    <p>
        <input type="text" />
    </p>
</div>


```javascript
seajs.use(['jquery','#iframe-shim/0.9.2/iframe-shim'], function($, Shim){
    // example1
    new Shim('#example1 .overlay').sync();
});
```


遮罩会根据 DOM 的宽高进行调节

<div id="example2" class="cell">
    <div class="overlay" style="top:100px;">
        .overlay
    </div>
    <p>
        <input type="text" value="" />
        输入宽高，blur 输入框
    </p>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>

</div>

```javascript
seajs.use(['jquery','#iframe-shim/0.9.2/iframe-shim'], function($, Shim){
    //example2
    var shim2 = new Shim('#example2 .overlay').sync();

    $('#example2 input').blur(function(e){
        var value = e.currentTarget.value;

        $('#example2 .overlay').css({
            'height': value,
            'width': value
        });

        shim2.sync();
    });
});
```

遮罩只会遮盖 border 以及内容部分，margin 则不算

<div id="example3" class="cell">
    <div class="overlay" style="border-width:20px;margin:20px;">
        border-width:20px;<br>
        margin:20px;
    </div>
    <p>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    </p>
    <p>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    </p>
</div>

```javascript
seajs.use(['jquery','#iframe-shim/0.9.2/iframe-shim'], function($, Shim){
    // example3
    new Shim('#example3 .overlay').sync();
});
```

实例化不会生成 iframe，调用 sync 后才会创建 <a href="#" id="example4-create">点我遮罩</a>

<div id="example4" class="cell">
    <div class="overlay">
        .overlay
    </div>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>
    <select>
        <option value="option"></option>
    </select>

</div>

```javascript
seajs.use(['jquery','#iframe-shim/0.9.2/iframe-shim'], function($, Shim){
    // example4
    var shim4 = new Shim('#example4 .overlay');
    $('#example4-create').click(function(e){
        e.preventDefault();
        shim4.sync();
    });
});
```
