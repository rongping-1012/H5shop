<template>
  <div class="not-found">
    <van-empty image="error" description="页面不存在" />
    <div class="back-btn">
      <van-button type="primary" @click="goHome">返回首页</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace('/')
}
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: $bg-color-light;
}

.back-btn {
  margin-top: $spacing-xl;
  width: 200px;
}
</style>
