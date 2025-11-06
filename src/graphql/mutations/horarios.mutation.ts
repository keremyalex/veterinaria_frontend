import { gql } from '@apollo/client';

export const CREATE_HORARIO = gql`
  mutation createHorario($input: CreateHorarioInput!) {
    createHorario(input: $input) {
      id
      dia
      horaInicio
      horaFin
    }
  }
`;

export const UPDATE_HORARIO = gql`
  mutation updateHorario($input: UpdateHorarioInput!) {
    updateHorario(input: $input) {
      id
      dia
      horaInicio
      horaFin
    }
  }
`;

export const DELETE_HORARIO = gql`
  mutation deleteHorario($id: ID!) {
    deleteHorario(id: $id)
  }
`;