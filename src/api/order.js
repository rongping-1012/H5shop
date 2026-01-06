import { createApi } from '@/utils/request'

const orderApi = createApi('order')

// 模拟订单数据
let mockOrders = [
  {
    id: '20240001',
    status: 'pending',
    items: [],
    amount: 199,
    createdAt: Date.now()
  }
]

export const createOrder = (payload) => {
  const newOrder = {
    id: String(Date.now()),
    status: 'pending',
    items: payload?.items || [],
    amount: payload?.amount || 0,
    createdAt: Date.now()
  }
  mockOrders.unshift(newOrder)
  return Promise.resolve({
    code: 200,
    data: newOrder
  })
}

export const getOrderList = () => {
  return Promise.resolve({
    code: 200,
    data: mockOrders
  })
}

export const getOrderDetail = (orderId) => {
  const detail = mockOrders.find((item) => item.id === orderId)
  return Promise.resolve({
    code: 200,
    data: detail || null
  })
}

export const cancelOrder = (orderId) => {
  mockOrders = mockOrders.map((item) =>
    item.id === orderId ? { ...item, status: 'cancelled' } : item
  )
  return Promise.resolve({
    code: 200,
    data: mockOrders.find((item) => item.id === orderId)
  })
}

export const payOrder = (orderId, payData = {}) => {
  mockOrders = mockOrders.map((item) => {
    if (item.id === orderId) {
      const updated = { ...item, status: 'finished' }
      // 如果有优惠券信息，保存到订单中
      if (payData.couponId) {
        updated.couponId = payData.couponId
        updated.couponDiscount = payData.discountAmount || 0
        // 更新订单金额为实际支付金额
        updated.amount = Math.max(0, item.amount - (payData.discountAmount || 0))
      }
      return updated
    }
    return item
  })
  return Promise.resolve({
    code: 200,
    data: mockOrders.find((item) => item.id === orderId)
  })
}
