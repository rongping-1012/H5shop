import { defineStore } from 'pinia'
import { getCartList, addToCart, updateCartItem, removeCartItem } from '@/api/cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartList: [],
    selectedItems: []
  }),

  getters: {
    totalCount: (state) => {
      return state.cartList.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice: (state) => {
      return state.cartList
        .filter((item) => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)
    }
  },

  actions: {
    async fetchCartList() {
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

    async addItemToCart(product) {
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

    async addItem(product) {
      // 便捷方法，直接调用 addItemToCart
      return this.addItemToCart(product)
    },

    async updateItemQuantity(productId, quantity) {
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

    async removeItem(productId) {
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
