import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { GET_ESPECIES } from '@/graphql/queries/clinic.queries';
import { CREAR_ESPECIE, ACTUALIZAR_ESPECIE, ELIMINAR_ESPECIE } from '@/graphql/mutations/clinic.mutations';
import type { Especie, EspecieInput, EspecieUpdateInput } from '@/vet/interfaces/clinic.interface';

interface FormData {
  descripcion: string;
}

const initialFormData: FormData = {
  descripcion: ''
};

export default function EspeciesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingEspecie, setEditingEspecie] = useState<Especie | null>(null);

  const { data: especiesData, loading, error, refetch } = useQuery(GET_ESPECIES);
  const [crearEspecie] = useMutation(CREAR_ESPECIE);
  const [actualizarEspecie] = useMutation(ACTUALIZAR_ESPECIE);
  const [eliminarEspecie] = useMutation(ELIMINAR_ESPECIE);

  // Datos ordenados por ID ascendente (más antiguos primero: 1, 2, 3...)
  const especies: Especie[] = [...((especiesData as any)?.especies || [])]
    .sort((a: Especie, b: Especie) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingEspecie(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEspecie) {
        const updateInput: EspecieUpdateInput = {
          id: parseInt(editingEspecie.id),
          descripcion: formData.descripcion
        };

        await actualizarEspecie({
          variables: { input: updateInput }
        });
      } else {
        const especieInput: EspecieInput = {
          descripcion: formData.descripcion
        };

        await crearEspecie({
          variables: { input: especieInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar especie:', error);
    }
  };

  const handleEdit = (especie: Especie) => {
    setEditingEspecie(especie);
    setFormData({
      descripcion: especie.descripcion
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta especie?')) {
      try {
        await eliminarEspecie({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar especie:', error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Especies</CardTitle>
          <CardDescription>
            Administra las especies de animales atendidas en la clínica veterinaria
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Especie
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingEspecie ? 'Editar Especie' : 'Agregar Nueva Especie'}
                </DialogTitle>
                <DialogDescription>
                  {editingEspecie ? 'Modifica' : 'Completa'} la información de la especie aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción de la Especie</Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Ej: Perro, Gato, Conejo, etc."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEspecie ? 'Actualizar' : 'Crear'} Especie
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {especies.map((especie) => (
                <TableRow key={especie.id}>
                  <TableCell className="font-medium">{especie.id}</TableCell>
                  <TableCell>{especie.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(especie)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(especie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}