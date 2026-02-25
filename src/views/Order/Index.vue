<template>
  <div class="order-page">
    <van-tabs v-model:active="activeStatus" sticky>
      <van-tab title="全部" name="all" />
      <van-tab title="待支付" name="pending" />
      <van-tab title="已完成" name="finished" />
      <van-tab title="已取消" name="cancelled" />
    </van-tabs>

    <div class="order-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <span>订单号：{{ order.id }}</span>
          <span class="status">{{ statusText(order.status) }}</span>
        </div>

        <!-- 商品信息 -->
        <div class="order-card__goods">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="goods-row"
          >
            <van-image
              :src="item.image || item.cover"
              width="60"
              height="60"
              fit="cover"
              class="goods-cover"
            />
            <div class="goods-info">
              <div class="goods-name text-ellipsis-2">{{ item.name }}</div>
              <div class="goods-meta">
                <span class="price">¥{{ item.price }}</span>
                <span class="qty">x{{ item.quantity || 1 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-card__body">
          <div class="amount">
            实付：¥{{ order.amount }}
            <span v-if="order.couponDiscount && order.couponDiscount > 0" class="coupon-deduction">
              (优惠券抵扣¥{{ order.couponDiscount }})
            </span>
          </div>
          <div class="time">下单时间：{{ formatTime(order.createdAt) }}</div>
        </div>
        <div class="order-card__footer">
          <van-button
            v-if="order.status === 'pending'"
            size="small"
            class="btn-cancel"
            @click="handleCancel(order)"
          >
            取消订单
          </van-button>
          <van-button
            v-if="order.status === 'pending'"
            size="small"
            type="danger"
            @click="goPay(order)"
          >
            去支付
          </van-button>
          <van-button
            v-if="order.status === 'finished'"
            size="small"
            type="primary"
            @click="handleRebuy(order)"
          >
            再次购买
          </van-button>
        </div>
      </div>

      <BaseEmpty v-if="!orders.length"> 暂无订单 </BaseEmpty>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast, showToast } from 'vant'
import { getOrderList, cancelOrder, createOrder } from '@/api/order'
import { useCartStore } from '@/store/modules/cart'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const router = useRouter()
const cartStore = useCartStore()
const orders = ref([])
const activeStatus = ref('all')
const cancelTimers = ref(new Map()) // 存储每个订单的取消定时器

const fetchOrders = async () => {
  try {
    const res = await getOrderList()
    if (res.code === 200) {
      orders.value = res.data || []
      // 为每个待支付订单设置3分钟自动取消定时器
      setupAutoCancelTimers()
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    showFailToast('获取订单列表失败')
  }
}

// 设置自动取消定时器
const setupAutoCancelTimers = () => {
  // 清除所有旧的定时器
  cancelTimers.value.forEach((timer) => clearTimeout(timer))
  cancelTimers.value.clear()

  const now = Date.now()
  const threeMinutes = 3 * 60 * 1000 // 3分钟

  orders.value.forEach((order) => {
    if (order.status === 'pending' && order.createdAt) {
      const elapsed = now - order.createdAt
      const remaining = threeMinutes - elapsed

      if (remaining > 0) {
        // 如果还有剩余时间，设置定时器
        const timer = setTimeout(async () => {
          try {
            await cancelOrder(order.id)
            showToast(`订单 ${order.id} 已自动取消（超时未支付）`)
            fetchOrders() // 重新获取订单列表
          } catch (error) {
            console.error('自动取消订单失败:', error)
          }
        }, remaining)

        cancelTimers.value.set(order.id, timer)
      } else {
        // 如果已经超过3分钟，立即取消
        cancelOrder(order.id).then(() => {
          fetchOrders()
        })
      }
    }
  })
}

const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') return orders.value
  return orders.value.filter((o) => o.status === activeStatus.value)
})

const statusText = (status) => {
  switch (status) {
    case 'pending':
      return '待支付'
    case 'finished':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return '未知状态'
  }
}

const formatTime = (ts) => {
  const d = new Date(ts)
  const pad = (n) => (n < 10 ? `0${n}` : n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

const handleCancel = async (order) => {
  try {
    await cancelOrder(order.id)
    showToast('订单已取消（mock）')
    fetchOrders()
  } catch (error) {
    showFailToast('取消订单失败')
  }
}

const goPay = (order) => {
  router.push({
    path: '/order/pay',
    query: { id: order.id }
  })
}

// 再次购买
const handleRebuy = async (order) => {
  try {
    if (!order.items || order.items.length === 0) {
      showFailToast('订单中没有商品')
      return
    }

    // 将订单商品添加到购物车
    for (const item of order.items) {
      await cartStore.addItemToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || item.cover,
        cover: item.image || item.cover,
        quantity: item.quantity || 1
      })
    }

    // 创建新订单并跳转到支付页面
    const payload = {
      items: order.items,
      amount: order.amount
    }
    const res = await createOrder(payload)
    if (res.code === 200) {
      showToast('已加入购物车，正在跳转支付')
      router.push({
        path: '/order/pay',
        query: { id: res.data.id }
      })
    }
  } catch (error) {
    console.error('再次购买失败:', error)
    showFailToast('再次购买失败')
  }
}

let checkInterval = null

onMounted(() => {
  fetchOrders()
  // 每30秒检查一次是否有订单需要自动取消
  checkInterval = setInterval(() => {
    setupAutoCancelTimers()
  }, 30000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
  // 清除所有定时器
  cancelTimers.value.forEach((timer) => clearTimeout(timer))
  cancelTimers.value.clear()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;


.order-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.order-list {
  padding: $spacing-sm $spacing-base $spacing-lg;
}

.order-card {
  background: $bg-color-white;
  border-radius: $radius-base;
  padding: $spacing-base $spacing-base $spacing-sm;
  margin-bottom: $spacing-base;
  box-shadow: $box-shadow-light;
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  font-size: $font-size-sm;
  color: $text-color-normal;
  margin-bottom: 6px;
}

.status {
  color: $primary-color;
}

.order-card__body {
  font-size: $font-size-sm;
  color: $text-color-dark;
  margin-bottom: $spacing-sm;
}

.order-card__goods {
  padding: $spacing-xs 0 6px;
  border-top: 1px solid $border-color-light;
  border-bottom: 1px solid $border-color-light;
  margin-bottom: 6px;
}

.goods-row {
  display: flex;
  padding: 6px 0;
}

.goods-cover {
  border-radius: $radius-sm;
  overflow: hidden;
}

.goods-info {
  flex: 1;
  margin-left: $spacing-sm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-name {
  font-size: $font-size-sm;
  color: $text-color-dark;
  margin-bottom: $spacing-xs;
  @include text-ellipsis(2);
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  font-size: $font-size-sm;
  color: $text-color-light;

  .price {
    color: $primary-color;
  }
}

.amount {
  font-weight: 600;
  margin-bottom: 2px;
}

.time {
  color: $text-color-light;
}

.order-card__footer {
  text-align: right;
}

.btn-cancel {
  margin-right: $spacing-sm;
}
</style>
