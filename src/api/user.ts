import type { ApiResponse, UserInfo, RegisterForm, LoginResponse } from '@/types'

// 模拟用户数据
const mockUser: UserInfo = {
  id: 1,
  username: 'testuser',
  nickname: '椰椰',
  avatar: 'http://q6.itc.cn/q_70/images03/20250306/355fba6a5cb049f5b98c2ed9f03cc5e1.jpeg',
  email: 'test@example.com',
  phone: '13800138000'
}

/**
 * 登录
 */
export function login(_username: string, _password: string): Promise<ApiResponse<LoginResponse>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          token: 'mock_token_' + Date.now(),
          userInfo: mockUser
        }
      })
    }, 500)
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockUser
      })
    }, 300)
  })
}

/**
 * 登出
 */
export function logout(): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, data: null })
    }, 300)
  })
}

/**
 * 注册
 */
export function register(payload: RegisterForm): Promise<ApiResponse<LoginResponse>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload?.username || !payload?.password) {
        reject({ code: 400, message: '用户名或密码不能为空' })
        return
      }

      resolve({
        code: 200,
        data: {
          token: 'mock_token_' + Date.now(),
          userInfo: {
            ...mockUser,
            username: payload.username,
            nickname: payload.nickname || payload.username
          }
        }
      })
    }, 500)
  })
}

