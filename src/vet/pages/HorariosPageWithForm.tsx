import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { GET_HORARIOS } from '@/graphql/queries/horarios.query';
import { CREATE_HORARIO, UPDATE_HORARIO, DELETE_HORARIO } from '@/graphql/mutations/horarios.mutation';
import { toast } from 'sonner';

export default function HorariosPageWithForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<any>(null);
  const [formData, setFormData] = useState({
    dia: '',
    horaInicio: '',
    horaFin: ''
  });

  const { data, loading, refetch } = useQuery(GET_HORARIOS);
  const [createHorario] = useMutation(CREATE_HORARIO);
  const [updateHorario] = useMutation(UPDATE_HORARIO);
  const [deleteHorario] = useMutation(DELETE_HORARIO);

  const horarios = (data as any)?.horarios || [];

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingHorario) {
        await updateHorario({
          variables: {
            input: {
              id: editingHorario.id,
              ...formData
            }
          }
        });
        toast.success('Horario actualizado correctamente');
      } else {
        await createHorario({
          variables: {
            input: formData
          }
        });
        toast.success('Horario creado correctamente');
      }
      
      setIsDialogOpen(false);
      setEditingHorario(null);
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let errorMessage = editingHorario ? 'Error al actualizar el horario' : 'Error al crear el horario';
      if (error?.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error?.networkError) {
        errorMessage = `Error de red: ${error.networkError.message}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEdit = (horario: any) => {
    setEditingHorario(horario);
    setFormData({
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      try {
        await deleteHorario({
          variables: { id }
        });
        toast.success('Horario eliminado correctamente');
        refetch();
      } catch (error: any) {
        console.error('Error:', error);
        let errorMessage = 'Error al eliminar el horario';
        if (error?.graphQLErrors?.length > 0) {
          errorMessage = error.graphQLErrors[0].message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dia: '',
      horaInicio: '',
      horaFin: ''
    });
    setEditingHorario(null);
  };

  if (loading) return <div className="p-6">Cargando horarios...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Horarios</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Horario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingHorario ? 'Editar Horario' : 'Nuevo Horario'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="dia">Día de la Semana</Label>
                <NativeSelect
                  id="dia"
                  value={formData.dia}
                  onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                  required
                >
                  <option value="">Seleccionar día</option>
                  {diasSemana.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div>
                <Label htmlFor="horaInicio">Hora de Inicio</Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="horaFin">Hora de Fin</Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={formData.horaFin}
                  onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingHorario ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Horarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Hora Inicio</TableHead>
                <TableHead>Hora Fin</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.map((horario: any) => (
                <TableRow key={horario.id}>
                  <TableCell className="font-medium">{horario.dia}</TableCell>
                  <TableCell>{horario.horaInicio}</TableCell>
                  <TableCell>{horario.horaFin}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(horario)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(horario.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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