import { gql, type TypedDocumentNode } from "@apollo/client";

interface Category {
    id: number;
    name: string;
    description: string | null;
}
interface TypeCategoriesQuery extends Category {
    __typename: "Categories";
}

interface Mark {
    id: number;
    name: string;
    description: string | null;
}
interface TypeMarksQuery extends Mark {
    __typename: "Marks";
}

type GetExtraFormProductQuery = {
    categories: TypeCategoriesQuery[];
    marks: TypeMarksQuery[];

}

export const GET_EXTRA_FORM_PRODUCT:TypedDocumentNode<GetExtraFormProductQuery> = gql`
query GetAuxiliarProduct{
    categories{
      id
      name,
      description
    },
    marks{
      id
      name,
      description
    }
   }

`


