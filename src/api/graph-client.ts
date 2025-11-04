import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const clientGraphQl = new ApolloClient({
    link:new HttpLink({uri:"http://localhost:5095/graphql/"}),
    cache: new InMemoryCache(),
});