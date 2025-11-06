import { gql } from '@apollo/client';

export const GET_ESPECIES = gql`
  query {
    especies {
      id
      descripcion
    }
  }
`;