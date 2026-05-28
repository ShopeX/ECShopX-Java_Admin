/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

export const USERCENTER_LOGIN_STORAGE_KEY = 'ecshopx_usercenter_login'

export function setUsercenterLoginSuccess(extra = {}) {
  localStorage.setItem(
    USERCENTER_LOGIN_STORAGE_KEY,
    JSON.stringify({
      loggedIn: true,
      loggedInAt: Date.now(),
      ...extra
    })
  )
}

export function getUsercenterLoginState() {
  try {
    const raw = localStorage.getItem(USERCENTER_LOGIN_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data && data.loggedIn ? data : null
  } catch (e) {
    return null
  }
}

export function clearUsercenterLoginState() {
  localStorage.removeItem(USERCENTER_LOGIN_STORAGE_KEY)
}

export function isUsercenterLoggedIn() {
  return !!getUsercenterLoginState()
}
