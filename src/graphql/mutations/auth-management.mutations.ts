import { gql } from "@apollo/client";

// Mutations para gestión de usuarios
export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      fullname
      email
      roles
      isActive
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($id: Int!) {
    removeUser(id: $id) {
      id
      fullname
      email
      roles
      isActive
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SignupUser($signupInput: SignupInput!) {
    signup(signupInput: $signupInput) {
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