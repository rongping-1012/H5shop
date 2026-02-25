import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const pinia = createPinia()

// 持久化存储配置
pinia.use(
  createPersistedState({
    storage: {
      getItem: (key: string): string | null => {
        try {
          return localStorage.getItem(key)
        } catch (error) {
          console.error('Storage getItem error:', error)
          return null
        }
      },
      setItem: (key: string, value: string): void => {
        try {
          localStorage.setItem(key, value)
        } catch (error) {
          console.error('Storage setItem error:', error)
        }
      },
    }
  })
)

export default pinia

