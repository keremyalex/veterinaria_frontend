import { gql } from '@apollo/client';

export const CREATE_CLIENTE = gql`
  mutation createCliente($input: CreateClienteInput!) {
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
  mutation updateCliente($input: UpdateClienteInput!) {
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