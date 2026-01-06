<template>
  <div class="auth-page">
    <div class="hero">
      <div class="logo">优选</div>
      <div>
        <div class="brand">掌上优选</div>
        <div class="slogan">好物随心选，惊喜直达</div>
      </div>
    </div>

    <div class="auth-card">
      <div class="auth-title">登录</div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
        <div class="auth-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            class="jd-primary"
          >
          登录
        </van-button>
          <div class="link-row">
            <span class="link" @click="toForgot">忘记密码</span>
            <span class="divider">|</span>
            <span>还没有账号？</span>
            <span class="link" @click="toRegister">去注册</span>
          </div>
      </div>
    </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { showSuccessToast, showFailToast, showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

const onSubmit = async (values) => {
  try {
    loading.value = true
    await userStore.login(values)
    showSuccessToast('登录成功')
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } catch (error) {
    console.error('登录失败:', error)
    showFailToast(error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const toRegister = () => {
  router.push({ path: '/register', query: { redirect: route.query.redirect } })
}

const toForgot = () => {
  showToast('忘记密码功能暂未开通')
}
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e1 100%);
  padding: 32px $spacing-lg 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero {
  width: 100%;
  max-width: 520px;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.logo {
  width: 52px;
  height: 52px;
  border-radius: $radius-lg;
  background: linear-gradient(180deg, #ff4f42 0%, $primary-color 100%);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: $box-shadow-primary;
}

.brand {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $primary-color;
}

.slogan {
  font-size: $font-size-sm;
  color: $text-color-normal;
  margin-top: $spacing-xs;
}

.auth-card {
  width: 100%;
  max-width: 520px;
  background: $bg-color-white;
  border-radius: $radius-lg;
  padding: $spacing-xl $spacing-lg $spacing-xl;
  box-shadow: $box-shadow-heavy;
}

.auth-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: $spacing-lg;
  text-align: center;
  color: #222;
}

.auth-actions {
  margin: $spacing-lg $spacing-sm $spacing-xs;
}

.link-row {
  margin-top: $spacing-base;
  text-align: center;
  color: $text-color-light;
  font-size: $font-size-base;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.link {
  color: $primary-color;
}

.divider {
  color: #ddd;
}

.jd-primary {
  background: $primary-gradient;
  border: none;
  box-shadow: $box-shadow-primary;
}
</style>
