import { getHomeData } from '@/api/home'
import { getGoodsByCategory } from '@/api/goods'

// 获取一级分类列表（复用首页 mock）
export const getCategoryList = async () => {
  const res = await getHomeData()
  if (res.code === 200) {
    return {
      code: 200,
      data: res.data.categories || []
    }
  }
  return {
    code: res.code || 500,
    data: []
  }
}

// 获取某个分类下的商品列表（复用 goods mock）
export const getCategoryGoods = (categoryId) => {
  return getGoodsByCategory(categoryId)
}


