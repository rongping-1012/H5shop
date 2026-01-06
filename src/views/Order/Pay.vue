<template>
  <div class="pay-page" v-if="order">
    <!-- 商品信息 -->
    <div class="goods-section">
      <div class="title">
        <div class="order-card__header">
          <span>订单号：{{ order.id }}</span>
          <span class="status">{{ statusText(order.status) }}</span>
        </div>
      </div>
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

    <div class="pay-amount">
      <div class="label">商品金额</div>
      <div class="value">¥{{ order.amount }}</div>
      <div v-if="selectedCoupon" class="discount-info">
        <span>优惠券：-¥{{ getDiscountAmount() }}</span>
      </div>
      <div class="label" style="margin-top: 8px;">需支付金额</div>
      <div class="value">¥{{ finalAmount }}</div>
    </div>


    <!-- 收货地址选择 -->
    <div class="address-section">
      <van-cell-group inset>
        <van-cell
          title="收货地址"
          :value="selectedAddress ? formatAddress(selectedAddress) : '选择收货地址'"
          is-link
          @click="showAddressPicker = true"
        />
      </van-cell-group>
    </div>

    <!-- 优惠券选择 -->
    <div class="coupon-section">
      <van-cell-group inset>
        <van-cell
          title="优惠券"
          :value="selectedCoupon ? selectedCoupon.name : '选择优惠券'"
          is-link
          @click="showCouponPicker = true"
        />
      </van-cell-group>
    </div>

    
    <div class="pay-method-section">
      <div class="title">选择支付方式</div>
      <van-radio-group v-model="payMethod">
        <van-cell-group inset>
          <van-cell clickable @click="payMethod = 'wechat'">
            <template #title>
              <span>微信支付</span>
            </template>
            <template #right-icon>
              <van-radio name="wechat" />
            </template>
          </van-cell>
          <van-cell clickable @click="payMethod = 'alipay'">
            <template #title>
              <span>支付宝支付</span>
            </template>
            <template #right-icon>
              <van-radio name="alipay" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>

    <!-- 地址选择弹窗 -->
    <van-action-sheet v-model:show="showAddressPicker" title="选择收货地址">
      <div class="address-picker">
        <div v-if="addressList.length === 0" class="empty-addresses">
          <BaseEmpty>暂无收货地址</BaseEmpty>
          <van-button type="primary" block round @click="goAddAddress" style="margin-top: 16px;">
            添加地址
          </van-button>
        </div>
        <div v-else class="address-options">
          <div
            v-for="address in addressList"
            :key="address.id"
            class="address-option"
            :class="{ active: selectedAddress?.id === address.id }"
          >
            <div class="address-option-content" @click="handleSelectAddress(address)">
              <div class="address-header">
                <span class="address-name">{{ address.name }}</span>
                <span class="address-phone">{{ address.phone }}</span>
                <van-tag v-if="address.isDefault" type="danger" size="small" style="margin-left: 8px;">
                  默认
                </van-tag>
              </div>
              <div class="address-detail">
                {{ address.province }}{{ address.city }}{{ address.district }}{{ address.address }}{{ address.detail }}
              </div>
            </div>
            <div class="address-option-right">
              <van-icon 
                v-if="selectedAddress?.id === address.id" 
                name="success" 
                color="#ee0a24" 
                style="margin-right: 8px;"
              />
              <van-icon 
                name="edit" 
                color="#666" 
                @click.stop="goEditAddress(address)"
                style="cursor: pointer;"
              />
            </div>
          </div>
          <van-button type="primary" block round @click="goAddAddress" style="margin-top: 16px;">
            添加新地址
          </van-button>
        </div>
      </div>
    </van-action-sheet>

    <!-- 优惠券选择弹窗 -->
    <van-action-sheet v-model:show="showCouponPicker" title="选择优惠券">
      <div class="coupon-picker">
        <div v-if="availableCoupons.length === 0" class="empty-coupons">
          <BaseEmpty>暂无可用优惠券</BaseEmpty>
        </div>
        <div v-else class="coupon-options">
          <div
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            class="coupon-option"
            :class="{ active: selectedCoupon?.id === coupon.id }"
            @click="handleSelectCoupon(coupon)"
          >
            <div class="coupon-option-left">
              <div class="coupon-option-value">
                <span v-if="coupon.type === 'cash'">¥{{ coupon.value }}</span>
                <span v-else-if="coupon.type === 'discount'">{{ coupon.value }}折</span>
                <span v-else>免邮</span>
              </div>
              <div class="coupon-option-desc">{{ coupon.desc }}</div>
            </div>
            <div class="coupon-option-right">
              <van-icon v-if="selectedCoupon?.id === coupon.id" name="success" color="#ee0a24" />
            </div>
          </div>
          <div class="coupon-option" v-if="selectedCoupon" @click="handleSelectCoupon(null)">
            <div class="coupon-option-left">
              <div class="coupon-option-desc">不使用优惠券</div>
            </div>
          </div>
        </div>
      </div>
    </van-action-sheet>

    <div class="pay-bottom">
      <div class="summary">
        <div>
          实付金额：<span class="strong">¥{{ finalAmount }}</span>
          <span v-if="selectedCoupon" class="coupon-deduction">
            (优惠券抵扣¥{{ getDiscountAmount() }})
          </span>
        </div>
        <div class="tips">模拟支付页面，不会真实扣款</div>
      </div>
      <van-button type="danger" round class="btn-pay" @click="handlePay" :loading="loading">
        立即支付
      </van-button>
    </div>
  </div>
  <div v-else class="loading-wrap">订单信息加载中...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showToast } from 'vant'
