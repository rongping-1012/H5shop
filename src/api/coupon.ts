import type { ApiResponse, Coupon } from '@/types'
import { CouponType, CouponStatus } from '@/types'

// Mock 优惠券数据
interface MockCoupon {
  id: number
  name: string
  type: CouponType | 'shipping'
  value: number
  minAmount: number
  desc: string
  validStart: string
  validEnd: string
  status: CouponStatus | 'available' | 'used' | 'expired'
  usedAt: string | null
}

const mockCoupons: MockCoupon[] = [
  {
    id: 1,
    name: '新用户专享',
    type: CouponType.DISCOUNT,
    value: 10,
    minAmount: 50,
    desc: '满50元可用',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 2,
    name: '满减优惠券',
    type: CouponType.CASH,
    value: 20,
    minAmount: 100,
    desc: '满100减20',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 3,
    name: '免邮券',
    type: 'shipping' as any,
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
    type: CouponType.DISCOUNT,
    value: 15,
    minAmount: 80,
    desc: '满80打85折',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 5,
    name: '大额满减',
    type: CouponType.CASH,
    value: 50,
    minAmount: 300,
    desc: '满300减50',
    validStart: '2024-01-01',
    validEnd: '2025-12-31',
    status: 'available',
    usedAt: null
  },
  {
    id: 6,
    name: '超值折扣',
    type: CouponType.DISCOUNT,
    value: 20,
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
    type: CouponType.DISCOUNT,
    value: 15,
    minAmount: 150,
    desc: '满150打85折',
    validStart: '2024-01-01',
    validEnd: '2024-12-31',
    status: CouponStatus.USED,
    usedAt: '2024-01-15'
  },
  {
    id: 8,
    name: '会员专享',
    type: CouponType.CASH,
    value: 50,
    minAmount: 500,
    desc: '满500减50',
    validStart: '2024-01-01',
    validEnd: '2024-03-31',
    status: CouponStatus.EXPIRED,
    usedAt: null
  }
]

interface GetCouponListParams {
  status?: 'all' | CouponStatus | 'available' | 'used' | 'expired'
}

/**
 * 获取优惠券列表
 */
export const getCouponList = (params: GetCouponListParams = {}): Promise<ApiResponse<Coupon[]>> => {
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
      item.status = CouponStatus.EXPIRED
    }
    return item
  })
  
  // 转换为 Coupon 类型
  const coupons: Coupon[] = list.map(item => ({
    id: item.id,
    name: item.name,
    amount: item.value,
    minAmount: item.minAmount,
    type: item.type as CouponType,
    status: item.status as CouponStatus,
    expireTime: item.validEnd
  }))
  
  return Promise.resolve({
    code: 200,
    data: coupons
  })
}

/**
 * 领取优惠券
 */
export const receiveCoupon = (couponId: number): Promise<ApiResponse<Coupon>> => {
  const coupon = mockCoupons.find(item => item.id === couponId)
  if (!coupon) {
    return Promise.resolve({
      code: 404,
      message: '优惠券不存在',
      data: null as any
    })
  }
  
  if (coupon.status !== 'available') {
    return Promise.resolve({
      code: 400,
      message: '优惠券不可领取',
      data: null as any
    })
  }
  
  const result: Coupon = {
    id: coupon.id,
    name: coupon.name,
    amount: coupon.value,
    minAmount: coupon.minAmount,
    type: coupon.type as CouponType,
    status: coupon.status as CouponStatus,
    expireTime: coupon.validEnd
  }
  
  return Promise.resolve({
    code: 200,
    message: '领取成功',
    data: result
  })
}

/**
 * 使用优惠券
 */
export const useCoupon = (couponId: number, _orderId: string | number): Promise<ApiResponse<Coupon>> => {
  const coupon = mockCoupons.find(item => item.id === couponId)
  if (!coupon) {
    return Promise.resolve({
      code: 404,
      message: '优惠券不存在',
      data: null as any
    })
  }
  
  if (coupon.status !== 'available') {
    return Promise.resolve({
      code: 400,
      message: '优惠券不可用',
      data: null as any
    })
  }
  
  // 更新优惠券状态
  coupon.status = CouponStatus.USED
  coupon.usedAt = new Date().toISOString()
  
  const result: Coupon = {
    id: coupon.id,
    name: coupon.name,
    amount: coupon.value,
    minAmount: coupon.minAmount,
    type: coupon.type as CouponType,
    status: CouponStatus.USED,
    expireTime: coupon.validEnd
  }
  
  return Promise.resolve({
    code: 200,
    message: '使用成功',
    data: result
  })
}

/**
 * 获取可用优惠券（根据订单金额）
 */
export const getAvailableCoupons = (amount: number): Promise<ApiResponse<Coupon[]>> => {
  const now = new Date()
  const available = mockCoupons.filter(item => {
    if (item.status !== 'available') return false
    const endDate = new Date(item.validEnd)
    if (endDate < now) return false
    if (amount < item.minAmount) return false
    return true
  })
  
  const coupons: Coupon[] = available.map(item => ({
    id: item.id,
    name: item.name,
    amount: item.value,
    minAmount: item.minAmount,
    type: item.type as CouponType,
    status: item.status as CouponStatus,
    expireTime: item.validEnd
  }))
  
  return Promise.resolve({
    code: 200,
    data: coupons
  })
}

