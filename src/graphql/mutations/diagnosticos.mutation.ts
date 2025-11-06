import { gql } from '@apollo/client';

export const CREATE_DIAGNOSTICO = gql`
  mutation createDiagnostico($input: CreateDiagnosticoInput!) {
    createDiagnostico(input: $input) {
      id
      descripcion
      fechaDiagnostico
      observaciones
      mascota {
        id
        nombre
        raza
        cliente {
          nombre
          apellidos
        }
      }
    }
  }
`;

export const UPDATE_DIAGNOSTICO = gql`
  mutation updateDiagnostico($input: UpdateDiagnosticoInput!) {
    updateDiagnostico(input: $input) {
      id
      descripcion
      fechaDiagnostico
      observaciones
      mascota {
        id
        nombre
        raza
        cliente {
          nombre
          apellidos
        }
      }
    }
  }
`;

export const DELETE_DIAGNOSTICO = gql`
  mutation deleteDiagnostico($id: ID!) {
    deleteDiagnostico(id: $id)
  }
`;