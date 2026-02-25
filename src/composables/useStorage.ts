/**
 * 本地存储组合式函数
 * 提供带过期时间的本地存储功能
 */

interface StorageData<T = any> {
  value: T
  expire: number | null
}

/**
 * 设置存储项
 * @param key - 存储键
 * @param value - 存储值
 * @param expire - 过期时间（毫秒），可选
 */
export function setItem<T = any>(key: string, value: T, expire: number | null = null): void {
  try {
    const data: StorageData<T> = {
      value,
      expire: expire ? Date.now() + expire : null
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Storage setItem error:', error)
  }
}

/**
 * 获取存储项
 * @param key - 存储键
 * @returns 存储值，如果过期或不存在则返回 null
 */
export function getItem<T = any>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null

    const data = JSON.parse(item) as StorageData<T>
    
    // 检查是否过期
    if (data.expire && Date.now() > data.expire) {
      localStorage.removeItem(key)
      return null
    }

    return data.value
  } catch (error) {
    console.error('Storage getItem error:', error)
    return null
  }
}

/**
 * 删除存储项
 * @param key - 存储键
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Storage removeItem error:', error)
  }
}

/**
 * 清空所有存储
 */
export function clear(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Storage clear error:', error)
  }
}

/**
 * 使用存储的组合式函数
 */
export function useStorage() {
  return {
    getItem,
    setItem,
    removeItem,
    clear
  }
}

