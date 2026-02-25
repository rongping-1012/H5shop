<template>
  <div class="product-card" @click="handleClick">
    <van-image
      :src="product.image"
      width="100"
      height="100"
      fit="cover"
      class="product-card__image"
    />
    <div class="product-card__info">
      <div class="product-card__name text-ellipsis-2">
        {{ product.name }}
      </div>
      <div v-if="product.desc" class="product-card__desc text-ellipsis">
        {{ product.desc }}
      </div>
      <div class="product-card__bottom">
        <div class="product-card__price">
          <span class="current">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="origin">{{ formatPrice(product.originalPrice) }}</span>
        </div>
        <slot name="action">
          <van-icon
            v-if="showAddCart"
            name="cart-circle"
            color="#e1251b"
            size="22"
            class="product-card__cart-icon"
            @click.stop="handleAddCart"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProduct } from '@/composables/useProduct'
import type { Goods } from '@/types'

// Props定义
interface Props {
  product: Goods
  showAddCart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddCart: true
})

// Emits 定义
const emit = defineEmits<{
  (e: 'click', product: Goods): void
  (e: 'add-cart', product: Goods): void
}>()

// 使用组合式函数
const { formatPrice } = useProduct()

// 事件处理
const handleClick = (): void => {
  emit('click', props.product)
}

const handleAddCart = (): void => {
  emit('add-cart', props.product)
}

// 暴露给父组件的方法
defineExpose({
  getProductId: (): number => props.product.id
})
</script>

<style lang="scss" scoped>
.product-card {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid $border-color;

  &__image {
    width: 100px !important;
    height: 100px !important;
    min-width: 100px !important;
    max-width: 100px !important;
    flex-shrink: 0;
    border-radius: $radius-base;
    overflow: hidden;
    
    :deep(img) {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0; // 防止 flex 子元素溢出
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; // 防止内容溢出
  }

  &__name {
    font-size: $font-size-base;
    color: $text-color;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $text-color-sub;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    gap: 8px;
    min-width: 0; // 防止 flex 子元素溢出
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    flex-shrink: 0; // 价格区域不收缩
    min-width: 0; // 允许内部文本省略

    .current {
      font-size: 16px;
      font-weight: 600;
      color: $primary-color;
      white-space: nowrap;
    }

    .origin {
      font-size: $font-size-sm;
      color: #999;
      text-decoration: line-through;
      white-space: nowrap;
    }
  }

  &__cart-icon {
    flex-shrink: 0; // 购物车图标不收缩
  }
}
</style>
