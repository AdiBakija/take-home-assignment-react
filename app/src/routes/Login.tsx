import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/index'
import Cookies from 'js-cookie'

const LOGIN_MUTATION = gql`
    mutation Authenticate($email: String!, $password: String!) {
        authenticate(email: $email, password: $password) {
            accessToken
            refreshToken
            expiresAt
        }
    }
`

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [login, { error, loading }] = useMutation(LOGIN_MUTATION)
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/products')
        }
    }, [isAuthenticated])

    const handleLogin = async () => {
        try {
            const { data } = await login({
                variables: { email, password },
            })
            console.log('Data', data)
            const accessToken = data.authenticate.accessToken
            const refreshToken = data.authenticate.refreshToken
            const expiresAt = data.authenticate.expiresAt

            // Save session to cookies to persist user
            Cookies.set(
                'accessToken',
                accessToken,
                {
                    expires: new Date(expiresAt),
                    sameSite: 'strict',
                }
            )
            Cookies.set(
                'refreshToken',
                refreshToken,
                {
                    sameSite: 'strict',
                }
            )
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <div>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </div>
    )
}

export default Login
