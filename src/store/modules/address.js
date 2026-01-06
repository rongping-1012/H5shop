import { defineStore } from 'pinia'
import {
  getAddressList,
  getAddressDetail,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/api/address'

export const useAddressStore = defineStore('address', {
  state: () => ({
    addressList: []
  }),

  getters: {
    defaultAddress: (state) => {
      return state.addressList.find((item) => item.isDefault) || null
    }
  },

  actions: {
    async fetchAddressList() {
      try {
        const res = await getAddressList()
        if (res.code === 200) {
          this.addressList = res.data || []
        }
        return res
      } catch (error) {
        console.error('获取地址列表失败:', error)
        return Promise.reject(error)
      }
    },

    async fetchAddressDetail(id) {
      try {
        const res = await getAddressDetail(id)
        if (res.code === 200) {
          return res.data
        }
        return null
      } catch (error) {
        console.error('获取地址详情失败:', error)
        return Promise.reject(error)
      }
    },

    async addAddressItem(data) {
      try {
        const res = await addAddress(data)
        if (res.code === 200) {
          await this.fetchAddressList()
        }
        return res
      } catch (error) {
        console.error('添加地址失败:', error)
        return Promise.reject(error)
      }
    },

    async updateAddressItem(id, data) {
      try {
        const res = await updateAddress(id, data)
        if (res.code === 200) {
          await this.fetchAddressList()
        }
        return res
      } catch (error) {
        console.error('更新地址失败:', error)
        return Promise.reject(error)
      }
    },

    async deleteAddressItem(id) {
      try {
        const res = await deleteAddress(id)
        if (res.code === 200) {
          await this.fetchAddressList()
        }
        return res
      } catch (error) {
        console.error('删除地址失败:', error)
        return Promise.reject(error)
      }
    },

    async setDefaultAddressItem(id) {
      try {
        const res = await setDefaultAddress(id)
        if (res.code === 200) {
          await this.fetchAddressList()
        }
        return res
      } catch (error) {
        console.error('设置默认地址失败:', error)
        return Promise.reject(error)
      }
    }
  }
})

