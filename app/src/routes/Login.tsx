import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { setAuthCookies } from '../utils/auth'
import Button from '../components/Button'
import Input from '../components/Input'
import useAuth from '../hooks/index'
import logo from '../assets/Logo.png'

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
            const accessToken = data.authenticate.accessToken
            const refreshToken = data.authenticate.refreshToken
            const expiresAt = data.authenticate.expiresAt

            // Save session to cookies to persist user
            setAuthCookies({ accessToken, refreshToken, expiresAt })
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    return (
        <>
            <div className="min-h-full w-[466px] p-14 bg-white rounded-[10px] shadow-[0_0_6px_0_rgba(0,0,0,0.20)]">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="h-10 mb-10" src={logo} alt="Judo Logo" />
                    <h2 className="mb-8 text-3xl/10 font-semibold leading-10 text-black">Sign in</h2>
                </div>
                <Input
                    className='mb-6'
                    label="Email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <Input
                    className='mb-6'
                    label="Password"
                    type="password"
                    autoComplete="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <Button
                    className='mb-6'
                    label={loading ? 'Signing In...' : 'Sign In'}
                    onClick={handleLogin}
                    to=''
                    disabled={loading}
                />
                <div className="text-sm text-center">
                    <a href="#" className="font-bold text-black">Forgot password?</a>
                </div>
            </div>
            <div className='mt-8'>
                <p className='text-sm/6 text-center text-[#858484] tracking-normal'>@2001-2019 All Rights Reserved. Clip&#174; is a registered trademark of Rover Labs.</p>
                <p className='text-sm/6 text-center text-[#858484] tracking-normal'>Cookie Preferences, Privacy and Terms.</p>
            </div>
            {error && <p>Error: {error.message}</p>}
        </>
    )
}

export default Login
