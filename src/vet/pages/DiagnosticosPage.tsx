import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import { Trash2, Edit, Plus, Stethoscope, Calendar, FileText } from 'lucide-react';
import { GET_DIAGNOSTICOS, GET_CITAS } from '@/graphql/queries/clinic.queries';
import { CREAR_DIAGNOSTICO, ACTUALIZAR_DIAGNOSTICO, ELIMINAR_DIAGNOSTICO } from '@/graphql/mutations/clinic.mutations';
import type { Diagnostico, DiagnosticoInput, DiagnosticoUpdateInput, Cita } from '@/vet/interfaces/clinic.interface';

interface FormData {
  descripcion: string;
  fecharegistro: string;
  observaciones: string;
  citaId: string;
}

const initialFormData: FormData = {
  descripcion: '',
  fecharegistro: '',
  observaciones: '',
  citaId: ''
};

export default function DiagnosticosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingDiagnostico, setEditingDiagnostico] = useState<Diagnostico | null>(null);

  // Queries
  const { data: diagnosticosData, loading, error, refetch } = useQuery(GET_DIAGNOSTICOS);
  const { data: citasData } = useQuery(GET_CITAS);

  // Mutations
  const [crearDiagnostico] = useMutation(CREAR_DIAGNOSTICO);
  const [actualizarDiagnostico] = useMutation(ACTUALIZAR_DIAGNOSTICO);
  const [eliminarDiagnostico] = useMutation(ELIMINAR_DIAGNOSTICO);

  // Datos ordenados por ID ascendente (más antiguos primero: 1, 2, 3...)
  const diagnosticos: Diagnostico[] = [...((diagnosticosData as any)?.diagnosticos || [])]
    .sort((a: Diagnostico, b: Diagnostico) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });
  
  const citas: Cita[] = (citasData as any)?.citas || [];

  // Filtrar citas completadas (estado 2) que no tengan diagnóstico aún
  const citasSinDiagnostico = citas.filter(cita => 
    cita?.estado === 2 && !diagnosticos.some(diag => diag?.cita?.id === cita?.id)
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    // Establecer fecha actual por defecto
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];
    
    setFormData({
      ...initialFormData,
      fecharegistro: fechaActual
    });
    setEditingDiagnostico(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDiagnostico) {
        const updateInput: DiagnosticoUpdateInput = {
          id: editingDiagnostico.id,
          descripcion: formData.descripcion,
          fecharegistro: formData.fecharegistro,
          observaciones: formData.observaciones
        };

        await actualizarDiagnostico({
          variables: { input: updateInput }
        });
      } else {
        const diagnosticoInput: DiagnosticoInput = {
          descripcion: formData.descripcion,
          fecharegistro: formData.fecharegistro,
          observaciones: formData.observaciones,
          citaId: parseInt(formData.citaId)
        };

        await crearDiagnostico({
          variables: { input: diagnosticoInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar diagnóstico:', error);
    }
  };

  const handleEdit = (diagnostico: Diagnostico) => {
    setEditingDiagnostico(diagnostico);
    setFormData({
      descripcion: diagnostico.descripcion || '',
      fecharegistro: diagnostico.fecharegistro || '',
      observaciones: diagnostico.observaciones || '',
      citaId: diagnostico.cita?.id || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este diagnóstico?')) {
      try {
        await eliminarDiagnostico({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar diagnóstico:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCitaInfo = (cita: Cita) => {
    const fecha = new Date(cita.fechareserva).toLocaleDateString('es-ES');
    return `${fecha} - ${cita.mascota?.nombre || 'N/A'} (${cita.mascota?.cliente?.nombre || 'N/A'} ${cita.mascota?.cliente?.apellido || ''})`;
  };

  if (loading) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center">Cargando diagnósticos...</div>
      </CardContent>
    </Card>
  </div>;
  
  if (error) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center text-red-500">
          <p>Error al cargar diagnósticos:</p>
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
            <Stethoscope className="h-5 w-5" />
            Gestión de Diagnósticos
          </CardTitle>
          <CardDescription>
            Administra los diagnósticos médicos y resultados de consultas veterinarias
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Diagnóstico
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDiagnostico ? 'Editar Diagnóstico' : 'Crear Nuevo Diagnóstico'}
                </DialogTitle>
                <DialogDescription>
                  {editingDiagnostico ? 'Modifica' : 'Registra'} el diagnóstico médico aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingDiagnostico && (
                  <div className="space-y-2">
                    <Label htmlFor="citaId">Cita Médica</Label>
                    <NativeSelect
                      value={formData.citaId}
                      onChange={(e) => handleInputChange('citaId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar cita completada</option>
                      {citasSinDiagnostico.map((cita) => (
                        <option key={cita.id} value={cita.id}>
                          {getCitaInfo(cita)} - Dr. {cita.doctor?.nombre || 'N/A'} {cita.doctor?.apellido || ''}
                        </option>
                      ))}
                    </NativeSelect>
                    <p className="text-xs text-muted-foreground">
                      Solo se muestran citas completadas sin diagnóstico previo
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fecharegistro">Fecha del Diagnóstico</Label>
                  <Input
                    id="fecharegistro"
                    type="date"
                    value={formData.fecharegistro}
                    onChange={(e) => handleInputChange('fecharegistro', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Diagnóstico</Label>
                  <textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    placeholder="Describe el diagnóstico médico detalladamente..."
                    required
                    className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md shadow-xs resize-none focus:ring-2 focus:ring-ring focus:border-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                  <textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                    placeholder="Notas adicionales, recomendaciones, seguimiento..."
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
                    {editingDiagnostico ? 'Actualizar' : 'Registrar'} Diagnóstico
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
                <TableHead>Fecha</TableHead>
                <TableHead>Cita Asociada</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnosticos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No hay diagnósticos registrados. Haz clic en "Agregar Diagnóstico" para crear el primero.
                  </TableCell>
                </TableRow>
              ) : (
                diagnosticos.map((diagnostico) => {
                  const fechaCita = diagnostico.cita?.fechareserva ? new Date(diagnostico.cita.fechareserva) : new Date();

                  return (
                    <TableRow key={diagnostico.id}>
                      <TableCell className="font-medium">{diagnostico.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{formatDate(diagnostico.fecharegistro)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Cita #{diagnostico.cita?.id || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">
                            {fechaCita.toLocaleDateString('es-ES')} - {diagnostico.cita?.motivo || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{diagnostico.cita?.mascota?.nombre || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">
                            {diagnostico.cita?.mascota?.especie?.descripcion || 'N/A'} - {diagnostico.cita?.mascota?.cliente?.nombre || 'N/A'} {diagnostico.cita?.mascota?.cliente?.apellido || ''}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>Dr. {diagnostico.cita?.doctor?.nombre || 'N/A'} {diagnostico.cita?.doctor?.apellido || ''}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={diagnostico.descripcion}>
                          <FileText className="h-3 w-3 inline mr-1 text-muted-foreground" />
                          {diagnostico.descripcion}
                        </div>
                        {diagnostico.observaciones && (
                          <div className="text-xs text-muted-foreground mt-1 truncate" title={diagnostico.observaciones}>
                            Obs: {diagnostico.observaciones}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(diagnostico)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(diagnostico.id)}
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