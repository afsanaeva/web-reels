import { ApolloLink, HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { getServerCookies } from "./server-auth";
import { authKey } from "@/constants/auth.constants";
import { REFRESH_TOKEN } from "@/graphql/mutations/loginMutation";
import { onError } from "@apollo/client/link/error";


export const { getClient, query, PreloadQuery } = registerApolloClient(
  async () => {
    const token = await getServerCookies(authKey);
    const refreshToken = await getServerCookies("refreshToken");

    // Setup the HttpLink with authorization header
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      fetchOptions: { cache: "no-store" },
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    });

    // Middleware to add the authorization token to the headers
    const authLink = new ApolloLink(async (operation, forward) => {
      const token = await getServerCookies(authKey);

      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      });
      return forward(operation);
    });

    // Error handling logic to refresh the token if needed
    const refreshLink = onError(({ graphQLErrors, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          if (err.extensions.code === "UNAUTHENTICATED") {
            if (refreshToken) {
              return new Observable((observer) => {
                const client = initializeApollo({ token, refreshToken }); // Re-initialize Apollo Client

                client
                  .mutate({
                    mutation: REFRESH_TOKEN,
                    variables: { refreshToken },
                  })
                  .then(({ data }) => {
                    if (data?.refreshAccessToken?.accessToken) {
                      console.log("refreshed token");

                      // Store new access token in cookies
                      storeCookies(
                        authKey,
                        data.refreshAccessToken.accessToken
                      );

                      // Retry the failed operation with the new token
                      operation.setContext({
                        headers: {
                          authorization: `Bearer ${data.refreshAccessToken.accessToken}`,
                        },
                      });

                      // Retry the original operation
                      forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                      });
                    } else {
                      // If the refresh token is invalid, log the user out
                      userLogout();
                      window.location.href = "/login";
                    }
                  })
                  .catch((error) => {
                    userLogout();
                    observer.error(error);
                  });
              });
            }
          }
        }
      }
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([authLink, refreshLink, httpLink]),
    });
  }
);
