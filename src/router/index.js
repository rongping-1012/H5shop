import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import Home from '../views/Home/Index.vue'
import Layout from '../layouts/DefaultLayout.vue'

// 基础路由
export const basicRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          icon: 'home-o',
          keepAlive: true
        }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/Category/Index.vue'),
        meta: {
          title: '分类',
          icon: 'apps-o',
          keepAlive: true
        }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/Cart/Index.vue'),
        meta: {
          title: '购物车',
          icon: 'cart-o',
          keepAlive: true
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/User/Index.vue'),
        meta: {
          title: '我的',
          icon: 'user-o',
          keepAlive: true
        }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search/Index.vue'),
        meta: {
          title: '搜索',
          showTabBar: false
        }
      },
      {
        path: 'goods/list',
        name: 'GoodsList',
        component: () => import('@/views/Goods/List.vue'),
        meta: {
          title: '商品列表',
          showTabBar: false
        }
      },
      {
        path: 'goods/detail',
        name: 'GoodsDetail',
        component: () => import('@/views/Goods/Detail.vue'),
        meta: {
          title: '商品详情',
          showTabBar: false
        }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/Order/Index.vue'),
        meta: {
          title: '订单列表',
          showTabBar: false
        }
      },
      {
        path: 'order/pay',
        name: 'OrderPay',
        component: () => import('@/views/Order/Pay.vue'),
        meta: {
          title: '支付订单',
          showTabBar: false
        }
      },
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: () => import('@/views/User/Profile.vue'),
        meta: {
          title: '个人资料',
          showTabBar: false
        }
      },
      {
        path: 'user/address/list',
        name: 'AddressList',
        component: () => import('@/views/User/AddressList.vue'),
        meta: {
          title: '收货地址',
          showTabBar: false
        }
      },
      {
        path: 'user/address/edit',
        name: 'AddressEdit',
        component: () => import('@/views/User/AddressEdit.vue'),
        meta: {
          title: '编辑地址',
          showTabBar: false
        }
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('@/views/Coupon/Index.vue'),
        meta: {
          title: '我的优惠券',
          showTabBar: false
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      showNavBar: false,
      showTabBar: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Login/Register.vue'),
    meta: {
      title: '注册',
      hidden: true,
      showNavBar: false,
      showTabBar: false
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: basicRoutes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export function setupRouter(app) {
  app.use(router)
  setupRouterGuard(router)
  return app
}

export default router
