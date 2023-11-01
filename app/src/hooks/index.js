import Cookies from 'js-cookie';

const useAuth = () => {
  const accessToken = Cookies.get('accessToken')
  const isAuthenticated = !!accessToken

  return {
    isAuthenticated,
    accessToken,
  }
}

export default useAuth