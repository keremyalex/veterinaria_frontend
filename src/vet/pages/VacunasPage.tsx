import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, Pill, Shield } from 'lucide-react';
import { GET_VACUNAS } from '@/graphql/queries/clinic.queries';
import { CREAR_VACUNA, ACTUALIZAR_VACUNA, ELIMINAR_VACUNA } from '@/graphql/mutations/clinic.mutations';
import type { Vacuna, VacunaInput, VacunaUpdateInput } from '@/vet/interfaces/clinic.interface';

interface FormData {
  descripcion: string;
}

const initialFormData: FormData = {
  descripcion: ''
};

export default function VacunasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingVacuna, setEditingVacuna] = useState<Vacuna | null>(null);

  // Queries
  const { data: vacunasData, loading, error, refetch } = useQuery(GET_VACUNAS);

  // Mutations
  const [crearVacuna] = useMutation(CREAR_VACUNA);
  const [actualizarVacuna] = useMutation(ACTUALIZAR_VACUNA);
  const [eliminarVacuna] = useMutation(ELIMINAR_VACUNA);

  // Datos ordenados por ID ascendente (más antiguos primero: 1, 2, 3...)
  const vacunas: Vacuna[] = [...((vacunasData as any)?.vacunas || [])]
    .sort((a: Vacuna, b: Vacuna) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingVacuna(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVacuna) {
        const updateInput: VacunaUpdateInput = {
          id: editingVacuna.id,
          descripcion: formData.descripcion
        };

        await actualizarVacuna({
          variables: { input: updateInput }
        });
      } else {
        const vacunaInput: VacunaInput = {
          descripcion: formData.descripcion
        };

        await crearVacuna({
          variables: { input: vacunaInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar vacuna:', error);
    }
  };

  const handleEdit = (vacuna: Vacuna) => {
    setEditingVacuna(vacuna);
    setFormData({
      descripcion: vacuna.descripcion || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta vacuna?')) {
      try {
        await eliminarVacuna({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar vacuna:', error);
      }
    }
  };

  if (loading) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center">Cargando vacunas...</div>
      </CardContent>
    </Card>
  </div>;
  
  if (error) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center text-red-500">
          <p>Error al cargar vacunas:</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </CardContent>
    </Card>
  </div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Gestión de Vacunas
          </CardTitle>
          <CardDescription>
            Administra el catálogo de vacunas disponibles para los tratamientos veterinarios
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Vacuna
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingVacuna ? 'Editar Vacuna' : 'Crear Nueva Vacuna'}
                </DialogTitle>
                <DialogDescription>
                  {editingVacuna ? 'Modifica' : 'Registra'} la información de la vacuna aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Nombre de la Vacuna</Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Ej: Vacuna Triple Felina, Antirrábica, Parvovirus..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa el nombre completo o descripción de la vacuna
                  </p>
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
                    {editingVacuna ? 'Actualizar' : 'Registrar'} Vacuna
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
                <TableHead>Vacuna</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacunas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No hay vacunas registradas. Haz clic en "Agregar Vacuna" para crear la primera.
                  </TableCell>
                </TableRow>
              ) : (
                vacunas.map((vacuna) => (
                  <TableRow key={vacuna.id}>
                    <TableCell className="font-medium">{vacuna.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{vacuna.descripcion}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(vacuna)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(vacuna.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}