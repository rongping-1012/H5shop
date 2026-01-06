## 掌上优选 H5 商城项目介绍

### 项目概述

**掌上优选**是一个基于 **Vue 3 + Vite + Pinia + Vue Router + Vant** 搭建的移动端电商 H5 项目，主要用于演示一个完整的购物流程，包括首页展示、商品列表与详情、购物车、下单与支付、优惠券、收货地址管理、用户登录注册及个人资料等功能。

项目采用组件化、模块化的工程结构，并结合组合式 API 与自定义组合式函数（`composables`），方便后期扩展和维护。

### 技术栈

- **前端框架**：Vue 3（Composition API）
- **构建工具**：Vite
- **路由管理**：Vue Router
- **状态管理**：Pinia（含持久化插件）
- **UI 组件库**：Vant
- **样式方案**：
  - SCSS + 自定义变量（`variables.scss`）
  - 全局混入与工具类（`mixins.scss`、`utilities.scss`）
- **网络请求**：Axios（二次封装，统一拦截与错误处理）

### 主要功能模块

- **首页模块**（`views/Home/Index.vue`）
  - 轮播 banner、分类入口
  - 限时抢购区块、推荐商品列表（支持下拉加载更多）
  - 返回顶部按钮与滚动监听
- **商品模块**
  - 列表页：`views/Goods/List.vue`
  - 详情页：`views/Goods/Detail.vue`
  - 复用业务组件 `ProductCard.vue`
- **购物车模块**（`views/Cart/index.vue` + `store/modules/cart.js`）
  - 购物车列表、数量编辑、勾选/全选、合计金额计算
  - 创建订单（使用 `api/order.js` 的 mock 接口）
- **订单模块**（`views/Order/Index.vue`、`views/Order/Pay.vue`）
  - 订单列表、订单详情与支付流程（mock）
- **用户与认证模块**
  - 登录/注册页（`views/Login`）
  - 用户中心（`views/User/index.vue`）
  - 个人资料编辑（`views/User/Profile.vue`）
  - 基于 Token 的路由守卫（`router/guard.js` + `utils/auth.js`）
- **地址与优惠券模块**
  - 地址列表与编辑（`views/User/AddressList.vue`、`AddressEdit.vue`）
  - 优惠券列表与选择（`views/Coupon/Index.vue`）
- **搜索与分类模块**
  - 搜索页（`views/Search/Index.vue`）
  - 分类页（`views/Category/index.vue`）

### 目录结构简述（src）

- `api/`：接口模块封装（用户、商品、订单、购物车、地址等），部分采用 mock 数据，方便本地开发与联调前演示。
- `views/`：页面级组件，按业务模块划分（Home、Goods、Cart、Order、User、Login 等）。
- `components/`：
  - `base/`：基础通用组件（如 `BaseButton`、`BaseEmpty`）
  - `business/`：业务相关组件（如商品卡片）
- `store/`：Pinia Store 定义以及模块划分（用户、购物车、地址等）。
- `router/`：路由配置与路由守卫，包含基础路由与模块化子路由。
- `composables/`：组合式函数，如 `useCart`、`useProduct`、`useRequest`、`useStorage`、`useScrollRestoration` 等。
- `utils/`：工具类方法，如 `request` 封装、`auth` 工具、性能监控工具 `performance.js`。
- `assets/styles/`：全局样式与 SCSS 变量、混入、工具类。

### 接口与 Mock 说明

- 统一通过 `utils/request.js` 中的 `createApi` 生成模块化 API 实例。
- 商品、订单等模块默认使用 **mock 数据**（如 `api/goods.js`、`api/order.js`），方便在无真实后端的情况下快速体验完整流程。
- 若需要切换为真实接口，可在对应 `api` 文件中将真实接口调用替换 mock 逻辑。

### 性能与体验优化

- 在 `utils/performance.js` 中封装了性能监控工具：
  - 资源加载性能监控
  - 长任务（Long Task）监控
  - 页面加载关键指标采集
- `main.js` 中在开发环境下初始化性能监控，避免对生产环境产生额外开销。
- 使用 `pinia-plugin-persistedstate` 对关键数据（如用户信息、购物车）做本地持久化，提高用户体验。
- 多处使用组合式函数与复用组件，减少重复代码，优化开发体验。

### 适用场景

- 前端学习与实战演示：适合作为 Vue 3 + Vite + Vant 移动端电商项目的示例。
- 电商项目脚手架：可以在此基础上接入真实后端接口，扩展为实际业务项目。
- 组件与样式复用：可直接复用其中的移动端页面布局、表单、列表、卡片、导航等 UI 设计。


