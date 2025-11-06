import { gql } from '@apollo/client';

export const GET_HORARIOS = gql`
  query {
    horarios {
      id
      dia
      horaInicio
      horaFin
    }
  }
`;