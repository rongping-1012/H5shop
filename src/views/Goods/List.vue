<template>
  <div class="goods-list-page">
    <div class="header">
      <div class="title">
        商品列表
      </div>
      <div class="sub">
        为你精选优质好物
      </div>
    </div>

    <!-- 骨架屏加载状态 -->
    <div v-if="initialLoading" class="skeleton-container">
      <SkeletonLoader
        v-for="i in 8"
        :key="i"
        type="product-card"
      />
    </div>

    <!-- 虚拟列表 -->
    <VirtualList
      v-else
      :items="list"
      :item-height="itemHeight"
      :container-height="containerHeight"
      :overscan="3"
      class="goods-list"
      @scroll="handleVirtualScroll"
    >
      <template #default="{ items, startIndex }">
        <ProductCard
          v-for="(item, index) in items"
          :key="item.id"
          :product="item"
          :data-index="startIndex + index"
          :show-add-cart="false"
          @click="goToDetail"
        />
      </template>
    </VirtualList>

    <!-- 加载更多提示 -->
    <div v-if="loading && !initialLoading" class="loading-more">
      <van-loading size="16px" vertical>
        加载中...
      </van-loading>
    </div>

    <!-- 没有更多提示 -->
    <div v-if="finished && list.length > 0" class="finished-text">
      共 {{ list.length }} 条商品数据
    </div>

    <!-- 空状态 -->
    <BaseEmpty v-if="!initialLoading && !loading && list.length === 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import ProductCard from '@/components/business/product/ProductCard.vue'
import VirtualList from '@/components/base/VirtualList.vue'
import SkeletonLoader from '@/components/base/SkeletonLoader.vue'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import { useCart } from '@/composables/useCart'
import { throttle } from '@/utils/throttle'
import type { Goods } from '@/types'
import { mockGoods } from '@/api/goods'

const router = useRouter()
const list = ref<Goods[]>([])
const { addToCart } = useCart()

const page = ref(1)
const pageSize = 20
const loading = ref(false)
const initialLoading = ref(true)
const finished = ref(false)

// 虚拟列表配置
const itemHeight = 130 // 商品卡片高度（包含padding，图片100px + padding）
const containerHeight = computed(() => {
  // 视口高度减去头部高度
  return window.innerHeight - 100
})

// 生成模拟商品数据
const generateMockGoods = (count: number): Goods[] => {
  const result: Goods[] = []
  
  for (let i = 0; i < count; i++) {
    const index = i % mockGoods.length
    const goods = mockGoods[index]
    result.push({
      ...goods,
      id: i + 1
    })
  }
  
  return result
}

// 获取商品列表（测试模式：生成5000条数据）
const fetchList = async (): Promise<void> => {
  if (finished.value || loading.value) return
  
  loading.value = true
  
  // 模拟网络延迟，展示骨架屏效果
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  try {
    // 测试模式：直接生成5000条数据
    const totalCount = 5000
    const mockData = generateMockGoods(totalCount)
    
    // 如果是首次加载，直接加载全部数据
    if (initialLoading.value) {
      list.value = mockData
      finished.value = true
    } else {
      // 后续分页加载（虽然测试模式下不需要）
      const startIndex = (page.value - 1) * pageSize
      const endIndex = startIndex + pageSize
      const productList = mockData.slice(startIndex, endIndex)
      
      list.value = [...list.value, ...productList]
      finished.value = endIndex >= totalCount
      
      if (!finished.value) {
        page.value += 1
      }
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    showFailToast('获取商品列表失败')
    finished.value = true
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

// 虚拟列表滚动处理（节流优化）
// 测试模式下已加载全部数据，此函数仅用于滚动监听
const handleVirtualScroll = throttle((_e: Event) => {
  // 可以在这里添加滚动相关的逻辑，如滚动位置记录等
  // 测试模式下不需要加载更多数据
}, 200)

// 跳转到商品详情
const goToDetail = (goods: Goods): void => {
  router.push({
    path: '/goods/detail',
    query: { id: goods.id }
  })
}

// 添加到购物车
const handleAddCart = (goods: Goods): void => {
  addToCart(goods)
}

// 初始加载
onMounted(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
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

.skeleton-container {
  padding: 0 $spacing-base;
}

.goods-list {
  padding: 0 $spacing-base;
}

.loading-more,
.finished-text {
  padding: $spacing-base;
  text-align: center;
  color: $text-color-light;
  font-size: $font-size-sm;
}

.finished-text {
  padding: $spacing-lg;
}
</style>
