<template>
  <div class="search-page">
    <van-search
      v-model="keyword"
      show-action
      placeholder="搜索商品名称"
      @search="onSearch"
      @cancel="onCancel"
    />

    <!-- 搜索历史 & 热门搜索 -->
    <div v-if="!keyword && !results.length" class="search-panel">
      <div v-if="historyList.length" class="search-section">
        <div class="section-title">
          搜索历史
          <span class="clear" @click="clearHistory">清空</span>
        </div>
        <div class="tag-list">
          <span v-for="item in historyList" :key="item" class="tag" @click="useHistory(item)">
            {{ item }}
          </span>
        </div>
      </div>

      <div class="search-section">
        <div class="section-title">热门搜索</div>
        <div class="tag-list">
          <span v-for="item in hotList" :key="item" class="tag hot" @click="useHistory(item)">
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="result-list">
      <ProductCard
        v-for="item in results"
        :key="item.id"
        :product="item"
        :show-add-cart="false"
        @click="goToDetail"
      />

      <BaseEmpty v-if="!loading && !results.length">
        暂无相关商品，换个关键词试试～
      </BaseEmpty>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import ProductCard from '@/components/business/product/ProductCard.vue'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import { useCart } from '@/composables/useCart'
import { useProduct } from '@/composables/useProduct'
import { useStorage } from '@/composables/useStorage'

const router = useRouter()
const { addToCart } = useCart()
const { searchProducts } = useProduct()
const { getItem, setItem, removeItem } = useStorage()

const keyword = ref('')
const results = ref([])
const loading = ref(false)
const historyList = ref([])

const hotList = ref(['手机', '电脑', 'iPhone', '平板', '耳机'])

const HISTORY_KEY = 'search_history'

const loadHistory = () => {
  const cached = getItem(HISTORY_KEY)
  historyList.value = cached || []
}

const saveHistory = (value) => {
  const val = value.trim()
  if (!val) return
  const list = [val, ...historyList.value.filter((item) => item !== val)].slice(0, 10)
  historyList.value = list
  setItem(HISTORY_KEY, list)
}

const onSearch = async (val) => {
  const kw = (val || keyword.value || '').trim()
  if (!kw) {
    showToast('请输入搜索关键词')
    return
  }

  keyword.value = kw
  loading.value = true
  try {
    const data = await searchProducts(kw)
    results.value = Array.isArray(data) ? data : (data?.list || [])
    saveHistory(kw)
  } catch (error) {
    console.error('搜索失败:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

const onCancel = () => {
  router.back()
}

const useHistory = (val) => {
  keyword.value = val
  onSearch(val)
}

const clearHistory = () => {
  historyList.value = []
  removeItem(HISTORY_KEY)
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
  loadHistory()
})
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background-color: $bg-color-light;
}

.search-panel {
  padding: $spacing-base $spacing-base $spacing-xl;
}

.search-section + .search-section {
  margin-top: $spacing-lg;
}

.section-title {
  font-size: $font-size-base;
  color: $text-color-normal;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.clear {
  font-size: $font-size-sm;
  color: $text-color-light;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.tag {
  padding: 6px $spacing-base;
  border-radius: 14px;
  background-color: #f5f5f5;
  font-size: $font-size-sm;
  color: $text-color-normal;
}

.tag.hot {
  background-color: #ffeeee;
  color: $primary-color;
}

.result-list {
  padding: $spacing-sm $spacing-base $spacing-lg;
}
</style>
