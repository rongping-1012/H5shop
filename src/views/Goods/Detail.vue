<template>
  <div v-if="goods" class="goods-detail">
    <!-- 商品大图 -->
    <van-image :src="goods.image" width="100%" height="260" fit="cover" class="goods-banner" />

    <!-- 商品基础信息 -->
    <div class="base-info">
      <div class="price-row">
        <span class="current-price">¥{{ selectedPrice }}</span>
        <span v-if="goods.originalPrice" class="original-price"> ¥{{ goods.originalPrice }} </span>
      </div>
      <div class="title">{{ goods.name }}</div>
      <div v-if="goods.desc" class="desc">
        {{ goods.desc }}
      </div>
    </div>

    <!-- 规格选择 -->
    <div v-if="goods.specs && goods.specs.length" class="section">
      <div class="section-title">规格选择</div>
      <div class="section-body">
        <div v-for="(spec, index) in goods.specs" :key="index" class="spec-item">
          <div class="spec-name">{{ spec.name }}</div>
          <div class="spec-options">
            <van-button
              v-for="(option, optIndex) in spec.options"
              :key="optIndex"
              :type="selectedSpecs[spec.name] === option.value ? 'primary' : 'default'"
              @click="selectSpec(spec.name, option.value, option.price)"
              class="spec-option"
            >
              {{ option.value }}
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 模拟商品参数 -->
    <div class="section">
      <div class="section-title">商品参数</div>
      <div class="section-body">
        <div class="param-row">
          <span class="label">品牌</span>
          <span class="value">掌上优选</span>
        </div>
        <div class="param-row">
          <span class="label">发货地</span>
          <span class="value">中国大陆</span>
        </div>
        <div class="param-row">
          <span class="label">服务</span>
          <span class="value">7天无理由 · 品质保障 · 极速退款</span>
        </div>
      </div>
    </div>

    <!-- 模拟图文详情 -->
    <div class="section">
      <div class="section-title">商品详情</div>
      <div class="section-body detail-images">
        <van-image
          v-for="n in 3"
          :key="n"
          :src="goods.image"
          width="100%"
          height="200"
          fit="cover"
        />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="left">
        <div class="action">
          <van-icon name="service-o" size="18" />
          <span>客服</span>
        </div>
        <div class="action">
          <van-icon name="cart-o" size="18" @click="goCart" />
          <span>购物车</span>
        </div>
      </div>
      <div class="right">
        <van-button size="small" class="btn-add" @click="handleAddCart"> 加入购物车 </van-button>
        <van-button size="small" type="danger" class="btn-buy" @click="handleBuyNow">
          立即购买
        </van-button>
      </div>
    </div>
  </div>
  <div v-else class="loading-wrap">加载中...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showToast } from 'vant'
import { getGoodsDetail } from '@/api/goods'
import { createOrder } from '@/api/order'
import { useCart } from '@/composables/useCart'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const goods = ref(null)
const loading = ref(false)
const selectedSpecs = ref({})
const selectedPrice = ref(0)

const fetchDetail = async () => {
  const id = route.query.id
  if (!id) {
    showFailToast('商品信息异常')
    router.back()
    return
  }

  loading.value = true
  try {
    const res = await getGoodsDetail(id)
    if (res.code === 200 && res.data) {
      goods.value = res.data
      selectedPrice.value = res.data.price
      // 初始化默认规格
      if (res.data.specs && res.data.specs.length) {
        res.data.specs.forEach(spec => {
          if (spec.options && spec.options.length) {
            selectedSpecs.value[spec.name] = spec.options[0].value
            selectedPrice.value = spec.options[0].price
          }
        })
      }
    } else {
      showFailToast('未找到该商品')
      router.back()
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    showFailToast('获取商品详情失败')
    router.back()
  } finally {
    loading.value = false
  }
}

const selectSpec = (specName, value, price) => {
  selectedSpecs.value[specName] = value
  selectedPrice.value = price
}

const handleAddCart = () => {
  if (goods.value) {
    const productWithSpec = {
      ...goods.value,
      price: selectedPrice.value,
      spec: Object.entries(selectedSpecs.value).map(([key, value]) => `${key}: ${value}`).join(' ')
    }
    addToCart(productWithSpec)
  }
}

const handleBuyNow = async () => {
  if (!goods.value) return
  try {
    const productWithSpec = {
      ...goods.value,
      price: selectedPrice.value,
      spec: Object.entries(selectedSpecs.value).map(([key, value]) => `${key}: ${value}`).join(' ')
    }
    const payload = {
      items: [{ ...productWithSpec, quantity: 1 }],
      amount: Number(selectedPrice.value)
    }
    const res = await createOrder(payload)
    showToast('订单已创建')
    router.push({
      path: '/order/pay',
      query: { id: res.data.id }
    })
  } catch (error) {
    console.error('立即购买失败:', error)
    showFailToast('下单失败')
  }
}

const goCart = () => {
  router.push('/cart')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins.scss' as *;


.goods-detail {
  padding-bottom: 60px;
  background: $bg-color-light;
  min-height: 100vh;
}

.goods-banner {
  background-color: $bg-color-white;
}

.base-info {
  padding: $spacing-base $spacing-base $spacing-lg;
  background: $bg-color-white;
  box-shadow: $box-shadow-light;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}

.current-price {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $primary-color;
}

.original-price {
  font-size: $font-size-sm;
  color: $text-color-light;
  text-decoration: line-through;
}

.title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color-dark;
  margin-bottom: $spacing-xs;
  @include text-ellipsis(2);
}

.desc {
  font-size: $font-size-sm;
  color: $text-color-light;
}

.section {
  margin-top: $spacing-base;
  background: $bg-color-white;
  box-shadow: $box-shadow-light;
}

.section-title {
  padding: $spacing-base $spacing-base;
  font-size: $font-size-base;
  font-weight: 500;
  border-bottom: 1px solid $border-color-light;
}

.section-body {
  padding: $spacing-base $spacing-base $spacing-base;
}

.param-row {
  display: flex;
  font-size: $font-size-sm;
  color: #555;
  margin-bottom: 6px;

  .label {
    width: 72px;
    color: $text-color-light;
  }

  .value {
    flex: 1;
  }
}

.detail-images :deep(.van-image) + :deep(.van-image) {
  margin-top: $spacing-sm;
}

.spec-item {
  margin-bottom: $spacing-base;
  
  .spec-name {
    font-size: $font-size-base;
    color: $text-color-dark;
    margin-bottom: $spacing-sm;
  }
  
  .spec-options {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    
    .spec-option {
      margin-bottom: $spacing-xs;
    }
  }
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 54px;
  background: $bg-color-white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-base 6px;
  box-shadow: $box-shadow-medium;
}

.bottom-bar {
  .left {
    display: flex;
    gap: $spacing-lg;
    font-size: 11px;
    color: $text-color-normal;
  }

  .right {
    display: flex;
    gap: $spacing-sm;
  }
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-add {
  border-color: #ffb400;
  color: #ffb400;
}

.btn-buy {
  background: $primary-gradient;
  border: none;
  box-shadow: $box-shadow-primary;
}

.loading-wrap {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-color-light;
  font-size: $font-size-base;
}
</style>
