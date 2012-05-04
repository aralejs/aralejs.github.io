
# Position

定位工具组件，将一个dom节点相对于另一个dom节点进行定位操作。

---


## API说明


### position.pin(pinObj, [relativeObj])

基础定位方法，接收两个参数。

1. `pinObj`：目标定位元素，必选。

	类型为字面量对象 { elem:a, x:10, y:10 }，elem为需定位元素，x和y表示定位元素的定位点。
	
	也可简单写成dom节点 a，相当于 { elem:a, x:0, y:0 }，表示定位点是节点左上角。
	
2. `relativeObj`：基准定位元素，可选。

	类型为字面量对象 { elem:b, x:10, y:10 }，elem为基准定位元素，x和y表示基准定位元素的定位点。
	
	也可简单写成dom节点 a，相当于 { elem:a, x:0, y:0 }，表示定位点是节点左上角。
	
	当elem缺省时，表示pinObj相对屏幕可见区域的左上角定位。比如可以写成
		
		Position.pin(a, {x:10, y:10});	//这样后一个参数可简单理解为偏移量
		
	或写成
		
		Position.pin({elem:a, x:-10, y:-10});


### position.center(pinElem, [relativeElem])

居中定位，接收两个参数，将pinElem定位在relativeElem元素的中央位置。

1. `pinElem`：定位节点，必选。

2. `relativeElem`：基准定位节点，可选。缺省时表示将pinElem定位在屏幕中央。


### position.VIEWPORT

当前可视区域的伪元素，当需要相对于当前可视区域定位时，上述参数的elem可传入position.VIEWPORT。

比如相对于屏幕中央定位：

	position.pin(
		{elem:a, x:'center', y:'center'}, 
		{elem:position.VIEWPORT, x:'center', y:'center'}
	);

或写成

	position.center(a, position.VIEWPORT);
	
## 最佳实践

1. 定位元素到可视区域左上角

		position.pin(a, {x:0, y:0});	//后一个参数可理解为偏移量

2. 定位元素到基准元素位置向右偏移20px
	
		position.pin(a, {elem:b, x:'20px', y:0});

3. 定位元素到基准元素下方20像素的位置
	
		position.pin(a, {elem:b, x:0, y:'100%+20px'});

4. 定位元素到可视区域中央

		position.center(a);
	
5. 定位元素到基准元素右方中间位置
	
		position.pin(a, {elem:b, x:'right', y:'center'});
	
	或者
	
		position.pin(a, {elem:b, x:'100%', y:'50%'});

6. 定位元素到可视区域中央

		position.center(a);


