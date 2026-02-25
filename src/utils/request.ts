import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { showFailToast } from 'vant'
import type { ApiResponse } from '@/types'

// Vite 使用 import.meta.env 访问环境变量
// 环境变量需要以 VITE_ 开头才能在客户端代码中访问
const BASE_API = import.meta.env.VITE_APP_BASE_API || '/api'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: BASE_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截：可在此添加 token
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截：统一处理 code/message
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const payload = response.data || {}
    const { code, data, message } = payload

    if (code === 200 || code === 0 || code === undefined) {
      return data ?? payload
    }

    showFailToast(message || '请求失败')
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    const msg = error?.response?.data?.message || error.message || '网络异常'
    showFailToast(msg)
    
    // 401 未授权，跳转到登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

/**
 * API 模块接口
 */
export interface ApiModule {
  get: <T = any>(url: string, params?: any) => Promise<T>
  post: <T = any>(url: string, data?: any) => Promise<T>
  put: <T = any>(url: string, data?: any) => Promise<T>
  delete: <T = any>(url: string, params?: any) => Promise<T>
}

/**
 * 生成模块化 API 调用
 */
export const createApi = (moduleName = ''): ApiModule => {
  const prefix = moduleName ? `/${moduleName}` : ''
  return {
    get: async <T = any>(url: string, params?: any): Promise<T> => {
      const response = await service.get<ApiResponse<T>>(`${prefix}${url}`, { params })
      return response as unknown as T
    },
    post: async <T = any>(url: string, data?: any): Promise<T> => {
      const response = await service.post<ApiResponse<T>>(`${prefix}${url}`, data)
      return response as unknown as T
    },
    put: async <T = any>(url: string, data?: any): Promise<T> => {
      const response = await service.put<ApiResponse<T>>(`${prefix}${url}`, data)
      return response as unknown as T
    },
    delete: async <T = any>(url: string, params?: any): Promise<T> => {
      const response = await service.delete<ApiResponse<T>>(`${prefix}${url}`, { params })
      return response as unknown as T
    }
  }
}

export default service

