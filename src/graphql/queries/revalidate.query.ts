import { gql } from '@apollo/client';

export const REVALIDATE_TOKEN = gql`
  query revalidate {
    revalidate {
      token
      user {
        id
        fullname
        email
        roles
        isActive
      }
    }
  }
`;