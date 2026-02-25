import type { ApiResponse, UserInfo } from '@/types'

/**
 * 更新用户资料
 */
export function updateProfile(data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          ...data,
          id: 1
        } as UserInfo,
        message: '更新成功'
      })
    }, 500)
  })
}

/**
 * 上传头像
 */
export function uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
  return new Promise((resolve, reject) => {
    // 模拟文件上传
    // 实际项目中应该上传到服务器，这里使用 base64 作为临时方案
    const reader = new FileReader()
    
    reader.onload = (e) => {
      // 将图片转换为 base64 格式
      const base64 = e.target?.result as string
      
      // 模拟上传延迟
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            avatar: base64
          },
          message: '上传成功'
        })
      }, 300)
    }
    
    reader.onerror = () => {
      reject({
        code: 500,
        message: '图片读取失败'
      })
    }
    
    // 读取文件为 base64
    reader.readAsDataURL(file)
  })
}

