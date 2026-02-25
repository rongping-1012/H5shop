import { useStorage } from './useStorage'
import type { Goods, GoodsListParams, PaginationResponse } from '@/types'
import { getGoodsList, getGoodsDetail, searchGoods } from '@/api/goods'

/**
 * 商品相关组合式函数
 */
export function useProduct() {
  const { getItem, setItem } = useStorage()

  /**
   * 格式化价格
   */
  const formatPrice = (price: number): string => {
    if (typeof price !== 'number') return '¥0.00'
    return `¥${price.toFixed(2)}`
  }

  /**
   * 获取商品列表
   */
  const getProductList = async (params: GoodsListParams = {}): Promise<Goods[] | PaginationResponse<Goods>> => {
    const { page = 1, pageSize = 10, keyword = '', useCache = true } = params
    const cacheKey = `products_${JSON.stringify(params)}`
    
    // 尝试从缓存获取
    if (useCache) {
      const cached = getItem<PaginationResponse<Goods>>(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      const res = await getGoodsList({ page, pageSize, keyword })
      
      if (res.code === 200) {
        const data = res.data
        
        // 缓存5分钟
        if (useCache && data) {
          setItem(cacheKey, data, 5 * 60 * 1000)
        }

        return data
      }
      
      throw new Error(res.message || '获取商品列表失败')
    } catch (error) {
      console.error('获取商品列表失败:', error)
      throw error
    }
  }

  /**
   * 获取商品详情
   */
  const getProductDetail = async (id: string | number): Promise<Goods> => {
    try {
      const res = await getGoodsDetail(id)
      
      if (res.code === 200) {
        return res.data
      }
      
      throw new Error(res.message || '获取商品详情失败')
    } catch (error) {
      console.error('获取商品详情失败:', error)
      throw error
    }
  }

  /**
   * 搜索商品
   */
  const searchProducts = async (keyword: string): Promise<Goods[]> => {
    try {
      const res = await searchGoods({ keyword })
      
      if (res.code === 200) {
        return res.data || []
      }
      
      throw new Error(res.message || '搜索商品失败')
    } catch (error) {
      console.error('搜索商品失败:', error)
      throw error
    }
  }

  /**
   * 计算折扣
   */
  const calculateDiscount = (price: number, originalPrice?: number): number => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round((1 - price / originalPrice) * 100)
  }

  /**
   * 格式化折扣显示
   */
  const formatDiscount = (price: number, originalPrice?: number): string => {
    const discount = calculateDiscount(price, originalPrice)
    return discount > 0 ? `${discount}折` : ''
  }

  return {
    formatPrice,
    getProductList,
    getProductDetail,
    searchProducts,
    calculateDiscount,
    formatDiscount
  }
}

