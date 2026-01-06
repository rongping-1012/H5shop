<template>
    <div class="home-container" ref="containerRef">
      <!-- 轮播图 -->
      <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="#ee0a24">
      <van-swipe-item v-for="(item, index) in bannerList" :key="item.id || index">
        <van-image
          :src="item.image"
          width="100%"
          height="150"
          fit="cover"
          class="banner-img"
          @click="handleBannerClick(item)"
        />
        </van-swipe-item>
      </van-swipe>
  
      <!-- 分类入口 -->
      <div class="category-grid">
        <div 
          v-for="(item, index) in categoryList" 
          :key="index" 
          class="category-item"
          @click="goToCategory(item)"
        >
        <van-image :src="item.icon" width="40" height="40" class="category-icon" />
          <div class="category-name">{{ item.name }}</div>
        </div>
      </div>
  
      <!-- 限时抢购 -->
      <div class="section" v-if="flashSaleList.length > 0">
        <div class="section-header">
          <h3 class="section-title">限时抢购</h3>
          <div class="countdown">
            <span>距结束</span>
            <van-count-down :time="flashSaleTime" format="HH:mm:ss">
              <template #default="timeData">
                <span class="countdown-item">{{ timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="countdown-item">{{ timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="countdown-item">{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
          <div class="more" @click="goToFlashSale">更多<van-icon name="arrow" /></div>
        </div>
        <div class="flash-sale-list">
          <div 
            v-for="(item, index) in flashSaleList" 
            :key="index" 
            class="flash-sale-item"
            @click="goToGoodsDetail(item)"
          >
          <van-image :src="item.image" width="100" height="100" class="goods-image" fit="cover" />
            <div class="goods-price">
              <span class="current-price">¥{{ item.price }}</span>
              <span class="original-price">¥{{ item.originalPrice }}</span>
            </div>
            <div class="sale-progress">
              <div class="progress-bar" :style="{ width: item.salePercent + '%' }"></div>
              <span class="sale-text">已售{{ item.soldPercent }}%</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 推荐商品 -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">推荐商品</h3>
          <div class="more" @click="goToGoodsList">更多<van-icon name="arrow" /></div>
        </div>
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="goods-grid">
            <div 
              v-for="(item, index) in recommendList" 
              :key="item.id || index" 
              class="goods-item"
              @click="goToGoodsDetail(item)"
            >
            <van-image :src="item.image" width="100%" :ratio="1" class="goods-image" fit="cover" />
              <div class="goods-info">
                <div class="goods-name text-ellipsis-2">{{ item.name }}</div>
                <div class="goods-desc text-ellipsis">{{ item.desc }}</div>
                <div class="goods-bottom">
                  <div class="goods-price">
                    <span class="current-price">¥{{ item.price }}</span>
                  <span class="original-price" v-if="item.originalPrice"
                    >¥{{ item.originalPrice }}</span
                  >
                  </div>
                <van-icon
                  name="cart-circle"
                  color="#ee0a24"
                  size="24"
                  @click.stop="addToCart(item)"
                />
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </div>

      <!-- 返回顶部按钮 -->
      <Teleport to="body">
        <div
          v-show="showBackTop"
          class="back-top-btn"
          @click="scrollToTop"
        >
          <van-icon name="arrow-up" size="20" />
        </div>
      </Teleport>
    </div>
  </template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { getHomeData } from '@/api/home'
import { getGoodsList } from '@/api/goods'
import { useCart } from '@/composables/useCart'
  
const router = useRouter()
const { addToCart } = useCart()
const containerRef = ref(null)

// 轮播图 / 分类 / 商品数据（从 mock 接口获取）
const bannerList = ref([])
const categoryList = ref([])
const flashSaleTime = ref(0)
const flashSaleList = ref([])
const recommendList = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = ref(10)
const showBackTop = ref(false)

const loadHomeData = async () => {
  try {
    const res = await getHomeData()
    if (res.code === 200) {
      const data = res.data
      bannerList.value = data.banners || []
      categoryList.value = data.categories || []
      flashSaleTime.value = data.flashSaleTime || 0
      flashSaleList.value = data.flashSaleList || []
      // 初始加载推荐商品
      await onLoad()
    }
  } catch (error) {
    console.error('获取首页数据失败:', error)
    showFailToast('首页数据加载失败，请稍后重试')
  }
}

// 触底加载更多
const onLoad = async () => {
  try {
    loading.value = true
    const res = await getGoodsList({
      page: page.value,
      pageSize: pageSize.value
    })
    
    if (res.code === 200) {
      const { list, hasMore } = res.data
      if (list && list.length > 0) {
        recommendList.value.push(...list)
        page.value++
        finished.value = !hasMore
      } else {
        finished.value = true
      }
    }
  } catch (error) {
    console.error('加载商品失败:', error)
    showFailToast('加载失败，请稍后重试')
    finished.value = true
  } finally {
    loading.value = false
  }
}

// 滚动监听
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showBackTop.value = scrollTop > 300
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
  
  // 跳转到分类页
  const goToCategory = (category) => {
    router.push({
      path: '/category',
      query: { id: category.id, name: category.name }
    })
  }
  
  // 跳转到限时抢购
  const goToFlashSale = () => {
    router.push('/flashsale')
  }
  
  // 跳转到商品列表
  const goToGoodsList = () => {
    router.push('/goods/list')
  }
  
  // 跳转到商品详情
  const goToGoodsDetail = (goods) => {
    router.push({
      path: '/goods/detail',
      query: { id: goods.id }
    })
  }
  
// 添加商品到购物车（使用 Pinia + mock API）
// 已通过 useCart 抽象，直接复用逻辑
  
  // 处理轮播图点击
  const handleBannerClick = (banner) => {
    if (banner.link) {
      // 处理banner跳转逻辑
      console.log('跳转到:', banner.link)
    }
  }

onMounted(() => {
  loadHomeData()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
  </script>
  
  <style lang="scss" scoped>
// variables 已在 vite.config.js 中全局注入，无需重复导入
@import '@/assets/styles/mixins.scss';

  .home-container {
    padding-bottom: 50px;
  background-color: $bg-color-light;
  }
  
  // 轮播图
  .banner-swipe {
    width: 100%;
  background-color: #fff;
    
    .banner-img {
    border-radius: $radius-base;
    overflow: hidden;
    }
    
  // 覆盖 Vant 轮播指示器样式（scoped 场景下使用 :deep）
    :deep(.van-swipe__indicator) {
      width: 8px;
      height: 3px;
      border-radius: 2px;
      opacity: 0.5;
  }
  :deep(.van-swipe__indicator--active) {
        width: 16px;
        opacity: 1;
    }
  }
  
  // 分类入口
  .category-grid {
    display: flex;
    flex-wrap: wrap;
  background: $bg-color-white;
  padding: $spacing-lg 0 $spacing-xs;
  margin-bottom: $spacing-base;
  box-shadow: $box-shadow-light;
    
    .category-item {
      width: 25%;
      text-align: center;
    margin-bottom: $spacing-lg;
      
      .category-icon {
        margin: 0 auto 6px;
        border-radius: 50%;
        overflow: hidden;
      }
      
      .category-name {
      font-size: $font-size-sm;
      color: $text-color-dark;
      }
    }
  }
  
  // 版块标题
  .section {
  background: $bg-color-white;
  margin-bottom: $spacing-base;
  padding: 0 $spacing-base;
  box-shadow: $box-shadow-light;
    
    &-header {
      display: flex;
      align-items: center;
      height: 44px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
      background-color: $border-color-light;
        transform: scaleY(0.5);
      }
    }
    
    &-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      padding-left: 8px;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 14px;
      background-color: $primary-color;
        border-radius: 2px;
      }
    }
    
    .more {
      margin-left: auto;
      font-size: 12px;
      color: #999;
      display: flex;
      align-items: center;
      
      .van-icon {
        margin-left: 2px;
        font-size: 12px;
      }
    }
    
    .countdown {
      margin-left: 15px;
      font-size: 12px;
      color: $text-color-normal;
      display: flex;
      align-items: center;
      
      .countdown-item {
        display: inline-block;
        min-width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #333;
        color: #fff;
        border-radius: 2px;
        margin: 0 2px;
        font-size: 12px;
      }
      
      .colon {
        margin: 0 2px;
      color: $primary-color;
      }
    }
  }
  
  // 限时抢购
  .flash-sale-list {
    display: flex;
    padding: 10px 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    .flash-sale-item {
      flex: 0 0 120px;
      margin-right: 10px;
      background: #fff9f9;
      border-radius: 6px;
      overflow: hidden;
      padding: 10px;
      
      .goods-image {
        width: 100px;
        height: 100px;
        display: block;
        margin: 0 auto 8px;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .goods-price {
        margin-bottom: 8px;
        
        .current-price {
        color: $primary-color;
          font-size: 16px;
          font-weight: bold;
        }
        
        .original-price {
        color: $text-color-light;
          font-size: 12px;
          text-decoration: line-through;
          margin-left: 4px;
        }
      }
      
      .sale-progress {
        position: relative;
        height: 16px;
        background: #ffe5e5;
        border-radius: 8px;
        overflow: hidden;
        
        .progress-bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(to right, #ff6034, #ee0a24);
          border-radius: 8px;
        }
        
        .sale-text {
          position: relative;
          font-size: 10px;
          color: #fff;
          line-height: 16px;
          text-align: center;
          z-index: 1;
        }
      }
    }
  }
  
  // 商品网格
  .goods-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
    padding: 10px 0;
    
    .goods-item {
      width: 50%;
      padding: 0 5px 10px;
      margin-bottom: 10px;
      
      .goods-image {
        width: 100%;
        border-radius: 6px;
        overflow: hidden;
      }
      
      .goods-info {
        padding: 8px 5px 0;
        
        .goods-name {
          font-size: 13px;
        color: $text-color-dark;
          line-height: 1.4;
          height: 36px;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .goods-desc {
          font-size: 11px;
        color: $text-color-light;
          margin-bottom: 8px;
        }
        
        .goods-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .goods-price {
            .current-price {
            color: $primary-color;
              font-size: 16px;
              font-weight: bold;
              
              &::before {
                content: '¥';
                font-size: 12px;
              }
            }
            
            .original-price {
            color: $text-color-light;
              font-size: 11px;
              text-decoration: line-through;
              margin-left: 4px;
              
              &::before {
                content: '¥';
              }
            }
          }
        }
      }
    }
  }
  
  // 返回顶部按钮
  .back-top-btn {
    position: fixed;
    right: 16px;
    bottom: 100px;
    width: 44px;
    height: 44px;
    background: $primary-color;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(225, 37, 27, 0.3);
    cursor: pointer;
    z-index: 999;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      box-shadow: 0 2px 8px rgba(225, 37, 27, 0.4);
    }
    
    &:hover {
      background: $primary-color-light;
    }
  }
  </style>
