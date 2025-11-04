import './App.css'
import { ApolloProvider } from "@apollo/client/react";
import { router } from './routes'
import { clientGraphQl } from './api/graph-client';
import { RouterProvider } from 'react-router';



function App() {
  return (
    <>
      <ApolloProvider client={clientGraphQl}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </>

  )
}

export default App
