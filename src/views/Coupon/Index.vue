<template>
  <div class="coupon-page">
    <van-nav-bar title="我的优惠券" left-arrow @click-left="$router.back()" />

    <!-- 标签页 -->
    <van-tabs v-model:active="activeTab" @change="handleTabChange">
      <van-tab title="可用" name="available" />
      <van-tab title="已使用" name="used" />
      <van-tab title="已过期" name="expired" />
    </van-tabs>

    <!-- 优惠券列表 -->
    <div class="coupon-list">
      <div v-if="loading" class="loading-wrap">
        <van-loading type="spinner" />
      </div>

      <div v-else-if="couponList.length === 0" class="empty-wrap">
        <BaseEmpty>暂无优惠券</BaseEmpty>
      </div>

      <div v-else class="coupon-items">
        <div
          v-for="item in couponList"
          :key="item.id"
          class="coupon-item"
          :class="{ 'coupon-item--used': item.status === 'used', 'coupon-item--expired': item.status === 'expired' }"
        >
          <div class="coupon-left">
            <div class="coupon-value">
              <span v-if="item.type === 'cash'" class="value-symbol">¥</span>
              <span class="value-number">{{ item.value }}</span>
              <span v-if="item.type === 'discount'" class="value-unit">折</span>
              <span v-if="item.type === 'shipping'" class="value-text">免邮</span>
            </div>
            <div class="coupon-desc">{{ item.desc }}</div>
          </div>
          <div class="coupon-right">
            <div class="coupon-name">{{ item.name }}</div>
            <div class="coupon-validity">
              {{ item.validStart }} 至 {{ item.validEnd }}
            </div>
            <div v-if="item.status === 'used' && item.usedAt" class="coupon-used-time">
              使用时间：{{ formatDate(item.usedAt) }}
            </div>
            <van-tag
              v-if="item.status === 'used'"
              type="success"
              class="coupon-tag"
            >
              已使用
            </van-tag>
            <van-tag
              v-else-if="item.status === 'expired'"
              type="default"
              class="coupon-tag"
            >
              已过期
            </van-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCouponList } from '@/api/coupon'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const activeTab = ref('available')
const loading = ref(false)
const couponList = ref([])

const fetchCouponList = async () => {
  loading.value = true
  try {
    const res = await getCouponList({ status: activeTab.value })
    if (res.code === 200) {
      couponList.value = res.data || []
    }
  } catch (error) {
    console.error('获取优惠券列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  fetchCouponList()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchCouponList()
})
</script>

<style lang="scss" scoped>
.coupon-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-xxl;
}

.empty-wrap {
  padding: $spacing-xxl;
}

.coupon-list {
  padding: $spacing-base;
}

.coupon-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.coupon-item {
  display: flex;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee0a24 100%);
  border-radius: $radius-base;
  overflow: hidden;
  color: #fff;
  position: relative;

  &--used,
  &--expired {
    background: #e0e0e0;
    color: $text-color-normal;
    opacity: 0.8;
  }

  &::before {
    content: '';
    position: absolute;
    left: 120px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.3) 10px,
      rgba(255, 255, 255, 0.3) 20px
    );
  }
}

.coupon-left {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $spacing-lg;
  text-align: center;
}

.coupon-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: $spacing-xs;

  .value-symbol {
    font-size: $font-size-lg;
    font-weight: 600;
  }

  .value-number {
    font-size: 32px;
    font-weight: bold;
    line-height: 1;
  }

  .value-unit {
    font-size: $font-size-base;
    margin-left: 2px;
  }

  .value-text {
    font-size: $font-size-lg;
    font-weight: 600;
  }
}

.coupon-desc {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.coupon-right {
  flex: 1;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.coupon-name {
  font-size: $font-size-lg;
  font-weight: 600;
  margin-bottom: $spacing-xs;
}

.coupon-validity {
  font-size: $font-size-sm;
  opacity: 0.9;
  margin-bottom: $spacing-xs;
}

.coupon-used-time {
  font-size: $font-size-sm;
  opacity: 0.8;
  margin-bottom: $spacing-xs;
}

.coupon-tag {
  align-self: flex-start;
  margin-top: $spacing-xs;
}
</style>

