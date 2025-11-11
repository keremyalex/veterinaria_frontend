import React, { useState } from 'react';
import { Award, Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GET_MARKS } from '../../graphql/queries/ventas.query';
import { ADD_MARK, UPDATE_MARK, DELETE_MARK } from '../../graphql/mutations/ventas.mutation';
import { getProductsByMark } from '../data/mock-ventas';
import { MarkFormDialog } from '../components/marks/MarkFormDialog';
import type { Mark } from '../interfaces/ventas.interface';

export const MarcasPage: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);

  // GraphQL queries con manejo de errores
  const { data: marksData, loading: marksLoading, error: marksError } = useQuery(GET_MARKS, {
    errorPolicy: 'all'
  });

  const [addMarkMutation] = useMutation(ADD_MARK, {
    refetchQueries: [{ query: GET_MARKS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setShowAddDialog(false);
      setEditingMark(null);
    },
    onError: (error) => {
      console.error('Error adding mark:', error);
      alert('Error al agregar marca: ' + error.message);
    }
  });

  const [updateMarkMutation] = useMutation(UPDATE_MARK, {
    refetchQueries: [{ query: GET_MARKS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setShowAddDialog(false);
      setEditingMark(null);
    },
    onError: (error) => {
      console.error('Error updating mark:', error);
      alert('Error al actualizar marca: ' + error.message);
    }
  });

  const [deleteMarkMutation] = useMutation(DELETE_MARK, {
    refetchQueries: [{ query: GET_MARKS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Error deleting mark:', error);
      alert('Error al eliminar marca: ' + error.message);
    }
  });

  // Extraer datos de las respuestas GraphQL
  const marks: Mark[] = (marksData as any)?.marks || [];

  // Mostrar errores si existen
  React.useEffect(() => {
    if (marksError) console.error('Error loading marks:', marksError);
  }, [marksError]);

  const handleAddMark = () => {
    setEditingMark(null);
    setShowAddDialog(true);
  };

  const handleEditMark = (mark: Mark) => {
    setEditingMark(mark);
    setShowAddDialog(true);
  };

  const handleSaveMark = async (markData: { name: string; description: string }) => {
    try {
      if (editingMark) {
        // Actualizar marca existente
        await updateMarkMutation({
          variables: {
            input: {
              id: editingMark.id,
              name: markData.name,
              description: markData.description
            }
          }
        });
      } else {
        // Agregar nueva marca
        await addMarkMutation({
          variables: {
            input: {
              name: markData.name,
              description: markData.description
            }
          }
        });
      }
    } catch (error) {
      console.error('Error al guardar marca:', error);
    }
  };

  const handleDeleteMark = async (markId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta marca?')) {
      try {
        await deleteMarkMutation({
          variables: {
            input: {
              id: markId
            }
          }
        });
      } catch (error) {
        console.error('Error al eliminar marca:', error);
      }
    }
  };

  if (marksLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Marcas</h1>
              <p className="text-gray-600">Cargando marcas...</p>
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

  if (marksError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Marcas</h1>
              <p className="text-red-600">Error al cargar las marcas</p>
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
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Marcas</h1>
              <p className="text-gray-600">
                Administra las marcas y proveedores de productos
              </p>
            </div>
          </div>
          
          <Button onClick={handleAddMark} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Marca
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Total Marcas</p>
                <p className="text-2xl font-bold">{marks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Marcas Activas</p>
                <p className="text-2xl font-bold">{marks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Promedio Productos</p>
                <p className="text-2xl font-bold">
                  {Math.round((getProductsByMark('mark-001').length + getProductsByMark('mark-002').length + getProductsByMark('mark-003').length) / 3) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Marcas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Marcas ({marks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marks.map((mark) => {
              const productCount = getProductsByMark(mark.id).length;
              
              return (
                <Card key={mark.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{mark.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {productCount} productos
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMark(mark)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMark(mark.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {mark.description || 'Sin descripción'}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>ID: {mark.id}</span>
                      <span>Activa</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {marks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No hay marcas</p>
              <p className="text-sm">Agrega marcas para organizar mejor tus productos</p>
            </div>
          )}
        </CardContent>
      </Card>

      <MarkFormDialog
        open={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setEditingMark(null);
        }}
        onSave={handleSaveMark}
        mark={editingMark}
      />
    </div>
  );
};