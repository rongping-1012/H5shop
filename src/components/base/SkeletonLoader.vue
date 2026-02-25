<template>
  <div class="skeleton-loader">
    <!-- 商品卡片骨架屏 -->
    <div v-if="type === 'product-card'" class="skeleton-product-card">
      <div class="skeleton-image" />
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-title" />
        <div class="skeleton-line skeleton-desc" />
        <div class="skeleton-footer">
          <div class="skeleton-line skeleton-price" />
          <div class="skeleton-icon" />
        </div>
      </div>
    </div>

    <!-- 列表骨架屏 -->
    <div v-else-if="type === 'list'" class="skeleton-list">
      <div
        v-for="i in count"
        :key="i"
        class="skeleton-item"
      >
        <div class="skeleton-line" :style="{ width: `${getRandomWidth()}%` }" />
      </div>
    </div>

    <!-- 自定义骨架屏 -->
    <div v-else class="skeleton-custom">
      <slot>
        <div
          v-for="i in count"
          :key="i"
          class="skeleton-line"
          :style="{ width: `${getRandomWidth()}%` }"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SkeletonLoaderProps {
  type?: 'product-card' | 'list' | 'custom'
  count?: number
  animated?: boolean
}

withDefaults(defineProps<SkeletonLoaderProps>(), {
  type: 'custom',
  count: 3,
  animated: true
})

// 生成随机宽度（用于更自然的骨架屏效果）
const getRandomWidth = (): number => {
  return Math.floor(Math.random() * 40) + 60 // 60% - 100%
}
</script>

<style lang="scss" scoped>
.skeleton-loader {
  width: 100%;
}

// 动画效果
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-animated {
  .skeleton-line,
  .skeleton-image,
  .skeleton-icon {
    animation: skeleton-loading 1.5s ease-in-out infinite;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200px 100%;
  }
}

// 商品卡片骨架屏
.skeleton-product-card {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid $border-color;

  .skeleton-image {
    width: 110px;
    height: 110px;
    border-radius: $radius-base;
    background: #f0f0f0;
    flex-shrink: 0;
  }

  .skeleton-content {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .skeleton-title {
    height: 16px;
    margin-bottom: 8px;
  }

  .skeleton-desc {
    height: 14px;
    width: 60%;
    margin-bottom: 6px;
  }

  .skeleton-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  .skeleton-price {
    height: 18px;
    width: 80px;
  }

  .skeleton-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #f0f0f0;
  }
}

// 列表骨架屏
.skeleton-list {
  .skeleton-item {
    padding: 8px 0;

    .skeleton-line {
      height: 14px;
      background: #f0f0f0;
      border-radius: 4px;
    }
  }
}

// 自定义骨架屏
.skeleton-custom {
  .skeleton-line {
    height: 14px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 基础样式（无动画）
.skeleton-line,
.skeleton-image,
.skeleton-icon {
  background: #f0f0f0;
  border-radius: 4px;
}
</style>
