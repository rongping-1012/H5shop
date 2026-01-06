<template>
  <div class="base-empty">
    <van-icon name="photo-o" class="base-empty__icon" />
    <div class="base-empty__text">
      <slot>暂无数据</slot>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.base-empty {
  padding: 40px 0;
  text-align: center;
  color: $text-color-light;
  font-size: $font-size-sm;
}

.base-empty__icon {
  font-size: 40px;
  margin-bottom: $spacing-sm;
  color: #ddd;
}
</style>
