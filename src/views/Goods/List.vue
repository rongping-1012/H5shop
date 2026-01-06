<template>
  <div class="goods-list-page">
    <div class="header">
      <div class="title">商品列表</div>
      <div class="sub">为你精选优质好物</div>
    </div>

    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      class="goods-list"
    >
      <ProductCard
        v-for="item in list"
        :key="item.id"
        :product="item"
        @click="goToDetail"
        @add-cart="handleAddCart"
      />
    </van-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import ProductCard from '@/components/business/product/ProductCard.vue'
import { useCart } from '@/composables/useCart'
import { useProduct } from '@/composables/useProduct'

const router = useRouter()
const list = ref([])
const { addToCart } = useCart()
const { getProductList } = useProduct()

const page = ref(1)
const pageSize = 10
const loading = ref(false)
const finished = ref(false)

const fetchList = async () => {
  if (finished.value) return
  loading.value = true
  try {
    const data = await getProductList({ page: page.value, pageSize, useCache: false })
    const productList = Array.isArray(data) ? data : (data?.list || [])
    list.value = [...list.value, ...productList]
    
    // 判断是否还有更多
    if (Array.isArray(data)) {
      finished.value = productList.length < pageSize
    } else {
      finished.value = !data?.hasMore
    }
    
    if (!finished.value) {
      page.value += 1
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    showFailToast('获取商品列表失败')
    finished.value = true
  } finally {
    loading.value = false
  }
}

const onLoad = () => {
  fetchList()
}

const goToDetail = (goods) => {
  router.push({
    path: '/goods/detail',
    query: { id: goods.id }
  })
}

const handleAddCart = (goods) => {
  addToCart(goods)
}

onMounted(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入

.goods-list-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.header {
  padding: $spacing-base $spacing-base $spacing-sm;
  background: $bg-color-white;
  margin-bottom: $spacing-sm;
  box-shadow: $box-shadow-light;

  .title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color-dark;
  }

  .sub {
    font-size: $font-size-sm;
    color: $text-color-light;
    margin-top: $spacing-xs;
  }
}

.goods-list {
  padding: 0 $spacing-base $spacing-lg;
}
</style>
