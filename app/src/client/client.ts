import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, gql, Observable } from '@apollo/client'
import { getAuthCookies, setAuthCookies } from '../utils/auth.js'
import { setContext } from '@apollo/client/link/context'
import { onError } from "@apollo/client/link/error"

const refreshToken = async () => {
    const { accessToken, refreshToken } = getAuthCookies()

    try {
        let newAccessToken

        const url = 'http://localhost:8080/api/refresh'
        const contentType = 'application/json'
        const requestBody = {
            accessToken,
            refreshToken,
        }
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
        }
        await fetch(url, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(`Request failed with status ${response.status}`)
            }
        })
        .then((result) => {
            // Handle the response data, which should contain accessToken, refreshToken, and expiresAt
            newAccessToken = result.accessToken
            const newRefreshToken = result.refreshToken
            const newExpiresAt = result.expiresAt
            
            // Update cookies with the new tokens and expiration time
            setAuthCookies({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresAt: newExpiresAt,
            })
        })
        .catch((error) => {
            console.error(error)
        })

        // Alternate method I attempted using GQL that was causing infinite loading.
        // client.mutate(
        //     {
        //         mutation: gql`
        //         mutation RefreshSession($accessToken: String!, $refreshToken: String!) {
        //             refreshSession(accessToken: $accessToken, refreshToken: $refreshToken) {
        //               accessToken
        //               refreshToken
        //               expiresAt
        //             }
        //           }
        //           `,
        //         variables: {
        //             accessToken: accessToken,
        //             refreshToken: refreshToken,
        //         }
        //     }
        // ).then((result) => {
        //     newAccessToken = result.data.refreshSession.accessToken
        //     const newRefreshToken = result.data.refreshSession.refreshToken
        //     const newExpiresAt = result.data.refreshSession.expiresAt
            
        //     // Update cookies with the new tokens and expiration time
        //     setAuthCookies({
        //         accessToken: newAccessToken,
        //         refreshToken: newRefreshToken,
        //         expiresAt: newExpiresAt,
        //     })
        //   })
        //   .catch((error) => {
        //     console.error('Mutation Error:', error)
        //   })


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

// Link for handling session refresh and retrying the initial request via forward
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    // Since "SESSION_EXPIRED" is what the error returned is, refresh token in this case
    const sessionExpiredError = graphQLErrors?.find(error => error.extensions.code === "SESSION_EXPIRED")

    if (sessionExpiredError) {
        return new Observable((observer) => {
            refreshToken()
              .then((newAccessToken) => {
                // If refresh was successful, update the headers and retry the operation
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                }))
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                }
                forward(operation).subscribe(subscriber)
              })
              .catch((refreshError) => {
                // If token refresh fails, return the original error
                observer.error(refreshError)
              })
          })
    }
})
  
export const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
})