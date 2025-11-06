import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_GRAPHQL_URL || 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Retornar los headers con el token si existe
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

export const clientGraphQl = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});