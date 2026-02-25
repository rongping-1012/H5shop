import { defineStore } from 'pinia'
import { getCartList, addToCart, updateCartItem, removeCartItem } from '@/api/cart'
import type { CartItem, Goods, ApiResponse } from '@/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartList: [] as CartItem[],
    selectedItems: [] as CartItem[]
  }),

  getters: {
    totalCount: (state): number => {
      return state.cartList.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice: (state): string => {
      return state.cartList
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)
    }
  },

  actions: {
    async fetchCartList(): Promise<ApiResponse<CartItem[]>> {
      try {
        const res = await getCartList()
        if (res.code === 200) {
          this.cartList = res.data
        }
        return res
      } catch (error) {
        console.error('获取购物车列表失败:', error)
        return Promise.reject(error)
      }
    },

    async addItemToCart(product: Goods): Promise<ApiResponse<CartItem[]>> {
      try {
        const res = await addToCart(product)
        if (res.code === 200) {
          this.cartList = res.data
        }
        return res
      } catch (error) {
        console.error('添加商品到购物车失败:', error)
        return Promise.reject(error)
      }
    },

    async addItem(product: Goods): Promise<ApiResponse<CartItem[]>> {
      // 便捷方法，直接调用 addItemToCart
      return this.addItemToCart(product)
    },

    async updateItemQuantity(productId: number, quantity: number): Promise<ApiResponse<CartItem[]>> {
      try {
        const res = await updateCartItem(productId, quantity)
        if (res.code === 200) {
          this.cartList = res.data
        }
        return res
      } catch (error) {
        console.error('更新购物车商品数量失败:', error)
        return Promise.reject(error)
      }
    },

    async removeItem(productId: number): Promise<ApiResponse<CartItem[]>> {
      try {
        const res = await removeCartItem(productId)
        if (res.code === 200) {
          this.cartList = res.data
        }
        return res
      } catch (error) {
        console.error('从购物车移除商品失败:', error)
        return Promise.reject(error)
      }
    }
  }
})

