import { gql } from '@apollo/client';

export const GET_DIAGNOSTICOS = gql`
  query {
    diagnosticos {
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
        especie {
          descripcion
        }
      }
    }
  }
`;