import { gql } from '@apollo/client';
import { PRODUCT_FRAGMENT, CATEGORY_FRAGMENT, MARK_FRAGMENT } from '../queries/ventas.query';

// Mutations para Products
export const ADD_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      product {
        ...ProductFragment
      }
    }
  }
`;

// Mutations para Categories
export const ADD_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  mutation AddCategory($input: AddCategoryInput!) {
    addCategory(input: $input) {
      category {
        ...CategoryFragment
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      category {
        ...CategoryFragment
      }
      errors {
        message
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  mutation DeleteCategory($input: DeleteCategoryInput!) {
    deleteCategory(input: $input) {
      category {
        ...CategoryFragment
      }
      errors {
        message
      }
    }
  }
`;

// Mutations para Marks
export const ADD_MARK = gql`
  ${MARK_FRAGMENT}
  mutation AddMark($input: AddMarkInput!) {
    addMark(input: $input) {
      mark {
        ...MarkFragment
      }
    }
  }
`;

export const UPDATE_MARK = gql`
  ${MARK_FRAGMENT}
  mutation UpdateMark($input: UpdateMarkInput!) {
    updateMark(input: $input) {
      mark {
        ...MarkFragment
      }
      errors {
        message
      }
    }
  }
`;

export const DELETE_MARK = gql`
  ${MARK_FRAGMENT}
  mutation DeleteMark($input: DeleteMarkInput!) {
    deleteMark(input: $input) {
      mark {
        ...MarkFragment
      }
      errors {
        message
      }
    }
  }
`;