import { useStorage } from './useStorage'

/**
 * 商品相关组合式函数
 */
export function useProduct() {
  const { getItem, setItem } = useStorage()

  /**
   * 格式化价格
   * @param {number} price - 价格
   * @returns {string} 格式化后的价格字符串
   */
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '¥0.00'
    return `¥${price.toFixed(2)}`
  }

  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.keyword - 搜索关键词
   * @param {boolean} params.useCache - 是否使用缓存
   * @returns {Promise} 商品列表
   */
  const getProductList = async (params = {}) => {
    const { page = 1, pageSize = 10, keyword = '', useCache = true } = params
    const cacheKey = `products_${JSON.stringify(params)}`
    
    // 尝试从缓存获取
    if (useCache) {
      const cached = getItem(cacheKey)
      if (cached) {
        return cached
      }
    }

    try {
      const data = await request({
        url: '/goods/list',
        method: 'GET',
        params: { page, pageSize, keyword }
      })

      // 缓存5分钟
      if (useCache && data) {
        setItem(cacheKey, data, 5 * 60 * 1000)
      }

      return data
    } catch (error) {
      console.error('获取商品列表失败:', error)
      throw error
    }
  }

  /**
   * 获取商品详情
   * @param {string|number} id - 商品ID
   * @returns {Promise} 商品详情
   */
  const getProductDetail = async (id) => {
    try {
      // 使用现有的 API 方法（兼容现有 mock 数据）
      const { getGoodsDetail } = await import('@/api/goods')
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
   * @param {string} keyword - 搜索关键词
   * @returns {Promise} 搜索结果
   */
  const searchProducts = async (keyword) => {
    try {
      // 使用现有的 API 方法（兼容现有 mock 数据）
      const { searchGoods } = await import('@/api/goods')
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
   * @param {number} price - 现价
   * @param {number} originalPrice - 原价
   * @returns {number} 折扣百分比
   */
  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round((1 - price / originalPrice) * 100)
  }

  /**
   * 格式化折扣显示
   * @param {number} price - 现价
   * @param {number} originalPrice - 原价
   * @returns {string} 折扣文本
   */
  const formatDiscount = (price, originalPrice) => {
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

