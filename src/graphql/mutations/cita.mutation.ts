import { gql } from '@apollo/client';

export const CREATE_CITA = gql`
  mutation CreateCita($input: CitaInput!) {
    createCita(input: $input) {
      id
      motivo
      fechaProgramada
      fechaReservacion
      cliente {
        id
        nombre
        apellidos
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
      }
    }
  }
`;

export const UPDATE_CITA = gql`
  mutation UpdateCita($input: CitaUpdateInput!) {
    updateCita(input: $input) {
      id
      motivo
      fechaProgramada
      fechaReservacion
      cliente {
        id
        nombre
        apellidos
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
      }
    }
  }
`;

export const DELETE_CITA = gql`
  mutation DeleteCita($id: ID!) {
    deleteCita(id: $id) {
      id
    }
  }
`;