// 优惠券 mock 数据与接口

// Mock 优惠券数据
const mockCoupons = [
  {
    id: 1,
    name: '新用户专享',
    type: 'discount', // discount: 折扣券, cash: 现金券, shipping: 免邮券
    value: 10, // 折扣值或金额
    minAmount: 50, // 最低消费金额（降低门槛便于测试）
    desc: '满50元可用',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available', // available: 可用, used: 已使用, expired: 已过期
    usedAt: null
  },
  {
    id: 2,
    name: '满减优惠券',
    type: 'cash',
    value: 20,
    minAmount: 100, // 降低门槛便于测试
    desc: '满100减20',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 3,
    name: '免邮券',
    type: 'shipping',
    value: 0,
    minAmount: 0,
    desc: '全场免邮',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 4,
    name: '限时折扣',
    type: 'discount',
    value: 15, // 85折
    minAmount: 80, // 降低门槛便于测试
    desc: '满80打85折',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available', // 改为可用
    usedAt: null
  },
  {
    id: 5,
    name: '大额满减',
    type: 'cash',
    value: 50,
    minAmount: 300, // 降低门槛便于测试
    desc: '满300减50',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available', // 改为可用
    usedAt: null
  },
  {
    id: 6,
    name: '超值折扣',
    type: 'discount',
    value: 20, // 8折
    minAmount: 200,
    desc: '满200打8折',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 7,
    name: '限时折扣',
    type: 'discount',
    value: 15,
    minAmount: 150,
    desc: '满150打85折',
    validStart: '2024-01-01',
    validEnd: '2024-12-31',
    status: 'used',
    usedAt: '2024-01-15'
  },
  {
    id: 8,
    name: '会员专享',
    type: 'cash',
    value: 50,
    minAmount: 500,
    desc: '满500减50',
    validStart: '2024-01-01',
    validEnd: '2024-03-31',
    status: 'expired',
    usedAt: null
  }
]

// 获取优惠券列表
export const getCouponList = (params = {}) => {
  const { status = 'all' } = params
  
  let list = [...mockCoupons]
  
  // 根据状态筛选
  if (status !== 'all') {
    list = list.filter(item => item.status === status)
  }
  
  // 检查是否过期
  const now = new Date()
  list = list.map(item => {
    const endDate = new Date(item.validEnd)
    if (endDate < now && item.status === 'available') {
      item.status = 'expired'
    }
    return item
  })
  
  return Promise.resolve({
    code: 200,
    data: list
  })
}

// 领取优惠券
export const receiveCoupon = (couponId) => {
  // 模拟领取逻辑
  const coupon = mockCoupons.find(item => item.id === couponId)
  if (!coupon) {
    return Promise.resolve({
      code: 404,
      message: '优惠券不存在'
    })
  }
  
  if (coupon.status !== 'available') {
    return Promise.resolve({
      code: 400,
      message: '优惠券不可领取'
    })
  }
  
  return Promise.resolve({
    code: 200,
    message: '领取成功',
    data: coupon
  })
}

// 使用优惠券
export const useCoupon = (couponId, orderId) => {
  const coupon = mockCoupons.find(item => item.id === couponId)
  if (!coupon) {
    return Promise.resolve({
      code: 404,
      message: '优惠券不存在'
    })
  }
  
  if (coupon.status !== 'available') {
    return Promise.resolve({
      code: 400,
      message: '优惠券不可用'
    })
  }
  
  // 更新优惠券状态
  coupon.status = 'used'
  coupon.usedAt = new Date().toISOString()
  
  return Promise.resolve({
    code: 200,
    message: '使用成功',
    data: coupon
  })
}

// 获取可用优惠券（根据订单金额）
export const getAvailableCoupons = (amount) => {
  const now = new Date()
  const available = mockCoupons.filter(item => {
    if (item.status !== 'available') return false
    const endDate = new Date(item.validEnd)
    if (endDate < now) return false
    if (amount < item.minAmount) return false
    return true
  })
  
  return Promise.resolve({
    code: 200,
    data: available
  })
}

