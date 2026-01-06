// 模拟用户数据
const mockUser = {
  id: 1,
  username: 'testuser',
  nickname: '椰椰',
  avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
  email: 'test@example.com',
  phone: '13800138000'
}

// 登录
export function login(username, password) {
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

// 获取用户信息
export function getUserInfo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: mockUser
      })
    }, 300)
  })
}

// 登出
export function logout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200 })
    }, 300)
  })
}

// 注册（mock）
export function register(payload) {
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
            nickname: payload.username
          }
        }
      })
    }, 500)
  })
}
