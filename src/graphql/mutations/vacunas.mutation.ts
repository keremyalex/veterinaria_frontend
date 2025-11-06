import { gql } from '@apollo/client';

export const CREATE_VACUNA = gql`
  mutation createVacuna($input: CreateVacunaInput!) {
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
  mutation updateVacuna($input: UpdateVacunaInput!) {
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
  mutation aplicarVacuna($input: AplicarVacunaInput!) {
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