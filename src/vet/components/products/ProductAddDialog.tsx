import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

export interface IFormAddProductInput {
    id?: number;
    name: string;
    price: string;
    stock: string;
    categoryId: string;
    markId: string;
}

interface Props {
    isOpen: boolean;
    onOpen: () => void;
    onAdd: (value: IFormAddProductInput) => void;
    value: IFormAddProductInput;
    marks: { id: number, name: string }[]
    categories: { id: number, name: string }[]
}

export const ProductAddDialog = ({ isOpen, onAdd, onOpen, value, categories, marks }: Props) => {
    const { control, formState: { errors }, handleSubmit ,reset} = useForm<IFormAddProductInput>({ defaultValues: value });

    useEffect(() => {
      reset(value);
    }, [value,reset])
    

    const onSubmit: SubmitHandler<IFormAddProductInput> = (data) => {
        onAdd(data);
        onOpen();
    }

    const handleCloseDialog=()=>{
        onOpen();
    }

    return (
        <Dialog open={isOpen}  onOpenChange={() => handleCloseDialog()}>

            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{value.id ? "Actualizar producto" : "Agreagr producto"}</DialogTitle>
                        <DialogDescription>
                            Formulario de {value.id ? "Actualizacion de producto" : "creacion de producto"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: { value: true, message: "Nombre es requerido." } }}
                            render={({ field }) => (
                                <>
                                    <Label htmlFor={field.name}>Nombre</Label>
                                    <Input {...field} />
                                </>
                            )}
                        />
                        {errors.name && <span className="text-red-600 text-xs">{errors.name.message}</span>}
                    </div>

                    <div className="grid gap-3">
                        <Controller
                            name="price"
                            control={control}
                            rules={{ required: { value: true, message: "Precio es requerido." }}}
                            render={({ field }) => (
                                <>
                                    <Label htmlFor={field.name}>Precio</Label>
                                    <Input type="number" {...field} />
                                </>
                            )}
                        />
                        {errors.price && <span className="text-red-600 text-xs">{errors.price.message}</span>}
                    </div>

                    <div className="grid gap-3">
                        <Controller
                            name="stock"
                            control={control}
                            rules={{required:{value:true,message:"Stock es requerido."} }}
                            render={({ field }) => (
                                <>
                                    <Label htmlFor={field.name}>Stock</Label>
                                    <Input type="number" {...field} />
                                </>
                            )}
                        />
                        {errors.stock && <span className="text-red-600 text-xs">{errors.stock.message}</span>}
                    </div>

                    <div>
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: { value: true, message: "Categoria es requerido." } }}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>Categoria</Label>
                                    <NativeSelect {...field} className="w-sm">
                                        <NativeSelectOption value="">Selecione una categoria</NativeSelectOption>
                                        {
                                            categories.map(item => (
                                                <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>
                                            ))
                                        }
                                    </NativeSelect>
                                </div>
                            )}
                        />
                        {errors.categoryId && <span className="text-red-600 text-xs">{errors.categoryId.message}</span>}
                    </div>


                    <div>
                        <Controller
                            name="markId"
                            control={control}
                            rules={{ required: { value: true, message: "Marca es requerido." } }}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>Marca</Label>
                                    <NativeSelect {...field} className="w-sm">
                                        <NativeSelectOption className="flex w-full flex-1" value="">Selecione una marca</NativeSelectOption>
                                        {
                                            marks.map(item => (
                                                <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>
                                            ))
                                        }
                                    </NativeSelect>
                                </div>
                            )}
                        />
                        {errors.markId && <span className="text-red-600 text-xs">{errors.markId.message}</span>}
                    </div>

                    <DialogFooter>

                        <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancelar</Button>

                        <Button type="submit">{value.id ? "Editar" : "Agregar"}</Button>
                    </DialogFooter>
                </form>

            </DialogContent>


        </Dialog >
    )
}
