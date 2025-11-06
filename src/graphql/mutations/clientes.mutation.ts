import { gql } from '@apollo/client';

export const CREATE_CLIENTE = gql`
  mutation createCliente($input: ClienteInput!) {
    createCliente(input: $input) {
      id
      nombre
      apellidos
      email
      telefono
      fechaNacimiento
    }
  }
`;

export const UPDATE_CLIENTE = gql`
  mutation updateCliente($input: ClienteUpdateInput!) {
    updateCliente(input: $input) {
      id
      nombre
      apellidos
      email
      telefono
      fechaNacimiento
    }
  }
`;

export const DELETE_CLIENTE = gql`
  mutation deleteCliente($id: ID!) {
    deleteCliente(id: $id)
  }
`;