import { gql } from '@apollo/client';

export const GET_CITAS = gql`
  query {
    citas {
      id
      motivo
      fechaProgramada
      fechaReservacion
      cliente {
        id
        nombre
        apellidos
        email
        telefono
      }
      horario {
        id
        dia
        horaInicio
        horaFin
      }
      mascota {
        id
        nombre
        raza
        especie {
          descripcion
        }
      }
    }
  }
`;