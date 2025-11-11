import { gql } from '@apollo/client';

// Fragment para Product
export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    name
    description
    imageUrl
    stock
    price
    categoryId
    markId
    category {
      id
      name
      description
    }
    mark {
      id
      name
      description
    }
  }
`;

// Fragment para Category
export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFragment on Category {
    id
    name
    description
  }
`;

// Fragment para Mark
export const MARK_FRAGMENT = gql`
  fragment MarkFragment on Mark {
    id
    name
    description
  }
`;

// Queries simples
export const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts {
    products {
      ...ProductFragment
    }
  }
`;

export const GET_CATEGORIES = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategories {
    categories {
      ...CategoryFragment
    }
  }
`;

export const GET_MARKS = gql`
  ${MARK_FRAGMENT}
  query GetMarks {
    marks {
      ...MarkFragment
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  ${PRODUCT_FRAGMENT}
  query GetProductById($id: String!) {
    productById(id: $id) {
      ...ProductFragment
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  ${CATEGORY_FRAGMENT}
  query GetCategoryById($id: String!) {
    categoryById(id: $id) {
      ...CategoryFragment
      productByCategoryId {
        id
        name
        stock
        price
      }
    }
  }
`;

export const GET_MARK_BY_ID = gql`
  ${MARK_FRAGMENT}
  query GetMarkById($id: String!) {
    mark(id: $id) {
      ...MarkFragment
    }
  }
`;