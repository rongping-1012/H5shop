<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      v-if="showNavBar"
      :title="title"
      :left-arrow="showBack"
      @click-left="onClickLeft"
      fixed
      placeholder
      :z-index="1000"
    >
      <template #right>
        <slot name="nav-right">
          <van-icon name="search" size="18" @click="onClickSearch" />
        </slot>
      </template>
    </van-nav-bar>

    <!-- 页面内容 -->
    <main class="main-container" :class="{ 'with-tabbar': showTabBar, 'with-navbar': showNavBar }">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="cachedViews">
          <component
            v-if="Component"
            :is="Component"
            :key="route.fullPath"
          />
        </keep-alive>
      </router-view>
    </main>

    <!-- 底部导航 -->
    <van-tabbar v-model="active" route v-if="showTabBar" placeholder>
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/category" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item replace to="/cart" icon="cart-o" :badge="cartCount > 0 ? cartCount : ''"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item replace to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/store/modules/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const active = ref(0)

// 需要显示底部导航的路径
const tabBarPaths = ['/home', '/category', '/cart', '/user']

// 计算属性
const showNavBar = computed(() => route.meta.showNavBar !== false)
const showTabBar = computed(() => tabBarPaths.includes(route.path))
const title = computed(() => route.meta.title || '掌上优选')
const showBack = computed(() => route.meta.showBack || false)
const cachedViews = computed(() => ['Home', 'Category', 'Cart', 'User'])

// 购物车数量
const cartCount = computed(() => {
  return cartStore.totalCount
})

// 方法
const onClickLeft = () => {
  if (route.meta.back) {
    router.push(route.meta.back)
  } else {
    router.back()
  }
}

const onClickSearch = () => {
  router.push('/search')
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    // 更新底部导航激活项
    const index = tabBarPaths.findIndex((path) => path === newPath)
    if (index !== -1) {
      active.value = index
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
  .layout-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden; // 新增：禁止布局容器滚动
  }
  
  .main-container {
    flex: 1; // 关键：用 flex:1 替代 min-height:100vh，让内容自适应
    overflow: hidden; // 新增：禁止 main 容器滚动
    padding-bottom: 0; // 移除默认 padding，改为在子页面处理
  
    &.with-tabbar {
      // 仅标记，不在这加 padding，让子页面自己计算
    }
  }
  
  // 移除 safe-area-inset-bottom 的全局 padding，让子页面适配
  
  // 顶部导航栏图标颜色
  :deep(.van-nav-bar) {
    .van-icon {
      color: $primary-color;
    }
  
    .van-nav-bar__arrow {
      color: $primary-color;
    }
  }
  
  // 底部导航栏激活状态颜色
  :deep(.van-tabbar-item--active) {
    color: $primary-color;
    .van-icon {
      color: $primary-color;
    }
  }
  </style>