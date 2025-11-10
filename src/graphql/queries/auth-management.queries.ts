import { gql } from "@apollo/client";

// Queries para gestión de usuarios
export const GET_USERS = gql`
  query GetUsers($roles: [ValidRoles!]) {
    users(roles: $roles) {
      id
      fullname
      email
      roles
      isActive
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      fullname
      email
      roles
      isActive
    }
  }
`;

export const REVALIDATE_TOKEN = gql`
  query Revalidate {
    revalidate {
      token
      user {
        id
        fullname
        email
        roles
        isActive
      }
    }
  }
`;