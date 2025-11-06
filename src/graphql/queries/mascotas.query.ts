import { gql } from '@apollo/client';

export const GET_MASCOTAS = gql`
  query {
    mascotas {
      id
      nombre
      sexo
      raza
      fechaNacimiento
      peso
      cliente {
        id
        nombre
        apellidos
        email
      }
      especie {
        id
        descripcion
      }
    }
  }
`;