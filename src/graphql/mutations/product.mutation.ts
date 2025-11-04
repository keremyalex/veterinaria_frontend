import { gql, type TypedDocumentNode } from "@apollo/client";

type AddProductMutation = {
    createProduct: {
        id: number;
        name: string;
    } | null
}

export interface AddProductInput{
    name: string;
    stock: number;
    price: number;
    description: string | null;
    categoryId: number;
    markId: number;
    imageUrl:string|null;
}

type AddProductInputVariables = {
    product: AddProductInput
}

export const SAVE_PRODUCT: TypedDocumentNode<AddProductMutation, AddProductInputVariables> = gql`
    mutation AddProduct($product:AddProductInput!){
        addProduct(input:$product){
            product{
                id
                name
                description

            } 
        }
    }
`;