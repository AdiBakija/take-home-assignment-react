import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { getAuthCookies, setAuthCookies } from '../utils/auth.js'
import { setContext } from '@apollo/client/link/context'
import { onError } from "@apollo/client/link/error"

const refreshToken = async () => {
    const { accessToken, refreshToken } = getAuthCookies()
    console.log('Access Token: ', accessToken)
    console.log('Refresh Token: ', refreshToken)

    try {
        const result = await client.mutate(
            {
                mutation: gql`
                    mutation {
                        refreshSession(accessToken: String!, refreshToken: String!) {
                            accessToken
                            refreshToken
                            expiresAt
                        }
                    }`,
                variables: {
                    accessToken: accessToken,
                    refreshTokens: refreshToken,
                }
            }
        )

        const newAccessToken = result.data.refreshSession.accessToken
        const newRefreshToken = result.data.refreshSession.refreshToken
        const newExpiresAt = result.data.refreshSession.expiresAt

        // Update cookies with the new tokens and expiration time
        setAuthCookies({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresAt: newExpiresAt,
        })

        return newAccessToken
    } catch (error) {
        // Handle error during token refresh
        throw new Error('Failed to refresh token')
    }
}

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql/',
})

const authLink = setContext((_, { headers }) => {
    const { accessToken } = getAuthCookies()
    return {
        headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
    }
})

// Link for handling session refresh and retrying the initial request via forward
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    // Since "UNAUTHENTICATED" is what the error returned is, refresh token in this case
    const unauthenticatedError = graphQLErrors?.find(error => error.extensions.code === "UNAUTHENTICATED")

    if (unauthenticatedError) {
        operation.setContext({
            headers: {
                ...operation.getContext().headers,
                authorization: `Bearer ${refreshToken()}`
            }
        })
    }

    return forward(operation)
})

export const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
})