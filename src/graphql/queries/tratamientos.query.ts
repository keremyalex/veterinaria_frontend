import { gql } from '@apollo/client';

export const GET_TRATAMIENTOS = gql`
  query {
    tratamientos {
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
          raza
          cliente {
            nombre
            apellidos
          }
        }
      }
    }
  }
`;