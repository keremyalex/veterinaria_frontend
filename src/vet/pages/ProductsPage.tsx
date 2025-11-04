import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GET_PRODUCTS, type TypeProductsQuery } from "@/graphql/queries/product.query";
import { useMutation, useQuery } from "@apollo/client/react";
import { Edit, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { ProductAddDialog, type IFormAddProductInput } from "../components/products/ProductAddDialog";
import { GET_EXTRA_FORM_PRODUCT } from "@/graphql/queries/extra-form-product.query";
import { SAVE_PRODUCT, type AddProductInput } from "@/graphql/mutations/product.mutation";

const defaultValueInput: IFormAddProductInput = {
    name: "",
    stock: "0",
    price: "0",
    categoryId: "",
    markId: ""
};

export const ProductsPage = () => {
    const { data, loading } = useQuery(GET_PRODUCTS);
    const { data: dataExtraProduct } = useQuery(GET_EXTRA_FORM_PRODUCT);
    const [addProduct] = useMutation(SAVE_PRODUCT,{refetchQueries:[GET_PRODUCTS]});

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const selectedProductRef = useRef<IFormAddProductInput>(defaultValueInput);

    const handleOpenDialog = () => {
        setIsOpenDialog(!isOpenDialog);
    }

    const handleSelectedProduct = (item: TypeProductsQuery) => {
        selectedProductRef.current = {
            id: item.id,
            name: item.name,
            price: item.price.toFixed(2).toString(),
            stock: item.stock.toString(),
            markId: item.markId.toString(),
            categoryId: item.categoryId.toLocaleString()
        };
    }

    const handeleOpenEditDialog = (item: TypeProductsQuery) => {
        handleSelectedProduct(item);
        handleOpenDialog();
    }

    const handleOpenAddDialog = () => {
        selectedProductRef.current = defaultValueInput;
        handleOpenDialog();
    }

    const handleSaveProduct = (input: IFormAddProductInput) => {
        const product: AddProductInput = {
            categoryId: Number(input.categoryId) || 0,
            markId: Number(input.markId) || 0,
            description: null,
            name: input.name,
            price: Number(input.price)||0,
            stock: Number(input.stock)||0,
            imageUrl:null,
        };
        console.log(product);
        try {
            addProduct({
                variables: {
                    product: product
                }
            });
        }catch(error){
            console.log(error);
        }
    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-3">

                    <div>
                        <h1 className="font-semibold text-3xl">
                            Productos
                        </h1>
                        <p className="text-muted-foreground ">Listado de productos</p>

                    </div>
                    <Button onClick={handleOpenAddDialog}>Agregar producto</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data?.products.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.price.toFixed(2)}</TableCell>
                                    <TableCell>{item.stock}</TableCell>
                                    <TableCell>{item.mark.name}</TableCell>
                                    <TableCell>{item.category.name}</TableCell>

                                    <TableCell>
                                        <div className="text-right space-x-3">

                                            <Button size={"icon"} variant={"outline"} onClick={() => handeleOpenEditDialog(item)}>
                                                <Edit />
                                            </Button>
                                            <Button size={"icon"} variant={"outline"} className="text-red-600">
                                                <Trash />
                                            </Button>
                                        </div>

                                    </TableCell>

                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>

                {isOpenDialog &&
                    <ProductAddDialog
                        isOpen={isOpenDialog}
                        onOpen={() => handleOpenDialog()}
                        onAdd={(value) => handleSaveProduct(value)}
                        value={selectedProductRef.current}
                        categories={dataExtraProduct?.categories ?? []}
                        marks={dataExtraProduct?.marks ?? []}
                    />}


                {/* Blocking overlay while loading to prevent clicks/navigation */}
                {loading && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/50 backdrop-blur-xs"
                    >
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex flex-col items-center gap-2 p-8"
                        >
                            <Spinner />
                            <p className="font-semibold text-sm">
                                Cargando...
                            </p>
                        </div>
                    </div>
                )}
            </div >
        </>
    )
}
