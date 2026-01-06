import { defineStore } from 'pinia'
import { login, getUserInfo, logout, register } from '@/api/user'
import { updateProfile } from '@/api/profile'
import { setToken, getToken, removeToken, setUserInfo, removeUserInfo } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: null,
    roles: [],
    permissions: []
  }),

  getters: {
    isLogin: (state) => !!state.token,
    avatar: (state) => state.userInfo?.avatar || '',
    nickname: (state) => state.userInfo?.nickname || '未登录',
    userId: (state) => state.userInfo?.id || ''
  },

  actions: {
    async login(loginForm) {
      try {
        const res = await login(loginForm.username, loginForm.password)
        if (res.code === 200) {
          const { token, userInfo } = res.data
          this.token = token
          this.userInfo = userInfo
          setToken(token)
          setUserInfo(userInfo)
        }
        return res
      } catch (error) {
        console.error('登录失败:', error)
        return Promise.reject(error)
      }
    },

    async register(form) {
      try {
        const res = await register(form)
        if (res.code === 200) {
          const { token, userInfo } = res.data
          this.token = token
          this.userInfo = userInfo
          setToken(token)
          setUserInfo(userInfo)
        }
        return res
      } catch (error) {
        console.error('注册失败:', error)
        return Promise.reject(error)
      }
    },

    async getUserInfo() {
      try {
        const res = await getUserInfo()
        if (res.code === 200) {
          this.userInfo = res.data
          setUserInfo(res.data)
        }
        return res
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return Promise.reject(error)
      }
    },

    async userLogout() {
      try {
        await logout()
        this.resetToken()
        return Promise.resolve()
      } catch (error) {
        console.error('退出登录失败:', error)
        return Promise.reject(error)
      }
    },

    async updateUserProfile(data) {
      try {
        const res = await updateProfile(data)
        if (res.code === 200) {
          // 确保 userInfo 存在，如果不存在则初始化
          if (!this.userInfo) {
            this.userInfo = {}
          }
          // 合并更新数据，确保头像等字段被正确更新
          this.userInfo = { ...this.userInfo, ...res.data }
          // 保存到 localStorage
          setUserInfo(this.userInfo)
          // 触发响应式更新
          this.userInfo = { ...this.userInfo }
        }
        return res
      } catch (error) {
        console.error('更新用户资料失败:', error)
        return Promise.reject(error)
      }
    },

    resetToken() {
      this.token = ''
      this.userInfo = null
      this.roles = []
      this.permissions = []
      removeToken()
      removeUserInfo()
    }
  }
})
