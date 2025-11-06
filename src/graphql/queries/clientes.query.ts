import { gql } from '@apollo/client';

export const GET_CLIENTES = gql`
  query {
    clientes {
      id
      nombre
      apellidos
      email
      telefono
      fechaNacimiento
    }
  }
`;