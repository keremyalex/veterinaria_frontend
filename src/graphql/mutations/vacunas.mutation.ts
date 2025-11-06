import { gql } from '@apollo/client';

export const CREATE_VACUNA = gql`
  mutation createVacuna($input: VacunaInput!) {
    createVacuna(input: $input) {
      id
      nombre
      descripcion
      duracionMeses
      laboratorio
      edadMinimaDias
    }
  }
`;

export const UPDATE_VACUNA = gql`
  mutation updateVacuna($input: VacunaUpdateInput!) {
    updateVacuna(input: $input) {
      id
      nombre
      descripcion
      duracionMeses
      laboratorio
      edadMinimaDias
    }
  }
`;

export const DELETE_VACUNA = gql`
  mutation deleteVacuna($id: ID!) {
    deleteVacuna(id: $id)
  }
`;

export const APLICAR_VACUNA = gql`
  mutation aplicarVacuna($input: MascotaVacunaInput!) {
    aplicarVacuna(input: $input) {
      id
      fechaAplicacion
      fechaProximaDosis
      veterinario
      observaciones
      lote
      mascota {
        id
        nombre
      }
      vacuna {
        id
        nombre
      }
    }
  }
`;

export const UPDATE_MASCOTA_VACUNA = gql`
  mutation updateMascotaVacuna($input: MascotaVacunaUpdateInput!) {
    updateMascotaVacuna(input: $input) {
      id
      fechaAplicacion
      fechaProximaDosis
      veterinario
      observaciones
      lote
      mascota {
        id
        nombre
      }
      vacuna {
        id
        nombre
      }
    }
  }
`;

export const DELETE_MASCOTA_VACUNA = gql`
  mutation deleteMascotaVacuna($id: ID!) {
    deleteMascotaVacuna(id: $id)
  }
`;