import { getOrderDetail, payOrder } from '@/api/order'
import { getAvailableCoupons } from '@/api/coupon'
import { getAddressList } from '@/api/address'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)
const payMethod = ref('wechat')
const selectedCoupon = ref(null)
const availableCoupons = ref([])
const showCouponPicker = ref(false)
const selectedAddress = ref(null)
const addressList = ref([])
const showAddressPicker = ref(false)
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
// 计算最终金额
const finalAmount = computed(() => {
  if (!order.value) return 0
  const discount = selectedCoupon.value ? getDiscountAmount() : 0
  return Math.max(0, order.value.amount - discount)
})

// 获取优惠金额
const getDiscountAmount = () => {
  if (!selectedCoupon.value || !order.value) return 0
  
  const coupon = selectedCoupon.value
  const amount = order.value.amount
  
  if (amount < coupon.minAmount) return 0
  
  if (coupon.type === 'cash') {
    return coupon.value
  } else if (coupon.type === 'discount') {
    return Math.round(amount * (1 - coupon.value / 100))
  } else if (coupon.type === 'shipping') {
    // 免邮券，这里假设邮费是 10 元
    return 10
  }
  return 0
}

// 获取可用优惠券
const fetchAvailableCoupons = async () => {
  if (!order.value) return
  try {
    const res = await getAvailableCoupons(order.value.amount)
    if (res.code === 200) {
      availableCoupons.value = res.data || []
    }
  } catch (error) {
    console.error('获取可用优惠券失败:', error)
  }
}

// 选择优惠券
const handleSelectCoupon = (coupon) => {
  selectedCoupon.value = coupon
  // 自动关闭抽屉
  showCouponPicker.value = false
}

// 获取地址列表
const fetchAddressList = async () => {
  try {
    const res = await getAddressList()
    if (res.code === 200) {
      addressList.value = res.data || []
      // 默认选择默认地址
      const defaultAddress = addressList.value.find(addr => addr.isDefault)
      if (defaultAddress) {
        selectedAddress.value = defaultAddress
      } else if (addressList.value.length > 0) {
        selectedAddress.value = addressList.value[0]
      }
    }
  } catch (error) {
    console.error('获取地址列表失败:', error)
  }
}

// 选择地址
const handleSelectAddress = (address) => {
  selectedAddress.value = address
  showAddressPicker.value = false
}

// 格式化地址显示
const formatAddress = (address) => {
  if (!address) return ''
  return `${address.province}${address.city}${address.district}${address.address}${address.detail}`
}

// 跳转到添加地址页面
const goAddAddress = () => {
  showAddressPicker.value = false
  router.push('/user/address/edit')
}

// 跳转到编辑地址页面
const goEditAddress = (address) => {
  showAddressPicker.value = false
  router.push({
    path: '/user/address/edit',
    query: { id: address.id }
  })
}

