<template>
  <div class="user-page">
    <div class="user-header">
      <van-image :src="userInfo?.avatar || defaultAvatar" width="64" height="64" round />
      <div class="info">
        <div class="name">{{ userInfo?.nickname || '未登录' }}</div>
        <div class="phone" v-if="userInfo?.phone">{{ userInfo.phone }}</div>
      </div>
      <BaseButton v-if="!isLogin" size="small" class="btn-login" @click="goLogin">
        去登录
      </BaseButton>
    </div>

    <van-cell-group inset class="user-cells">
      <van-cell title="我的订单" is-link @click="goOrder" />
      <van-cell title="个人资料" is-link @click="goProfile" />
      <van-cell title="收货地址" is-link @click="goAddress" />
      <van-cell title="优惠券" is-link @click="goCoupon" />
    </van-cell-group>

    <van-cell-group inset class="user-cells">
      <van-cell title="客服与帮助" is-link />
      <van-cell title="设置" is-link />
    </van-cell-group>

    <div v-if="isLogin" class="logout-wrap">
      <van-button block round type="danger" @click="handleLogout"> 退出登录 </van-button>
    </div>
    </div>
  </template>
  
  <script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const userStore = useUserStore()

const isLogin = computed(() => userStore.isLogin)
const userInfo = computed(() => userStore.userInfo)
const defaultAvatar = 'https://q6.itc.cn/q_70/images03/20250306/355fba6a5cb049f5b98c2ed9f03cc5e1.jpeg'

const goLogin = () => {
  router.push('/login')
}

const goOrder = () => {
  router.push('/order')
}

const goProfile = () => {
  if (!isLogin.value) {
    goLogin()
    return
  }
  router.push('/user/profile')
}

const goAddress = () => {
  if (!isLogin.value) {
    goLogin()
    return
  }
  router.push('/user/address/list')
}

const goCoupon = () => {
  if (!isLogin.value) {
    goLogin()
    return
  }
  router.push('/coupon')
}

const handleLogout = async () => {
  await userStore.userLogout()
  showToast('已退出登录')
}

import { getUserInfo } from '@/utils/auth'

onMounted(() => {
  if (isLogin.value) {
    // 如果 store 中没有用户信息，从 localStorage 加载
    if (!userInfo.value) {
      userStore.getUserInfo()
    } else {
      // 如果 store 中有用户信息，确保从 localStorage 同步最新数据
      const localUserInfo = getUserInfo()
      if (localUserInfo && localUserInfo.avatar) {
        userStore.userInfo = { ...userStore.userInfo, ...localUserInfo }
      }
    }
  }
})

// 监听路由变化，当从个人资料页面返回时刷新用户信息
import { onActivated } from 'vue'
onActivated(() => {
  if (isLogin.value) {
    // 从 localStorage 重新加载用户信息，确保头像是最新的
    const localUserInfo = getUserInfo()
    if (localUserInfo) {
      userStore.userInfo = { ...userStore.userInfo, ...localUserInfo }
    }
  }
})
  </script>
  
<style lang="scss" scoped>
.user-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.user-header {
  position: relative;
  display: flex;
  align-items: center;
  padding: $spacing-xl $spacing-lg;
  background: linear-gradient(135deg, #ee0a24 0%, #ff3b30 50%, #ff6b81 100%);
  color: #fff;
  overflow: hidden;

  // 背景装饰
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  .van-image {
    position: relative;
    z-index: 1;
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .info {
    flex: 1;
    margin-left: $spacing-base;
    position: relative;
    z-index: 1;
  }

  .name {
    font-size: $font-size-xl;
    font-weight: 600;
    margin-bottom: $spacing-xs;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .phone {
    font-size: $font-size-sm;
    opacity: 0.95;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  .btn-login {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.95);
    color: $primary-color;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: none;
    font-weight: 600;
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.95);
      background: #fff;
    }
  }
}

.btn-login {
  background: $bg-color-white;
  color: $primary-color;
  box-shadow: none;
}

.user-cells {
  margin-top: $spacing-base;
}

.logout-wrap {
  padding: $spacing-lg;
  }
  </style>
