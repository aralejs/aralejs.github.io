
# Position

工具组件，将一个dom节点相对对另一个dom节点进行定位操作。

---


## 使用说明


### position.pin(pinObj, relativeObj)

基础定位方法，接收两个参数。

1. pinObj：定位元素，必选。

	类型为字面量对象 { elem:a, x:10, y:10 }，elem为需定位元素，x和y表示定位元素的定位点。
	
	也可简单写成dom结点 a，相当于 { elem:a, x:0, y:0 }，表示定位点是结点左上角。
	
2. relativeObj：相对定位元素，可选。

	类型为字面量对象 { elem:b, x:10, y:10 }，elem为相对定位元素，x和y表示相对定位元素的定位点。
	
	也可简单写成dom结点 a，相当于 { elem:a, x:0, y:0 }，表示定位点是结点左上角。
	
	当elem缺省时，表示pinObj相对屏幕可见区域的左上角定位。比如可以写成
		
		Position.pin(a, {x:10, y:10});	//这样后一个参数可简单理解为偏移量
		
	或写成
		
		Position.pin({elem:a, x:-10, y:-10});


### position.center

居中定位，接收两个参数，将pinElem定位在relativeElem元素的中央位置。

1. pinElem：定位节点，必选。

2. relativeElem：相对定位节点，可选。缺省时表示将pinElem定位在屏幕中央。


### position.VIEWPORT

当前可视区域的伪元素，当需要相对于当前可视区域定位时，上述参数的elem可传入position.VIEWPORT。

比如相对于屏幕中央定位：

	position.pin(
		{elem:a, x:'center', y:'center'}, 
		{elem:position.VIEWPORT, x:'center', y:'center'}
	);

或写成

	position.center(a, position.VIEWPORT);

