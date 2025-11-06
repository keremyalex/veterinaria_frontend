import { gql } from '@apollo/client';

export const CREATE_TRATAMIENTO = gql`
  mutation createTratamiento($input: TratamientoInput!) {
    createTratamiento(input: $input) {
      id
      descripcion
      fechaInicio
      fechaFin
      instrucciones
      estado
      diagnostico {
        id
        descripcion
        mascota {
          nombre
        }
      }
    }
  }
`;

export const UPDATE_TRATAMIENTO = gql`
  mutation updateTratamiento($input: TratamientoUpdateInput!) {
    updateTratamiento(input: $input) {
      id
      descripcion
      fechaInicio
      fechaFin
      instrucciones
      estado
      diagnostico {
        id
        descripcion
        mascota {
          nombre
        }
      }
    }
  }
`;

export const DELETE_TRATAMIENTO = gql`
  mutation deleteTratamiento($id: ID!) {
    deleteTratamiento(id: $id)
  }
`;