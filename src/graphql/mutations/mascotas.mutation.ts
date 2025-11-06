import { gql } from '@apollo/client';

export const CREATE_MASCOTA = gql`
  mutation createMascota($input: MascotaInput!) {
    createMascota(input: $input) {
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
      }
      especie {
        id
        descripcion
      }
    }
  }
`;

export const UPDATE_MASCOTA = gql`
  mutation updateMascota($input: MascotaUpdateInput!) {
    updateMascota(input: $input) {
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
      }
      especie {
        id
        descripcion
      }
    }
  }
`;

export const DELETE_MASCOTA = gql`
  mutation deleteMascota($id: ID!) {
    deleteMascota(id: $id)
  }
`;