<template>
  <div class="cart-page">
    <!-- 购物车列表（滚动区域） -->
    <div class="cart-scroll-container">
      <div v-if="items.length" class="cart-list">
        <div v-for="item in items" :key="item.id" class="cart-item-wrapper">
          <van-checkbox v-model="item.selected" class="check" />
          <van-swipe-cell class="swipe-cell">
            <div class="cart-item">
              <van-image
                :src="item.image || item.cover"
                width="80"
                height="80"
                fit="cover"
                class="cover"
              />
              <div class="info">
                <div class="name text-ellipsis-2">{{ item.name }}</div>
                <div v-if="item.spec" class="spec text-ellipsis-1">{{ item.spec }}</div>
                <div class="price-row">
                  <span class="price">¥{{ item.price }}</span>
                </div>
                <div class="actions">
                  <van-stepper v-model="item.quantity" integer min="1" @change="changeQty(item)" />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                type="danger"
                text="删除"
                class="delete-button"
                @click="remove(item)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <BaseEmpty v-else> 购物车还是空的，去逛逛吧～ </BaseEmpty>
    </div>

    <!-- 底部结算栏：紧贴 tabbar 上方 -->
    <div v-if="items.length" class="cart-bottom">
      <div class="left">
        <van-checkbox v-model="allChecked" @change="toggleAll">全选</van-checkbox>
      </div>
      <div class="summary">
        <div class="total">
          合计：<span class="amount">¥{{ selectedAmount }}</span>
        </div>
        <div class="count">已选 {{ selectedCount }} 件</div>
      </div>
      <van-button type="danger" round class="btn-submit" @click="submitOrder">
        去结算
      </van-button>
    </div>
  </div>
</template>
  
<script setup>
// 脚本逻辑保持不变
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast, showToast } from 'vant'
import { useCartStore } from '@/store/modules/cart'
import { createOrder } from '@/api/order'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const router = useRouter()
const cartStore = useCartStore()

const items = computed(() => cartStore.cartList)

const selectedItems = computed(() => items.value.filter((item) => item.selected))
const selectedCount = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
)
const selectedAmount = computed(() =>
  selectedItems.value
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2)
)

const allChecked = computed({
  get() {
    return items.value.length > 0 && items.value.every((item) => item.selected)
  },
  set(val) {
    items.value.forEach((item) => {
      item.selected = val
    })
  }
})

const toggleAll = (val) => {
  allChecked.value = val
}

const changeQty = (item) => {
  cartStore.updateItemQuantity(item.id, item.quantity)
}

const remove = (item) => {
  cartStore.removeItem(item.id)
}

const submitOrder = async () => {
  if (!selectedItems.value.length) {
    showToast('请先选择要结算的商品')
    return
  }

  try {
    const payload = {
      items: selectedItems.value,
      amount: Number(selectedAmount.value)
    }
    await createOrder(payload)
    showToast('订单已创建')
    selectedItems.value.forEach((it) => {
      cartStore.removeItem(it.id)
    })
    router.push('/order')
  } catch (error) {
    console.error('创建订单失败:', error)
    showFailToast('创建订单失败')
  }
}

onMounted(() => {
  cartStore.fetchCartList()
})
</script>
  
<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;

// 页面容器：占满父容器，禁止整体滚动
.cart-page {
  width: 100%;
  height: 100%;
  background: $bg-color-light;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

// 滚动容器：占满高度 + 底部内边距（避开结算栏）
.cart-scroll-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: $spacing-sm $spacing-base;
  // 关键：底部内边距 = 结算栏高度 + 安全区域，避免内容被遮挡
  padding-bottom: calc(54px + 10px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.cart-list {
  padding-bottom: $spacing-lg;
}

.cart-item-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-base;
  background: $bg-color-white;
  border-radius: $radius-base;
  overflow: hidden;

  .check {
    flex-shrink: 0;
    padding: 0 $spacing-base;
  }
}

.swipe-cell {
  flex: 1;
  min-width: 0;

  :deep(.van-swipe-cell__wrapper) {
    border-radius: 0;
  }
}

.cart-item {
  display: flex;
  padding: $spacing-base;
  background: $bg-color-white;
}

.cover {
  border-radius: $radius-base;
  overflow: hidden;
}

.info {
  flex: 1;
  margin-left: $spacing-base;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-size: $font-size-base;
  color: $text-color-dark;
  margin-bottom: $spacing-xs;
  @include text-ellipsis(2);
}

.spec {
  font-size: $font-size-sm;
  color: $text-color-light;
  margin-bottom: $spacing-xs;
  @include text-ellipsis(1);
}

.price-row {
  font-size: $font-size-base;
  color: $primary-color;
  margin-bottom: 6px;
}

.actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.delete-button {
  height: 100%;
  min-width: 80px;
}

// 结算栏：固定定位 + 紧贴 tabbar 上方
.cart-bottom {
  position: fixed;
  left: 0;
  right: 0;
  // 核心：bottom 值 = tabbar 高度（一般 50px） + 安全区域
  bottom: calc(50px + env(safe-area-inset-bottom));
  height: 54px;
  background: $bg-color-white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-base;
  box-shadow: $box-shadow-medium;
  z-index: 1001;
  // 适配安全区域，防止底部被遮挡
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
}

.summary {
  font-size: $font-size-sm;
  color: $text-color-normal;
}

.amount {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $primary-color;
}

.btn-submit {
  min-width: 110px;
}
</style>