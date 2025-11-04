import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const clientGraphQl = new ApolloClient({
    link:new HttpLink({uri:import.meta.env.VITE_API_GRAPHQL_URL}),
    cache: new InMemoryCache(),
});