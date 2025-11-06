import { gql } from '@apollo/client';

export const CREATE_ESPECIE = gql`
  mutation createEspecie($input: EspecieInput!) {
    createEspecie(input: $input) {
      id
      descripcion
    }
  }
`;

export const UPDATE_ESPECIE = gql`
  mutation updateEspecie($input: EspecieUpdateInput!) {
    updateEspecie(input: $input) {
      id
      descripcion
    }
  }
`;

export const DELETE_ESPECIE = gql`
  mutation deleteEspecie($id: ID!) {
    deleteEspecie(id: $id)
  }
`;