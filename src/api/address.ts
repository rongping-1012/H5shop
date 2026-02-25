import type { ApiResponse, Address, AddressForm } from '@/types'

// Mock 地址数据
let mockAddresses: Address[] = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道工体北路8号三里屯SOHO A座1001室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '黄浦区',
    detail: '南京东路100号外滩18号',
    isDefault: false
  }
]

/**
 * 获取地址列表
 */
export function getAddressList(): Promise<ApiResponse<Address[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockAddresses
      })
    }, 300)
  })
}

/**
 * 获取地址详情
 */
export function getAddressDetail(id: string | number): Promise<ApiResponse<Address>> {
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

/**
 * 添加地址
 */
export function addAddress(data: AddressForm): Promise<ApiResponse<Address>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAddress: Address = {
        id: mockAddresses.length + 1,
        name: data.name,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
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

/**
 * 更新地址
 */
export function updateAddress(id: string | number, data: Partial<AddressForm>): Promise<ApiResponse<Address>> {
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

      const current = mockAddresses[index]
      if (!current) {
        reject({ code: 404, message: '地址不存在' })
        return
      }
      
      const updated: Address = {
        id: current.id,
        name: data.name ?? current.name,
        phone: data.phone ?? current.phone,
        province: data.province ?? current.province,
        city: data.city ?? current.city,
        district: data.district ?? current.district,
        detail: data.detail ?? current.detail,
        isDefault: data.isDefault !== undefined ? data.isDefault : current.isDefault
      }
      
      mockAddresses[index] = updated
      resolve({
        code: 200,
        data: updated
      })
    }, 300)
  })
}

/**
 * 删除地址
 */
export function deleteAddress(id: string | number): Promise<ApiResponse> {
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
        data: null,
        message: '删除成功'
      })
    }, 300)
  })
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: string | number): Promise<ApiResponse<Address>> {
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
      const address = mockAddresses[index]
      if (address) {
        address.isDefault = true
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

