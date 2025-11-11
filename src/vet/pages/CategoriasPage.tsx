import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GET_CATEGORIES } from '../../graphql/queries/ventas.query';
import { ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../../graphql/mutations/ventas.mutation';
import { getProductsByCategory } from '../data/mock-ventas';
import { CategoryFormDialog } from '../components/categories/CategoryFormDialog';
import type { Category } from '../interfaces/ventas.interface';

export const CategoriasPage: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // GraphQL queries con manejo de errores
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories, error: categoriesError } = useQuery(GET_CATEGORIES, {
    errorPolicy: 'all'
  });

  const [addCategoryMutation] = useMutation(ADD_CATEGORY, {
    onCompleted: () => {
      setShowAddDialog(false);
      refetchCategories();
    },
    onError: (error: any) => {
      console.error('Error al agregar categoría:', error);
      alert('Error al agregar categoría: ' + error.message);
    }
  });

  const [updateCategoryMutation] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      setShowAddDialog(false);
      refetchCategories();
    },
    onError: (error: any) => {
      console.error('Error al actualizar categoría:', error);
      alert('Error al actualizar categoría: ' + error.message);
    }
  });

  const [deleteCategoryMutation] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      refetchCategories();
    },
    onError: (error: any) => {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar categoría: ' + error.message);
    }
  });

  // Extraer datos de las respuestas GraphQL
  const categories: Category[] = (categoriesData as any)?.categories || [];

  // Mostrar errores si existen
  React.useEffect(() => {
    if (categoriesError) console.error('Error loading categories:', categoriesError);
  }, [categoriesError]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowAddDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowAddDialog(true);
  };

  const handleSaveCategory = async (categoryData: { name: string; description: string }) => {
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        await updateCategoryMutation({
          variables: {
            input: {
              id: editingCategory.id,
              name: categoryData.name,
              description: categoryData.description
            }
          }
        });
      } else {
        // Agregar nueva categoría
        await addCategoryMutation({
          variables: {
            input: {
              name: categoryData.name,
              description: categoryData.description
            }
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteCategoryMutation({
          variables: {
            input: {
              id: categoryId
            }
          }
        });
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
              <p className="text-gray-600">Cargando categorías...</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
              <p className="text-red-600">Error al cargar las categorías</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
              <p className="text-gray-600">
                Organiza tus productos por categorías
              </p>
            </div>
          </div>
          
          <Button onClick={handleAddCategory} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Tag className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Categorías</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Tag className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Categorías Activas</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Tag className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Promedio Productos</p>
                <p className="text-2xl font-bold">
                  {Math.round(getProductsByCategory('cat-001').length + getProductsByCategory('cat-002').length + getProductsByCategory('cat-003').length) / categories.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Categorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Categorías ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const productCount = getProductsByCategory(category.id).length;
              
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Tag className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {productCount} productos
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {category.description || 'Sin descripción'}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>ID: {category.id}</span>
                      <span>Activa</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No hay categorías</p>
              <p className="text-sm">Crea tu primera categoría para organizar los productos</p>
            </div>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};