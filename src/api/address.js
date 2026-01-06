import { createApi } from '@/utils/request'

const addressApi = createApi('address')

// Mock 地址数据
let mockAddresses = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '三里屯街道工体北路8号',
    detail: '三里屯SOHO A座1001室',
    isDefault: true,
    latitude: 39.9042,
    longitude: 116.4074
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '黄浦区',
    address: '南京东路100号',
    detail: '外滩18号',
    isDefault: false,
    latitude: 31.2304,
    longitude: 121.4737
  }
]

// 获取地址列表
export function getAddressList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockAddresses
      })
    }, 300)
  })
}

// 获取地址详情
export function getAddressDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const address = mockAddresses.find((item) => item.id === Number(id))
      if (address) {
        resolve({
          code: 200,
          data: address
        })
      } else {
        reject({ code: 404, message: '地址不存在' })
      }
    }, 300)
  })
}

// 添加地址
export function addAddress(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAddress = {
        id: mockAddresses.length + 1,
        ...data,
        isDefault: mockAddresses.length === 0 || data.isDefault || false
      }

      // 如果设置为默认地址，取消其他默认地址
      if (newAddress.isDefault) {
        mockAddresses.forEach((item) => {
          item.isDefault = false
        })
      }

      mockAddresses.push(newAddress)
      resolve({
        code: 200,
        data: newAddress
      })
    }, 300)
  })
}

// 更新地址
export function updateAddress(id, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAddresses.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        reject({ code: 404, message: '地址不存在' })
        return
      }

      // 如果设置为默认地址，取消其他默认地址
      if (data.isDefault) {
        mockAddresses.forEach((item) => {
          if (item.id !== Number(id)) {
            item.isDefault = false
          }
        })
      }

      mockAddresses[index] = { ...mockAddresses[index], ...data }
      resolve({
        code: 200,
        data: mockAddresses[index]
      })
    }, 300)
  })
}

// 删除地址
export function deleteAddress(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAddresses.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        reject({ code: 404, message: '地址不存在' })
        return
      }

      mockAddresses.splice(index, 1)
      resolve({
        code: 200,
        message: '删除成功'
      })
    }, 300)
  })
}

// 设置默认地址
export function setDefaultAddress(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAddresses.findIndex((item) => item.id === Number(id))
      if (index === -1) {
        reject({ code: 404, message: '地址不存在' })
        return
      }

      // 取消所有默认地址
      mockAddresses.forEach((item) => {
        item.isDefault = false
      })

      // 设置新的默认地址
      mockAddresses[index].isDefault = true

      resolve({
        code: 200,
        data: mockAddresses[index]
      })
    }, 300)
  })
}

