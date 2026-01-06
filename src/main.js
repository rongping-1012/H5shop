import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { pinia } from './store'
import {
  Form,
  Field,
  CellGroup,
  Search,
  Cell,
  Tabs,
  Tab,
  Stepper,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  List,
  Sidebar,
  SidebarItem,
  Button,
  NavBar,
  Icon,
  Tabbar,
  TabbarItem,
  Sticky,
  Swipe,
  SwipeItem,
  Image as VanImage,
  CountDown,
  AddressList,
  Area,
  Switch,
  ActionSheet,
  Popup,
  Loading,
  Dialog,
  BackTop,
  SwipeCell,
  Tag
} from 'vant'
import 'vant/lib/index.css'
import '@/assets/styles/index.scss'
import lazyLoad from '@/directives/lazyLoad'
import { initPerformance } from '@/utils/performance'

// 创建应用实例
const app = createApp(App)

// 注册全局指令
app.directive('lazy-load', lazyLoad)

// 初始化性能监控（仅开发环境）
if (import.meta.env.DEV) {
  initPerformance()
}

// 使用 pinia
app.use(pinia)

// 设置路由
setupRouter(app)

// 注册常用 Vant 组件
app
  .use(Form)
  .use(Field)
  .use(CellGroup)
  .use(Search)
  .use(Cell)
  .use(Tabs)
  .use(Tab)
  .use(Stepper)
  .use(Radio)
  .use(RadioGroup)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(List)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Sticky)
  .use(Swipe)
  .use(SwipeItem)
  .use(VanImage)
  .use(CountDown)
  .use(AddressList)
  .use(Area)
  .use(Switch)
  .use(ActionSheet)
  .use(Popup)
  .use(Loading)
  .use(Dialog)
  .use(BackTop)
  .use(SwipeCell)
  .use(Tag)

// 挂载应用
app.mount('#app')
