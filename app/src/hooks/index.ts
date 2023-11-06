import { getAuthCookies } from "../utils/auth"

interface AuthData {
  isAuthenticated: boolean;
  accessToken: string | undefined;
}

const useAuth = (): AuthData => {
  const { accessToken } = getAuthCookies()
  const isAuthenticated = !!accessToken

  return {
    isAuthenticated,
    accessToken,
  }
}

export default useAuth