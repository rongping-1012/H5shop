import type { Router } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { showFailToast } from 'vant'

const whiteList = ['/login', '/register', '/', '/home'] // 白名单，允许未登录访问首页

export function setupRouterGuard(router: Router): void {
  router.beforeEach(async (to, _from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - 掌上优选` : '掌上优选'
    
    const hasToken = getToken()
    
    if (hasToken) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        const userStore = useUserStore()
        try {
          await userStore.getUserInfo()
          next()
        } catch (error) {
          await userStore.resetToken()
          showFailToast('登录已过期，请重新登录')
          next(`/login?redirect=${to.path}`)
        }
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
      }
    }
  })

  router.afterEach(() => {
    window.scrollTo(0, 0)
  })
}

