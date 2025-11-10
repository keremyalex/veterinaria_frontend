import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import { Trash2, Edit, Plus, Calendar, Clock } from 'lucide-react';
import { GET_CITAS, GET_DOCTORES, GET_MASCOTAS, GET_BLOQUES_HORARIOS_ACTIVOS } from '@/graphql/queries/clinic.queries';
import { CREAR_CITA, ACTUALIZAR_CITA, ELIMINAR_CITA } from '@/graphql/mutations/clinic.mutations';
import type { Cita, CitaInput, CitaUpdateInput, Doctor, Mascota, BloqueHorario } from '@/vet/interfaces/clinic.interface';

interface FormData {
  motivo: string;
  fechareserva: string;
  estado: string;
  doctorId: string;
  mascotaId: string;
  bloqueHorarioId: string;
}

const initialFormData: FormData = {
  motivo: '',
  fechareserva: '',
  estado: '0',
  doctorId: '',
  mascotaId: '',
  bloqueHorarioId: ''
};

const estadosCita = [
  { value: '0', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: '1', label: 'Confirmada', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: '2', label: 'Completada', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: '3', label: 'Cancelada', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
];

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function CitasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);

  // Queries
  const { data: citasData, loading, error, refetch } = useQuery(GET_CITAS);
  const { data: doctoresData } = useQuery(GET_DOCTORES);
  const { data: mascotasData } = useQuery(GET_MASCOTAS);
  const { data: horariosData } = useQuery(GET_BLOQUES_HORARIOS_ACTIVOS);

  // Mutations
  const [crearCita] = useMutation(CREAR_CITA);
  const [actualizarCita] = useMutation(ACTUALIZAR_CITA);
  const [eliminarCita] = useMutation(ELIMINAR_CITA);

  // Datos ordenados
  const citas: Cita[] = [...((citasData as any)?.citas || [])]
    .sort((a: Cita, b: Cita) => {
      // Ordenar por fecha de reserva descendente (más recientes primero)
      const dateA = new Date(a.fechareserva);
      const dateB = new Date(b.fechareserva);
      return dateB.getTime() - dateA.getTime();
    });
  
  const doctores: Doctor[] = (doctoresData as any)?.doctores || [];
  const mascotas: Mascota[] = (mascotasData as any)?.mascotas || [];
  const horarios: BloqueHorario[] = (horariosData as any)?.bloquesHorariosActivos || [];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingCita(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCita) {
        const updateInput: CitaUpdateInput = {
          id: editingCita.id,
          motivo: formData.motivo,
          fechareserva: formData.fechareserva,
          estado: parseInt(formData.estado)
        };

        await actualizarCita({
          variables: { input: updateInput }
        });
      } else {
        const citaInput: CitaInput = {
          fechacreacion: new Date().toISOString(),
          motivo: formData.motivo,
          fechareserva: formData.fechareserva,
          estado: parseInt(formData.estado),
          doctorId: parseInt(formData.doctorId),
          mascotaId: parseInt(formData.mascotaId),
          bloqueHorarioId: formData.bloqueHorarioId ? parseInt(formData.bloqueHorarioId) : undefined
        };

        await crearCita({
          variables: { input: citaInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar cita:', error);
    }
  };

  const handleEdit = (cita: Cita) => {
    setEditingCita(cita);
    setFormData({
      motivo: cita.motivo,
      fechareserva: cita.fechareserva,
      estado: cita.estado.toString(),
      doctorId: cita.doctor.id,
      mascotaId: cita.mascota.id,
      bloqueHorarioId: cita.bloqueHorario?.id || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        await eliminarCita({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar cita:', error);
      }
    }
  };

  const getEstadoInfo = (estado: number) => {
    const estadoObj = estadosCita.find(e => parseInt(e.value) === estado);
    return estadoObj || estadosCita[0];
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dia = diasSemana[date.getDay()];
    const fecha = date.toLocaleDateString('es-ES');
    const hora = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return { dia, fecha, hora };
  };

  const getHorarioInfo = (horario: BloqueHorario) => {
    const dia = diasSemana[horario.diasemana];
    return `${dia} ${horario.horainicio.substring(0, 5)} - ${horario.horafinal.substring(0, 5)}`;
  };

  if (loading) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center">Cargando citas...</div>
      </CardContent>
    </Card>
  </div>;
  
  if (error) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center text-red-500">
          <p>Error al cargar citas:</p>
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
            <Calendar className="h-5 w-5" />
            Gestión de Citas
          </CardTitle>
          <CardDescription>
            Administra las citas médicas veterinarias programadas
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agendar Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCita ? 'Editar Cita' : 'Agendar Nueva Cita'}
                </DialogTitle>
                <DialogDescription>
                  {editingCita ? 'Modifica' : 'Programa'} la cita médica aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorId">Doctor</Label>
                    <NativeSelect
                      value={formData.doctorId}
                      onChange={(e) => handleInputChange('doctorId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar doctor</option>
                      {doctores.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.nombre} {doctor.apellido}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado de la Cita</Label>
                    <NativeSelect
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      required
                    >
                      {estadosCita.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mascotaId">Mascota</Label>
                  <NativeSelect
                    value={formData.mascotaId}
                    onChange={(e) => handleInputChange('mascotaId', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar mascota</option>
                    {mascotas.map((mascota) => (
                      <option key={mascota.id} value={mascota.id}>
                        {mascota.nombre} ({mascota.especie.descripcion}) - {mascota.cliente.nombre} {mascota.cliente.apellido}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechareserva">Fecha y Hora de la Cita</Label>
                  <Input
                    id="fechareserva"
                    type="datetime-local"
                    value={formData.fechareserva}
                    onChange={(e) => handleInputChange('fechareserva', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloqueHorarioId">Bloque Horario (Opcional)</Label>
                  <NativeSelect
                    value={formData.bloqueHorarioId}
                    onChange={(e) => handleInputChange('bloqueHorarioId', e.target.value)}
                  >
                    <option value="">Sin bloque horario específico</option>
                    {horarios.map((horario) => (
                      <option key={horario.id} value={horario.id}>
                        {getHorarioInfo(horario)}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo de la Consulta</Label>
                  <Input
                    id="motivo"
                    value={formData.motivo}
                    onChange={(e) => handleInputChange('motivo', e.target.value)}
                    placeholder="Describe el motivo de la consulta..."
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
                    {editingCita ? 'Actualizar' : 'Agendar'} Cita
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
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No hay citas programadas. Haz clic en "Agendar Cita" para crear la primera.
                  </TableCell>
                </TableRow>
              ) : (
                citas.map((cita) => {
                  const fechaInfo = formatDateTime(cita.fechareserva);
                  const estadoInfo = getEstadoInfo(cita.estado);

                  return (
                    <TableRow key={cita.id}>
                      <TableCell className="font-medium">{cita.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{fechaInfo.dia}</span>
                        </div>
                        <div>{fechaInfo.fecha}</div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{fechaInfo.hora}</span>
                        </div>
                      </TableCell>
                      <TableCell>Dr. {cita.doctor.nombre} {cita.doctor.apellido}</TableCell>
                      <TableCell>
                        <div>{cita.mascota.nombre}</div>
                        <div className="text-xs text-muted-foreground">{cita.mascota.especie.descripcion}</div>
                      </TableCell>
                      <TableCell>{cita.mascota.cliente.nombre} {cita.mascota.cliente.apellido}</TableCell>
                      <TableCell className="max-w-xs truncate" title={cita.motivo}>
                        {cita.motivo}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                          {estadoInfo.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cita)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(cita.id)}
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