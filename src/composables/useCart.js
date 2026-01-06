import { computed } from 'vue'
import { useCartStore } from '@/store/modules/cart'
import { showSuccessToast, showFailToast } from 'vant'

export const useCart = () => {
  const cartStore = useCartStore()

  const addToCart = async (product) => {
    try {
      await cartStore.addItemToCart(product)
      showSuccessToast('已加入购物车')
    } catch (error) {
      showFailToast('添加失败，请稍后重试')
    }
  }

  const removeFromCart = async (id) => {
    await cartStore.removeItem(id)
  }

  const updateQuantity = async (id, quantity) => {
    await cartStore.updateItemQuantity(id, quantity)
  }

  return {
    items: computed(() => cartStore.cartList),
    totalCount: computed(() => cartStore.totalCount),
    totalPrice: computed(() => cartStore.totalPrice),
    addToCart,
    removeFromCart,
    updateQuantity
  }
}
