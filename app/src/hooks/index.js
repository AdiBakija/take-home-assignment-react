import { getAuthCookies } from "../utils/auth"

const useAuth = () => {
  const { accessToken } = getAuthCookies()
  const isAuthenticated = !!accessToken

  return {
    isAuthenticated,
    accessToken,
  }
}

export default useAuth