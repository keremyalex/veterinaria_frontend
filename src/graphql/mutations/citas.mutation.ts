import { gql } from '@apollo/client';

export const CREATE_CITA = gql`
  mutation createCita($input: CreateCitaInput!) {
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
        raza
      }
    }
  }
`;

export const UPDATE_CITA = gql`
  mutation updateCita($input: UpdateCitaInput!) {
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
        raza
      }
    }
  }
`;

export const DELETE_CITA = gql`
  mutation deleteCita($id: ID!) {
    deleteCita(id: $id)
  }
`;