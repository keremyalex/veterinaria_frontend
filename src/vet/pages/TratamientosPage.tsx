import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import { Trash2, Edit, Plus, Heart, Calendar, FileText, Activity } from 'lucide-react';
import { GET_TRATAMIENTOS, GET_DIAGNOSTICOS } from '@/graphql/queries/clinic.queries';
import { CREAR_TRATAMIENTO, ACTUALIZAR_TRATAMIENTO, ELIMINAR_TRATAMIENTO } from '@/graphql/mutations/clinic.mutations';
import type { Tratamiento, TratamientoInput, TratamientoUpdateInput, Diagnostico } from '@/vet/interfaces/clinic.interface';

interface FormData {
  nombre: string;
  descripcion: string;
  observaciones: string;
  diagnosticoId: string;
}

const initialFormData: FormData = {
  nombre: '',
  descripcion: '',
  observaciones: '',
  diagnosticoId: ''
};

export default function TratamientosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingTratamiento, setEditingTratamiento] = useState<Tratamiento | null>(null);

  // Queries
  const { data: tratamientosData, loading, error, refetch } = useQuery(GET_TRATAMIENTOS);
  const { data: diagnosticosData } = useQuery(GET_DIAGNOSTICOS);

  // Mutations
  const [crearTratamiento] = useMutation(CREAR_TRATAMIENTO);
  const [actualizarTratamiento] = useMutation(ACTUALIZAR_TRATAMIENTO);
  const [eliminarTratamiento] = useMutation(ELIMINAR_TRATAMIENTO);

  // Datos ordenados por ID ascendente (más antiguos primero: 1, 2, 3...)
  const tratamientos: Tratamiento[] = [...((tratamientosData as any)?.tratamientos || [])]
    .sort((a: Tratamiento, b: Tratamiento) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });
  
  const diagnosticos: Diagnostico[] = (diagnosticosData as any)?.diagnosticos || [];

  // Filtrar diagnósticos que no tengan tratamiento aún
  const diagnosticosSinTratamiento = diagnosticos.filter(diagnostico => 
    !tratamientos.some(trat => trat.diagnostico?.id === diagnostico.id)
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingTratamiento(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTratamiento) {
        const updateInput: TratamientoUpdateInput = {
          id: editingTratamiento.id,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          observaciones: formData.observaciones
        };

        await actualizarTratamiento({
          variables: { input: updateInput }
        });
      } else {
        const tratamientoInput: TratamientoInput = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          observaciones: formData.observaciones,
          diagnosticoId: parseInt(formData.diagnosticoId)
        };

        await crearTratamiento({
          variables: { input: tratamientoInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar tratamiento:', error);
    }
  };

  const handleEdit = (tratamiento: Tratamiento) => {
    setEditingTratamiento(tratamiento);
    setFormData({
      nombre: tratamiento.nombre || '',
      descripcion: tratamiento.descripcion || '',
      observaciones: tratamiento.observaciones || '',
      diagnosticoId: tratamiento.diagnostico?.id || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tratamiento?')) {
      try {
        await eliminarTratamiento({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar tratamiento:', error);
      }
    }
  };

  const getDiagnosticoInfo = (diagnostico: Diagnostico) => {
    const fecha = new Date(diagnostico.fecharegistro).toLocaleDateString('es-ES');
    return `${fecha} - ${diagnostico.cita?.mascota?.nombre || 'N/A'} (${diagnostico.cita?.mascota?.cliente?.nombre || 'N/A'})`;
  };

  if (loading) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center">Cargando tratamientos...</div>
      </CardContent>
    </Card>
  </div>;
  
  if (error) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center text-red-500">
          <p>Error al cargar tratamientos:</p>
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
            <Heart className="h-5 w-5" />
            Gestión de Tratamientos
          </CardTitle>
          <CardDescription>
            Administra los tratamientos médicos prescritos para los pacientes
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Tratamiento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTratamiento ? 'Editar Tratamiento' : 'Crear Nuevo Tratamiento'}
                </DialogTitle>
                <DialogDescription>
                  {editingTratamiento ? 'Modifica' : 'Registra'} el tratamiento médico aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingTratamiento && (
                  <div className="space-y-2">
                    <Label htmlFor="diagnosticoId">Diagnóstico Base</Label>
                    <NativeSelect
                      value={formData.diagnosticoId}
                      onChange={(e) => handleInputChange('diagnosticoId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar diagnóstico</option>
                      {diagnosticosSinTratamiento.map((diagnostico) => (
                        <option key={diagnostico.id} value={diagnostico.id}>
                          {getDiagnosticoInfo(diagnostico)} - {diagnostico.descripcion.substring(0, 50)}...
                        </option>
                      ))}
                    </NativeSelect>
                    <p className="text-xs text-muted-foreground">
                      Solo se muestran diagnósticos sin tratamiento previo
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Tratamiento</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Ej: Antibioterapia post-cirugía, Fisioterapia..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del Tratamiento</Label>
                  <textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Describe detalladamente el tratamiento a seguir..."
                    required
                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md shadow-xs resize-none focus:ring-2 focus:ring-ring focus:border-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Instrucciones y Observaciones</Label>
                  <textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    placeholder="Instrucciones especiales, frecuencia, duración, precauciones..."
                    className="w-full min-h-20 px-3 py-2 border border-input rounded-md shadow-xs resize-none focus:ring-2 focus:ring-ring focus:border-ring"
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
                    {editingTratamiento ? 'Actualizar' : 'Registrar'} Tratamiento
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
                <TableHead>Tratamiento</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Diagnóstico Base</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tratamientos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No hay tratamientos registrados. Haz clic en "Agregar Tratamiento" para crear el primero.
                  </TableCell>
                </TableRow>
              ) : (
                tratamientos.map((tratamiento) => {
                  const fechaDiagnostico = tratamiento.diagnostico?.fecharegistro 
                    ? new Date(tratamiento.diagnostico.fecharegistro).toLocaleDateString('es-ES')
                    : 'N/A';

                  return (
                    <TableRow key={tratamiento.id}>
                      <TableCell className="font-medium">{tratamiento.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tratamiento.nombre}</div>
                          {tratamiento.observaciones && (
                            <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate" title={tratamiento.observaciones}>
                              <Activity className="h-3 w-3 inline mr-1" />
                              {tratamiento.observaciones}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tratamiento.diagnostico?.cita?.mascota?.nombre || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">
                            {tratamiento.diagnostico?.cita?.mascota?.especie?.descripcion || 'N/A'} - {tratamiento.diagnostico?.cita?.mascota?.cliente?.nombre || 'N/A'} {tratamiento.diagnostico?.cita?.mascota?.cliente?.apellido || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{fechaDiagnostico}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate" title={tratamiento.diagnostico?.descripcion}>
                            {tratamiento.diagnostico?.descripcion || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        Dr. {tratamiento.diagnostico?.cita?.doctor?.nombre || 'N/A'} {tratamiento.diagnostico?.cita?.doctor?.apellido || ''}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={tratamiento.descripcion}>
                          <FileText className="h-3 w-3 inline mr-1 text-muted-foreground" />
                          {tratamiento.descripcion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(tratamiento)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(tratamiento.id)}
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