import Cookies from 'js-cookie'

// Constants for cookie names
const ACCESS_TOKEN_COOKIE = 'accessToken'
const REFRESH_TOKEN_COOKIE = 'refreshToken'
const EXPIRES_AT_COOKIE = 'expiresAt'

// Get authentication cookies as an object
export function getAuthCookies() {
  const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE)
  const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE)
  const expiresAt = Cookies.get(EXPIRES_AT_COOKIE)

  return { accessToken, refreshToken, expiresAt }
}

// Set authentication cookies from an object
export function setAuthCookies({ accessToken, refreshToken, expiresAt }) {
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken)
  Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken)
  Cookies.set(EXPIRES_AT_COOKIE, expiresAt.toString())
}