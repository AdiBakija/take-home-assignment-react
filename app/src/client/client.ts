import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { getAuthCookies, setAuthCookies } from '../utils/auth.js'
import { setContext } from '@apollo/client/link/context'
import { onError } from "@apollo/client/link/error"

const refreshToken = async () => {
    const { accessToken, refreshToken } = getAuthCookies()

    try {
        let newAccessToken
        client.mutate(
            {
                mutation: gql`
                mutation RefreshSession($accessToken: String!, $refreshToken: String!) {
                    refreshSession(accessToken: $accessToken, refreshToken: $refreshToken) {
                      accessToken
                      refreshToken
                      expiresAt
                    }
                  }
                  `,
                variables: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                }
            }
        ).then((result) => {
            newAccessToken = result.data.refreshSession.accessToken
            const newRefreshToken = result.data.refreshSession.refreshToken
            const newExpiresAt = result.data.refreshSession.expiresAt
            
            // Update cookies with the new tokens and expiration time
            setAuthCookies({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresAt: newExpiresAt,
            })
          })
          .catch((error) => {
            console.error('Mutation Error:', error)
          })


        return newAccessToken
    } catch (error) {
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

let processingTokenRefresh = false
// Link for handling session refresh and retrying the initial request via forward
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    // Since "SESSION_EXPIRED" is what the error returned is, refresh token in this case
    const sessionExpiredError = graphQLErrors?.find(error => error.extensions.code === "SESSION_EXPIRED")

    if (sessionExpiredError && !processingTokenRefresh) {
        processingTokenRefresh = true
        refreshToken().then((accessToken) => {
            operation.setContext({
                headers: {
                    ...operation.getContext().headers,
                    authorization: `Bearer ${accessToken}`
                }
            })
            processingTokenRefresh = false
        })

        return forward(operation)
    }

    return forward(operation)
})

export const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
})