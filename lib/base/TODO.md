
## 开发计划

 - 开始时间：04.27
 - 完成时间：05.02


## 零碎记录

还有一个非常有意思的，目前市面上的 OO 方案，除了要手动指定 constructor name 的
（比如 Dojo, Joose 等），其他方案都在调试时存在问题：

<http://limu.iteye.com/blog/1136712>

目前在 SeaJS 里，可以增加 seajs.util.getCurrentModule 方法，然后在 extend 方法里，将
Class 和 module 关联起来，这样就可以直接通过 __meta 信息获取当前类的 文件名、依赖关系等信息。
