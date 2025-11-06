import './App.css'
import { ApolloProvider } from "@apollo/client/react";
import { router } from './routes'
import { clientGraphQl } from './api/graph-client';
import { RouterProvider } from 'react-router';
import { AuthInitializer } from './auth/components/AuthInitializer';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <ApolloProvider client={clientGraphQl}>
        <AuthInitializer>
          <RouterProvider router={router} />
          <Toaster />
        </AuthInitializer>
      </ApolloProvider>
    </>

  )
}

export default App
