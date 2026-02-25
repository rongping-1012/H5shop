import type { ApiResponse, CartItem, Goods } from '@/types'

// 模拟购物车数据
let cartItems: CartItem[] = []

/**
 * 获取购物车列表
 */
export function getCartList(): Promise<ApiResponse<CartItem[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: cartItems
      })
    }, 300)
  })
}

/**
 * 添加商品到购物车
 */
export function addToCart(product: Goods): Promise<ApiResponse<CartItem[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingItem = cartItems.find((item) => item.id === product.id)
      const quantity = product.quantity || 1
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cartItems.push({
          ...product,
          quantity: quantity,
          selected: true
        })
      }
      resolve({
        code: 200,
        data: [...cartItems]
      })
    }, 300)
  })
}

/**
 * 更新购物车商品数量
 */
export function updateCartItem(productId: number, quantity: number): Promise<ApiResponse<CartItem[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = cartItems.find((item) => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
      resolve({
        code: 200,
        data: [...cartItems]
      })
    }, 300)
  })
}

/**
 * 删除购物车商品
 */
export function removeCartItem(productId: number): Promise<ApiResponse<CartItem[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      cartItems = cartItems.filter((item) => item.id !== productId)
      resolve({
        code: 200,
        data: [...cartItems]
      })
    }, 300)
  })
}

