<template>
  <div class="product-card" @click="handleClick">
    <van-image
      :src="product.image"
      width="110"
      height="110"
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
            @click.stop="handleAddCart"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProduct } from '@/composables/useProduct'

// Props定义
const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      // 验证product对象必须包含必要的字段
      return value && ['id', 'name', 'price'].every((key) => key in value)
    }
  },
  // 显示添加购物车按钮
  showAddCart: {
    type: Boolean,
    default: true
  }
})

// Emits定义
const emits = defineEmits(['click', 'add-cart'])

// 使用组合式函数
const { formatPrice, calculateDiscount } = useProduct()

// 计算折扣
const discount = computed(() => {
  if (!props.product.originalPrice) return 0
  return calculateDiscount(props.product.price, props.product.originalPrice)
})

// 事件处理
const handleClick = () => {
  emits('click', props.product)
}

const handleAddCart = () => {
  emits('add-cart', props.product)
}

// 暴露给父组件的方法
defineExpose({
  getProductId: () => props.product.id
})
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.product-card {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid $border-color;

  &__image {
    border-radius: $radius-base;
    overflow: hidden;
  }

  &__info {
    flex: 1;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__name {
    font-size: $font-size-base;
    color: $text-color;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: $font-size-sm;
    color: $text-color-sub;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .current {
      font-size: 16px;
      font-weight: 600;
      color: $primary-color;
    }

    .origin {
      font-size: $font-size-sm;
      color: #999;
      text-decoration: line-through;
    }
  }
}
</style>
