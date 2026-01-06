<template>
  <div class="category-page">
    <div class="category-layout">
      <!-- 左侧分类导航 -->
      <van-sidebar v-model="activeIndex" class="sidebar" @change="onSidebarChange">
        <van-sidebar-item
          v-for="item in categories"
          :key="item.id"
          :title="item.name"
        />
      </van-sidebar>

      <!-- 右侧商品列表 -->
      <div class="content">
        <div class="content-header">
          <div class="title">{{ currentCategoryName }}</div>
          <div class="sub">为你找到这些好物</div>
        </div>

        <div class="goods-grid" v-if="goodsList.length">
          <div
            v-for="item in goodsList"
            :key="item.id"
            class="goods-item"
            @click="goToDetail(item)"
          >
            <van-image
              :src="item.image || item.cover"
              width="100"
              height="100"
              fit="cover"
              class="goods-cover"
            />
            <div class="goods-name text-ellipsis-2">{{ item.name }}</div>
            <div class="goods-price">¥{{ item.price }}</div>
          </div>
        </div>

        <BaseEmpty v-else> 该分类下还没有商品～ </BaseEmpty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { getCategoryList, getCategoryGoods } from '@/api/category'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const route = useRoute()
const router = useRouter()

const categories = ref([])
const goodsList = ref([])
const activeIndex = ref(0)

const currentCategory = computed(() => categories.value[activeIndex.value] || null)
const currentCategoryName = computed(() => currentCategory.value?.name || '全部商品')

const fetchCategories = async () => {
  try {
    const res = await getCategoryList()
    if (res.code === 200) {
      categories.value = res.data || []
      // 如果路由带了分类 id，则跳到对应分类
      const routeId = Number(route.query.id)
      if (routeId) {
        const idx = categories.value.findIndex((c) => c.id === routeId)
        if (idx !== -1) {
          activeIndex.value = idx
        }
      }
      if (categories.value.length) {
        fetchGoodsByCategory(categories.value[activeIndex.value].id)
      }
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    showFailToast('获取分类列表失败')
  }
}

const fetchGoodsByCategory = async (categoryId) => {
  try {
    const res = await getCategoryGoods(categoryId)
    if (res.code === 200) {
      goodsList.value = res.data || []
    }
  } catch (error) {
    console.error('获取分类商品失败:', error)
    showFailToast('获取分类商品失败')
  }
}

const onSidebarChange = (index) => {
  const cat = categories.value[index]
  if (cat) {
    fetchGoodsByCategory(cat.id)
  }
}

const goToDetail = (goods) => {
  router.push({
    path: '/goods/detail',
    query: { id: goods.id }
  })
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入
@import '@/assets/styles/mixins.scss';

.category-page {
  min-height: 100vh;
  background: $bg-color-light;
}

.category-layout {
  display: flex;
  height: calc(100vh - 100px); /* 预留头部 + Tabbar 空间 */
}

.sidebar {
  width: 90px;
  background: $bg-color-white;

  // 分类选中项的伪元素颜色
  :deep(.van-sidebar-item--select) {
    color: $primary-color;

    &::before {
      background-color: $primary-color !important;
    }
  }
}

.content {
  flex: 1;
  background: $bg-color-light;
  padding: $spacing-sm $spacing-base;
}

.content-header {
  .title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color-dark;
  }

  .sub {
    font-size: $font-size-sm;
    color: $text-color-light;
    margin-top: 2px;
    margin-bottom: $spacing-sm;
  }
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-base;
}

.goods-item {
  background: $bg-color-white;
  border-radius: $radius-base;
  padding: $spacing-sm;
  box-shadow: $box-shadow-light;
}

.goods-cover {
  border-radius: $radius-sm;
  overflow: hidden;
}

.goods-name {
  font-size: $font-size-sm;
  color: $text-color-dark;
  margin-top: 6px;
  min-height: 32px;
  @include text-ellipsis(2);
}

.goods-price {
  margin-top: $spacing-xs;
  font-size: $font-size-base;
  font-weight: 600;
  color: $primary-color;
}
</style>
