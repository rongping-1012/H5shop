<template>
  <van-button
    v-bind="$attrs"
    round
    :class="['base-button', type === 'primary' ? 'jd-primary' : '']"
  >
    <slot />
  </van-button>
</template>

<script setup lang="ts">
type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

interface Props {
  type?: ButtonType
}

withDefaults(defineProps<Props>(), {
  type: 'default'
})

// 暴露方法给父组件（如果需要）
defineExpose({
  focus: (): void => {
    // 可以暴露 focus 方法
  }
})
</script>

<style lang="scss" scoped>
.base-button {
  &.jd-primary {
    background: $primary-gradient;
    border: none;
    color: #fff;
    box-shadow: 0 10px 28px rgba(225, 37, 27, 0.25);
  }
}
</style>
