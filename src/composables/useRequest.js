import axios from 'axios'
import { showToast } from 'vant'

/**
 * 请求组合式函数
 * 封装 axios 实例，提供统一的请求拦截和错误处理
 */
export function useRequest() {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加 token
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      const { code, message, data } = response.data || {}
      
      if (code === 200 || code === 0 || code === undefined) {
        return data ?? response.data
      } else {
        showToast(message || '请求失败')
        return Promise.reject(new Error(message || '请求失败'))
      }
    },
    (error) => {
      if (error.response?.status === 401) {
        // 未授权处理
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      const msg = error.response?.data?.message || error.message || '网络错误'
      showToast(msg)
      return Promise.reject(error)
    }
  )

  /**
   * 通用请求方法
   * @param {Object} config - axios 请求配置
   * @returns {Promise} 请求结果
   */
  const request = async (config) => {
    try {
      return await instance.request(config)
    } catch (error) {
      throw error
    }
  }

  return { request, instance }
}

