import Cookies from 'js-cookie'

// Constants for cookie names
const ACCESS_TOKEN_COOKIE = 'accessToken'
const REFRESH_TOKEN_COOKIE = 'refreshToken'
const EXPIRES_AT_COOKIE = 'expiresAt'

interface CookieData {
  accessToken: string | undefined
  refreshToken: string | undefined
  expiresAt: string | undefined
}

// Get authentication cookies as an object
export function getAuthCookies(): CookieData {
  const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE)
  const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE)
  const expiresAt = Cookies.get(EXPIRES_AT_COOKIE)

  return { accessToken, refreshToken, expiresAt }
}

// Set authentication cookies from an object
export function setAuthCookies({ accessToken, refreshToken, expiresAt }: CookieData) {
  if (accessToken !== undefined && refreshToken !== undefined && expiresAt !== undefined) {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken)
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken)
    Cookies.set(EXPIRES_AT_COOKIE, expiresAt.toString())
  }
}