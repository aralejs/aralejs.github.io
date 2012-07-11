
# Chosen

模拟 select

---


## 模块依赖

* jquery
* popup


## API 说明

### trigger

trigger 可以为 select 或 任何 DOM。

如果为 select，会将其隐藏并按照 `triggerTemplate` 生成一个 DOM 放在原来的位置。

如果为 DOM，则不做处理。

### prefix

样式前缀，默认为 ui-chosen

### triggerTemplate

trigger 的模版，只有当 trigger 为 select 时才会使用。

### template

生成 select 的模版，数据源为 model。

model 的来源有两处

1. 初始化传入
2. 如果 trigger 为 select，则会根据结构生成 model

### value

select 的值，等同于 select.value

### multiple

// TODO

### disabled

select 是否 disabled，如果 disabled 则点击无效。

### select(selector)

选中某项，selector 支持三种

1. 列表索引，为 Number
2. 选择器
3. DOM


### syncModel(model)

重新渲染 select，model 为对应 select 的数据。



