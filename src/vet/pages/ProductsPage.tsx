import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ProductList } from '../components/ventas/ProductList';
import { ProductFormDialog } from '../components/ventas/ProductFormDialog';
import { GET_PRODUCTS, GET_CATEGORIES, GET_MARKS } from '../../graphql/queries/ventas.query';
import { ADD_PRODUCT } from '../../graphql/mutations/ventas.mutation';
import type { Product, ProductFormData, Category, Mark } from '../interfaces/ventas.interface';

export const ProductsPage: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // GraphQL queries con manejo de errores
  const { data: productsData, loading: productsLoading, refetch: refetchProducts, error: productsError } = useQuery(GET_PRODUCTS, {
    errorPolicy: 'all'
  });

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES, {
    errorPolicy: 'all'
  });

  const { data: marksData, loading: marksLoading, error: marksError } = useQuery(GET_MARKS, {
    errorPolicy: 'all'
  });

  const [addProductMutation, { loading: addLoading }] = useMutation(ADD_PRODUCT, {
    onCompleted: () => {
      setShowAddDialog(false);
      refetchProducts();
    },
    onError: (error: any) => {
      console.error('Error al agregar producto:', error);
      alert('Error al agregar producto: ' + error.message);
    }
  });

  // Extraer datos de las respuestas GraphQL con fallbacks
  const products: Product[] = (productsData as any)?.products || [];
  const categories: Category[] = (categoriesData as any)?.categories || [];
  const marks: Mark[] = (marksData as any)?.marks || [];

  // Mostrar errores si existen
  React.useEffect(() => {
    if (productsError) console.error('Error loading products:', productsError);
    if (categoriesError) console.error('Error loading categories:', categoriesError);
    if (marksError) console.error('Error loading marks:', marksError);
  }, [productsError, categoriesError, marksError]);

  const isLoading = productsLoading || categoriesLoading || marksLoading;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddDialog(true);
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        // TODO: Implementar update mutation cuando esté disponible
        console.log('Update no implementado aún:', productData);
        setShowAddDialog(false);
      } else {
        // Agregar nuevo producto
        await addProductMutation({
          variables: {
            input: {
              name: productData.name,
              description: productData.description,
              imageUrl: productData.imageUrl,
              stock: productData.stock,
              price: productData.price,
              categoryId: productData.categoryId,
              markId: productData.markId
            }
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      // TODO: Implementar delete mutation cuando esté disponible
      console.log('Delete no implementado aún:', productId);
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
        </div>
        <p className="text-gray-600">
          Administra tu inventario de productos, categorías y marcas
        </p>
      </div>

      {/* Content */}
      <ProductList
        products={products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={isLoading}
      />

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={showAddDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        marks={marks}
        loading={addLoading}
      />
    </div>
  );
};