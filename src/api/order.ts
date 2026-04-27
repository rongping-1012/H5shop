import type { ApiResponse, CartItem, Address } from '@/types'
import { OrderStatus } from '@/types'

// 模拟订单数据（扩展 Order 类型以包含 items）
interface MockOrder {
  id: string | number
  orderNo: string
  status: OrderStatus
  items: CartItem[]
  goodsList: CartItem[]
  totalPrice: number
  amount: number
  createTime: string
  address?: Address
}

let mockOrders: MockOrder[] = []

interface CreateOrderPayload {
  items: CartItem[]
  amount: number
  addressId?: number
  couponId?: number
}

interface PayOrderData {
  couponId?: number
  discountAmount?: number
}

/**
 * 创建订单
 */
export const createOrder = (payload: CreateOrderPayload): Promise<ApiResponse<MockOrder>> => {
  const newOrder: MockOrder = {
    id: String(Date.now()),
    orderNo: String(Date.now()),
    status: OrderStatus.PENDING,
    items: payload?.items || [],
    goodsList: payload?.items || [],
    totalPrice: payload?.amount || 0,
    amount: payload?.amount || 0,
    createTime: new Date().toISOString()
  }
  mockOrders.unshift(newOrder)
  return Promise.resolve({
    code: 200,
    data: newOrder
  })
}

/**
 * 获取订单列表
 */
export const getOrderList = (): Promise<ApiResponse<MockOrder[]>> => {
  return Promise.resolve({
    code: 200,
    data: mockOrders
  })
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (orderId: string | number): Promise<ApiResponse<MockOrder | null>> => {
  const detail = mockOrders.find((item) => item.id === String(orderId))
  return Promise.resolve({
    code: 200,
    data: detail || null
  })
}

/**
 * 取消订单
 */
export const cancelOrder = (orderId: string | number): Promise<ApiResponse<MockOrder>> => {
  mockOrders = mockOrders.map((item) =>
    item.id === String(orderId) ? { ...item, status: OrderStatus.CANCELLED } : item
  )
  const order = mockOrders.find((item) => item.id === String(orderId))
  if (!order) {
    throw new Error('订单不存在')
  }
  return Promise.resolve({
    code: 200,
    data: order
  })
}

/**
 * 支付订单
 */
export const payOrder = (orderId: string | number, payData: PayOrderData = {}): Promise<ApiResponse<MockOrder>> => {
  mockOrders = mockOrders.map((item) => {
    if (item.id === String(orderId)) {
      const updated: MockOrder = { 
        ...item, 
        status: OrderStatus.PAID 
      }
      // 如果有优惠券信息，保存到订单中
      if (payData.couponId) {
        // 更新订单金额为实际支付金额
        const actualAmount = Math.max(0, item.totalPrice - (payData.discountAmount || 0))
        updated.totalPrice = actualAmount
        updated.amount = actualAmount
      }
      return updated
    }
    return item
  })
  const order = mockOrders.find((item) => item.id === String(orderId))
  if (!order) {
    throw new Error('订单不存在')
  }
  return Promise.resolve({
    code: 200,
    data: order
  })
}

