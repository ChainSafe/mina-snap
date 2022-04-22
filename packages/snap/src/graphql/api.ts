import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { Balance, GET_BALANCE } from "./query";

export class GraphqlAPI {
  client: ApolloClient<NormalizedCacheObject>;

  constructor(uri: string) {
    const httpLink = ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        credentials: "same-origin",
        fetchOptions: {
          reconnect: true,
        },
        uri: uri,
      }),
    ]);

    this.client = new ApolloClient<NormalizedCacheObject>({
      cache: new InMemoryCache(),
      link: httpLink as any,
    });
  }

  async getBalance(publicKey: string): Promise<Balance> {
    const response = await this.client.query({
      query: GET_BALANCE,
      variables: {
        publicKey: publicKey,
      },
    });
    return response.data as Balance;
  }
}
