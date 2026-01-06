<template>
  <van-button
    v-bind="$attrs"
    round
    :class="['base-button', type === 'primary' ? 'jd-primary' : '']"
  >
    <slot />
  </van-button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => {
      return ['default', 'primary', 'success', 'warning', 'danger'].includes(value)
    }
  }
})

// 暴露方法给父组件（如果需要）
defineExpose({
  focus: () => {
    // 可以暴露 focus 方法
  }
})
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.base-button {
  &.jd-primary {
    background: $primary-gradient;
    border: none;
    color: #fff;
    box-shadow: 0 10px 28px rgba(225, 37, 27, 0.25);
  }
}
</style>
