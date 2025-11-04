import { gql, type TypedDocumentNode } from "@apollo/client";

interface Product{
    id: number;
    price: number;
    stock: number;
    name: string;
    categoryId:number;
    markId:number;
    mark:{
        id:number;
        name:string;
    };
    category:{
        id:number;
        name:string;
    };
}

export interface TypeProductsQuery extends Product{
    __typename: "Products",
}

type GetProductsQuery = {
    products: TypeProductsQuery[]
}


type GetProductQueryVariables = Record<number, never>;

export const GET_PRODUCTS: TypedDocumentNode<GetProductsQuery> = gql`
query GetProducts{
    products{
        id
        price
        stock
        name
        categoryId
        markId
        mark{
            id
            name
        }
        category{
            id
            name
        }
  }
}
`;
