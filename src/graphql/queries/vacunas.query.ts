import { gql } from '@apollo/client';

export const GET_VACUNAS = gql`
  query {
    vacunas {
      id
      nombre
      descripcion
      duracionMeses
      laboratorio
      edadMinimaDias
    }
  }
`;

export const GET_APLICACIONES_VACUNA = gql`
  query {
    mascotaVacunas {
      id
      fechaAplicacion
      fechaProximaDosis
      veterinario
      observaciones
      lote
      mascota {
        id
        nombre
        raza
        cliente {
          nombre
          apellidos
          telefono
        }
      }
      vacuna {
        id
        nombre
        descripcion
        laboratorio
      }
    }
  }
`;