const fetchDetail = async () => {
  const id = route.query.id
  if (!id) {
    showFailToast('订单信息异常')
    router.back()
    return
  }

  try {
    const res = await getOrderDetail(id)
    if (res.code === 200 && res.data) {
      order.value = res.data
      // 获取可用优惠券
      await fetchAvailableCoupons()
      // 获取地址列表
      await fetchAddressList()
    } else {
      showFailToast('未找到该订单')
      router.back()
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    showFailToast('获取订单详情失败')
    router.back()
  }
}

const handlePay = async () => {
  if (!order.value) return
  loading.value = true
  try {
    // 如果有选中的优惠券，传递优惠券信息
    const payData = {
      couponId: selectedCoupon.value?.id || null,
      discountAmount: selectedCoupon.value ? getDiscountAmount() : 0
    }
    await payOrder(order.value.id, payData)
    showToast('支付成功（mock）')
    router.replace('/order')
  } catch (error) {
    console.error('支付失败:', error)
    showFailToast('支付失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入
@import '@/assets/styles/mixins.scss';

.pay-page {
  min-height: 100vh;
  background: $bg-color-light;
  padding-bottom: 60px;
}

.goods-section {
  margin-top: $spacing-base;
  background: $bg-color-white;
  box-shadow: $box-shadow-light;

  .title {
    padding: $spacing-base $spacing-lg 6px;
    font-size: $font-size-base;
    color: $text-color-normal;
  }
}

.goods-row {
  display: flex;
  padding: $spacing-sm $spacing-lg $spacing-base;
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

.coupon-section {
  margin-top: $spacing-base;
}

.pay-amount {
  padding: $spacing-xl $spacing-lg $spacing-lg;
  background: $bg-color-white;
  margin-bottom: $spacing-base;
  box-shadow: $box-shadow-light;

  .label {
    font-size: $font-size-base;
    color: $text-color-normal;
    margin-bottom: $spacing-sm;
  }

  .value {
    font-size: 28px;
    font-weight: 700;
    color: $primary-color;
  }

  .discount-info {
    font-size: $font-size-sm;
    color: $primary-color;
    margin-top: $spacing-xs;
  }
}

.address-picker,
.coupon-picker {
  max-height: 60vh;
  overflow-y: auto;
  padding: $spacing-base;
}

.empty-addresses {
  padding: $spacing-xxl;
  text-align: center;
}

.address-options {
  display: flex;
  flex-direction: column;
}

.address-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-base;
  background: $bg-color-white;
  border: 1px solid $border-color;
  border-radius: $radius-base;
  margin-bottom: $spacing-sm;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    border-color: $primary-color;
    background: #fff5f5;
  }

  &:active {
    opacity: 0.8;
  }
}

.address-option-content {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-xs;
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-color-dark;
}

.address-name {
  margin-right: $spacing-sm;
}

.address-phone {
  color: $text-color-normal;
  font-weight: normal;
}

.address-detail {
  font-size: $font-size-sm;
  color: $text-color-normal;
  line-height: 1.5;
}

.address-option-right {
  margin-left: $spacing-base;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.empty-coupons {
  padding: $spacing-xxl;
}

.coupon-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.coupon-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-base;
  background: $bg-color-white;
  border: 1px solid $border-color;
  border-radius: $radius-base;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    border-color: $primary-color;
    background: #fff5f5;
  }

  &:active {
    opacity: 0.8;
  }
}

.coupon-option-left {
  flex: 1;
}

.coupon-option-value {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.coupon-option-desc {
  font-size: $font-size-sm;
  color: $text-color-normal;
}

.coupon-option-right {
  flex-shrink: 0;
  margin-left: $spacing-base;
}

.pay-method-section {
  margin-top: $spacing-base;

  .title {
    padding: $spacing-base $spacing-lg 6px;
    font-size: $font-size-base;
    color: $text-color-normal;
  }
}

.pay-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  background: $bg-color-white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-base;
  box-shadow: $box-shadow-medium;
}

.summary {
  font-size: $font-size-sm;
  color: $text-color-normal;
}

.strong {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $primary-color;
}

.coupon-deduction {
  font-size: $font-size-sm;
  color: $text-color-normal;
  margin-left: $spacing-xs;
  font-weight: normal;
}

.tips {
  margin-top: 2px;
  color: $text-color-light;
}

.btn-pay {
  min-width: 120px;
}

.loading-wrap {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-color-light;
  font-size: $font-size-base;
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
</style>


