import type { UserInfo } from '@/types'

/**
 * 获取 Token
 */
export function getToken(): string {
  return localStorage.getItem('token') || ''
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

/**
 * 移除 Token
 */
export function removeToken(): void {
  localStorage.removeItem('token')
}

/**
 * 获取用户信息
 */
export function getUserInfo(): UserInfo | null {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

/**
 * 设置用户信息
 */
export function setUserInfo(userInfo: UserInfo): void {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

/**
 * 移除用户信息
 */
export function removeUserInfo(): void {
  localStorage.removeItem('userInfo')
}

