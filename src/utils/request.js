import axios from 'axios'
import { showFailToast } from 'vant'

// Vite 使用 import.meta.env 访问环境变量
// 环境变量需要以 VITE_ 开头才能在客户端代码中访问
const BASE_API = import.meta.env.VITE_APP_BASE_API || '/api'

// 创建 axios 实例
const service = axios.create({
  baseURL: BASE_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截：可在此添加 token
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截：统一处理 code/message
service.interceptors.response.use(
  (response) => {
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
    return Promise.reject(error)
  }
)

// 生成模块化 API 调用
export const createApi = (moduleName = '') => {
  const prefix = moduleName ? `/${moduleName}` : ''
  return {
    get: (url, params) => service.get(`${prefix}${url}`, { params }),
    post: (url, data) => service.post(`${prefix}${url}`, data),
    put: (url, data) => service.put(`${prefix}${url}`, data),
    delete: (url, params) => service.delete(`${prefix}${url}`, { params })
  }
}

export default service
