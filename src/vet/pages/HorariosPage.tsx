import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import { Trash2, Edit, Plus, Clock } from 'lucide-react';
import { GET_BLOQUES_HORARIOS } from '@/graphql/queries/clinic.queries';
import { CREAR_BLOQUE_HORARIO, ACTUALIZAR_BLOQUE_HORARIO, ELIMINAR_BLOQUE_HORARIO } from '@/graphql/mutations/clinic.mutations';
import type { BloqueHorario, BloqueHorarioInput, BloqueHorarioUpdateInput } from '@/vet/interfaces/clinic.interface';

interface FormData {
  diasemana: string;
  horainicio: string;
  horafinal: string;
  activo: string;
}

const initialFormData: FormData = {
  diasemana: '',
  horainicio: '',
  horafinal: '',
  activo: '1'
};

const diasSemana = [
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' },
  { value: '0', label: 'Domingo' }
];

export default function HorariosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingHorario, setEditingHorario] = useState<BloqueHorario | null>(null);

  const { data: horariosData, loading, error, refetch } = useQuery(GET_BLOQUES_HORARIOS);
  const [crearBloqueHorario] = useMutation(CREAR_BLOQUE_HORARIO);
  const [actualizarBloqueHorario] = useMutation(ACTUALIZAR_BLOQUE_HORARIO);
  const [eliminarBloqueHorario] = useMutation(ELIMINAR_BLOQUE_HORARIO);

  // Debug: Mostrar los datos que llegan
  console.log('Horarios Data:', horariosData);
  console.log('Loading:', loading);
  console.log('Error:', error);

  // Ordenar horarios por día de semana y luego por hora de inicio
  const horarios: BloqueHorario[] = [...((horariosData as any)?.bloquesHorarios || [])]
    .sort((a: BloqueHorario, b: BloqueHorario) => {
      if (a.diasemana !== b.diasemana) {
        return a.diasemana - b.diasemana;
      }
      return a.horainicio.localeCompare(b.horainicio);
    });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingHorario(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHorario) {
        const updateInput: BloqueHorarioUpdateInput = {
          id: parseInt(editingHorario.id),
          diasemana: parseInt(formData.diasemana),
          horainicio: formData.horainicio,
          horafinal: formData.horafinal,
          activo: parseInt(formData.activo)
        };

        await actualizarBloqueHorario({
          variables: { input: updateInput }
        });
      } else {
        const horarioInput: BloqueHorarioInput = {
          diasemana: parseInt(formData.diasemana),
          horainicio: formData.horainicio,
          horafinal: formData.horafinal,
          activo: parseInt(formData.activo)
        };

        await crearBloqueHorario({
          variables: { input: horarioInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar horario:', error);
    }
  };

  const handleEdit = (horario: BloqueHorario) => {
    setEditingHorario(horario);
    setFormData({
      diasemana: horario.diasemana.toString(),
      horainicio: horario.horainicio,
      horafinal: horario.horafinal,
      activo: horario.activo.toString()
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      try {
        await eliminarBloqueHorario({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar horario:', error);
      }
    }
  };

  const getDiaNombre = (dia: number) => {
    const diaObj = diasSemana.find(d => parseInt(d.value) === dia);
    return diaObj ? diaObj.label : 'Desconocido';
  };

  const formatTime = (time: string) => {
    return time.length === 5 ? time : time.substring(0, 5);
  };

  if (loading) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center">Cargando horarios...</div>
      </CardContent>
    </Card>
  </div>;
  
  if (error) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center text-red-500">
          <p>Error al cargar horarios:</p>
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
            <Clock className="h-5 w-5" />
            Gestión de Horarios
          </CardTitle>
          <CardDescription>
            Administra los bloques horarios de atención de la clínica veterinaria
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Horario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingHorario ? 'Editar Horario' : 'Agregar Nuevo Horario'}
                </DialogTitle>
                <DialogDescription>
                  {editingHorario ? 'Modifica' : 'Define'} el bloque horario de atención aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="diasemana">Día de la Semana</Label>
                  <NativeSelect
                    value={formData.diasemana}
                    onChange={(e) => handleInputChange('diasemana', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar día</option>
                    {diasSemana.map((dia) => (
                      <option key={dia.value} value={dia.value}>
                        {dia.label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horainicio">Hora de Inicio</Label>
                    <Input
                      id="horainicio"
                      type="time"
                      value={formData.horainicio}
                      onChange={(e) => handleInputChange('horainicio', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horafinal">Hora Final</Label>
                    <Input
                      id="horafinal"
                      type="time"
                      value={formData.horafinal}
                      onChange={(e) => handleInputChange('horafinal', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activo">Estado</Label>
                  <NativeSelect
                    value={formData.activo}
                    onChange={(e) => handleInputChange('activo', e.target.value)}
                    required
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </NativeSelect>
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
                    {editingHorario ? 'Actualizar' : 'Crear'} Horario
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
                <TableHead>Día de Semana</TableHead>
                <TableHead>Hora de Inicio</TableHead>
                <TableHead>Hora Final</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No hay horarios registrados. Haz clic en "Agregar Horario" para crear el primero.
                  </TableCell>
                </TableRow>
              ) : (
                horarios.map((horario) => {
                  const inicio = new Date(`1970-01-01T${horario.horainicio}`);
                  const final = new Date(`1970-01-01T${horario.horafinal}`);
                  const duracionMs = final.getTime() - inicio.getTime();
                  const duracionHoras = Math.floor(duracionMs / (1000 * 60 * 60));
                  const duracionMinutos = Math.floor((duracionMs % (1000 * 60 * 60)) / (1000 * 60));
                  const duracionTexto = `${duracionHoras}h ${duracionMinutos}min`;

                  return (
                    <TableRow key={horario.id}>
                      <TableCell className="font-medium">{horario.id}</TableCell>
                      <TableCell>{getDiaNombre(horario.diasemana)}</TableCell>
                      <TableCell>{formatTime(horario.horainicio)}</TableCell>
                      <TableCell>{formatTime(horario.horafinal)}</TableCell>
                      <TableCell className="text-muted-foreground">{duracionTexto}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          horario.activo === 1 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {horario.activo === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(horario)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(horario.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}