"use client";
import { REFRESH_TOKEN } from "@/graphql/mutations/loginMutation";
import { getCookies, storeCookies, userLogout } from "@/utils/cookies";
import { ApolloLink, HttpLink, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { SuspenseCache } from "@apollo/client/react/internal/cache/SuspenseCache";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";

// Create a RetryLink
const link = new RetryLink({
  attempts: {
    max: Infinity, // Maximum number of retry attempts
    retryIf: (error, _operation) => !!error, // Retry on any error
  },
  delay: {
    initial: 300, // Initial delay in milliseconds
    max: Infinity, // Maximum delay
    jitter: true, // Add random jitter to delays
  },
});

function makeClient() {
  const token = getCookies();

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    fetchOptions: { cache: "no-store" },
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  });

  const authLink = new ApolloLink((operation, forward) => {
    const token = getCookies();

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
    return forward(operation);
  });

  const refreshLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.extensions?.code === "UNAUTHENTICATED") {
          const refreshToken = getCookies("refreshToken");
          if (refreshToken) {
            return new Observable((observer) => {
              makeClient()
                .mutate({
                  mutation: REFRESH_TOKEN,
                  variables: { refreshToken },
                })
                .then(({ data }: any) => {
                  if (data?.refreshAccessToken?.accessToken) {
                    storeCookies(
                      "authKey",
                      data.refreshAccessToken.accessToken
                    );
                    operation.setContext({
                      headers: {
                        authorization: `Bearer ${data.refreshAccessToken.accessToken}`,
                      },
                    });
                    forward(operation).subscribe({
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    });
                  } else {
                    userLogout();
                    window.location.href = "/login";
                  }
                })
                .catch((error: any) => {
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
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          authLink.concat(httpLink),
        ])
        : ApolloLink.from([link, authLink, refreshLink, httpLink]),
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}
    >
      {children}
    </ApolloNextAppProvider>
  );
}
