import { gql, type TypedDocumentNode } from "@apollo/client";

type User={
    id:string;
    fullname:string;
    email:string;
    roles:string[];
    isActive:boolean;
}

type UserLoginMutation={
    login:{
        user:User;
        token:string;
    }
}

type LoginMutationVariables={
    login:{
        email:string;
        password:string;
    }
}

export const LOGIN:TypedDocumentNode<UserLoginMutation,LoginMutationVariables> = gql`
mutation login($login:LoginInput!){
  login(loginInput:$login){
    user{
      id
      fullname
      email
      roles
      isActive
    }
    token
  }
}
`