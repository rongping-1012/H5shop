// src/utils/auth.js
export function getToken() {
  return localStorage.getItem('token') || ''
}

export function setToken(token) {
  return localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo')
  return userInfo ? JSON.parse(userInfo) : null
}

export function setUserInfo(userInfo) {
  return localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function removeUserInfo() {
  localStorage.removeItem('userInfo')
}
