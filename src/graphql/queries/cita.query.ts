import { gql } from '@apollo/client';

export const GET_CITAS = gql`
  query GetCitas {
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
        sexo
        raza
        peso
      }
    }
  }
`;

export const GET_CITA_BY_ID = gql`
  query GetCitaById($id: ID!) {
    cita(id: $id) {
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
        sexo
        raza
        peso
      }
    }
  }
`;