
# Events 竞争对手分析

- 在 DOM 事件的封装上，YUI3 最强大，并带有很强的学术性。jQuery 则非常实用。还有其他一些类库，比如
KISSY、QWrap 等，都大同小异。

- 在 Arale 里，与 DOM 相关的事件，直接采用 jQuery 来实现。该 Events 模块仅提供非常纯粹的事件驱动机制。

- 与该模块定位相同的同类产品有：Backbone.Events, NodeJS 的 EventEmitter 等。

- NodeJS 的 EventEmitter 功能点较多，主要考虑服务器端。

- Backbone 的 Events 定位与我们最像，同时也考虑了与 jQuery API 风格的一致性，非常不错。

- 该 Events 模块会重点借鉴 Backbone.Events. 在 API 上会有少量调整，以与 Arale
整体设计风格保持一致。
