# Position

## Example

<style>
.elem1 {
    border:1px solid green;
    background-color:#C7FFBB;
}
.elem2 {
    border:20px solid #999;
    background-color:#eee;
    width:300px;
    height:200px;
    margin:50px 0 0 100px;
    line-height:200px;
    text-align:center;
}
</style>

### 1. 基本情况

<div class="cell">
    <div id="a1" class="elem1">目标元素a1</div>
    <div id="b1" class="elem2">基准元素b1</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin('#a1', {element: '#b1', x: '50px', y: '50px'});
});
```

### 2. 目标元素的offsetParent不为body

<div class="cell">
    <div style="position:relative;margin:20px;border:20px red solid;padding:10px;">
        <div id="a2" style="position:absolute;top:0;left:0;" class="elem1">目标元素a2</div>
        <div id="b2" class="elem2">基准元素b2</div>
    </div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin('#a2', {element: '#b2', x: 50, y: 50});
});
```


### 3. 目标元素带偏移量 

<div class="cell">
    <div id="b3" class="elem2">基准元素b3</div>    
    <div id="a3" class="elem1">目标元素a3</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin({element: '#a3', x: -50, y: -50}, {element: '#b3'});
});
```


### 4. 偏移量为left|center|top|%的情况

<div class="cell">
    <div id="b4" class="elem2">基准元素b4</div>
    <div id="a4" class="elem1">目标元素a4</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin({element: '#a4', x: 'center', y: '50%'}, {element: '#b4', x: '100%', y: '50%'});
});
```


### 5. 定位到元素中央 

<div class="cell">
    <div id="b5" class="elem2">基准元素b5</div>    
    <div id="a5" class="elem1">目标元素a5</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.center('#a5', '#b5');
});
```


### 6. 相对可见区域定位 

<div class="cell">
    <div id="a6" class="elem1">目标元素a6</div>
    <input type="button" id="J_rePosition6" value="点击重定位">
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin('#a6', {x: 50,y: 50});

    document.getElementById('J_rePosition6').onclick = function() {
        Position.pin('#a6', {x: 50,y: 50});
    };
});
```


### 7. 定位到屏幕中央 

<div class="cell">
    <div id="a7" class="elem1">目标元素a7</div>
    <input type="button" id="J_rePosition7" value="点击重定位">
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.center('#a7');

    document.getElementById('J_rePosition7').onclick = function() {
        Position.center('#a7');
    };
});
```


### 8. 处理类似于100%+20px这样的定位 

<div class="cell">
    <div id="a8" class="elem1">目标元素a8</div>
    <div id="b8" class="elem2">基准元素b8</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin('#a8', {element: '#b8', x: '100%+50px', y: '50%-50'});
});
```


### 9. 相对于自身定位 

<div class="cell">
    <div id="a9" class="elem1">目标元素a9</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin('#a9', {element: '#a9', x: '100%', y: '-100%'});
});
```


### 10. 定位fixed元素 

<div class="cell">
    <div id="a10" class="elem1" style="position:fixed;">目标元素a10</div>
</div>

```javascript
seajs.use(['position'], function(Position) {
    Position.pin('#a10', { x: 400, y: 0 });
});
```


