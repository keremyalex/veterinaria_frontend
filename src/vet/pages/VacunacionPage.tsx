import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import { Trash2, Edit, Plus, Syringe, Calendar, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { GET_CARNETS_VACUNACION, GET_MASCOTAS, GET_VACUNAS, GET_DETALLES_VACUNACION } from '@/graphql/queries/clinic.queries';
import { CREAR_CARNET_VACUNACION, CREAR_DETALLE_VACUNACION, ACTUALIZAR_DETALLE_VACUNACION, ELIMINAR_DETALLE_VACUNACION } from '@/graphql/mutations/clinic.mutations';
import type { CarnetVacunacion, DetalleVacunacion, Mascota, Vacuna, CarnetVacunacionInput, DetalleVacunacionInput, DetalleVacunacionUpdateInput } from '@/vet/interfaces/clinic.interface';

interface FormData {
  fechaemision: string;
  mascotaId: string;
}

interface DetalleFormData {
  fechavacunacion: string;
  proximavacunacion: string;
  vacunaId: string;
  carnetVacunacionId: string;
}

const initialFormData: FormData = {
  fechaemision: '',
  mascotaId: ''
};

const initialDetalleFormData: DetalleFormData = {
  fechavacunacion: '',
  proximavacunacion: '',
  vacunaId: '',
  carnetVacunacionId: ''
};

export default function VacunacionPage() {
  const [isCarnetOpen, setIsCarnetOpen] = useState(false);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [detalleFormData, setDetalleFormData] = useState<DetalleFormData>(initialDetalleFormData);
  const [editingDetalle, setEditingDetalle] = useState<DetalleVacunacion | null>(null);
  const [selectedCarnet, setSelectedCarnet] = useState<CarnetVacunacion | null>(null);

  // Queries
  const { data: carnetsData, loading, error, refetch } = useQuery(GET_CARNETS_VACUNACION);
  const { data: mascotasData } = useQuery(GET_MASCOTAS);
  const { data: vacunasData } = useQuery(GET_VACUNAS);
  const { data: detallesData, refetch: refetchDetalles } = useQuery(GET_DETALLES_VACUNACION);

  // Mutations
  const [crearCarnetVacunacion] = useMutation(CREAR_CARNET_VACUNACION);
  const [crearDetalleVacunacion] = useMutation(CREAR_DETALLE_VACUNACION);
  const [actualizarDetalleVacunacion] = useMutation(ACTUALIZAR_DETALLE_VACUNACION);
  const [eliminarDetalleVacunacion] = useMutation(ELIMINAR_DETALLE_VACUNACION);

  // Datos ordenados
  const carnets: CarnetVacunacion[] = [...((carnetsData as any)?.carnetsVacunacion || [])]
    .sort((a: CarnetVacunacion, b: CarnetVacunacion) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });

  const mascotas: Mascota[] = (mascotasData as any)?.mascotas || [];
  const vacunas: Vacuna[] = (vacunasData as any)?.vacunas || [];
  const detalles: DetalleVacunacion[] = [...((detallesData as any)?.detallesVacunacion || [])]
    .sort((a: DetalleVacunacion, b: DetalleVacunacion) => {
      const dateA = new Date(a.fechavacunacion);
      const dateB = new Date(b.fechavacunacion);
      return dateB.getTime() - dateA.getTime(); // Más recientes primero
    });

  // Filtrar mascotas sin carnet
  const mascotasSinCarnet = mascotas.filter(mascota => 
    !carnets.some(carnet => carnet.mascota?.id === mascota.id)
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetalleInputChange = (field: keyof DetalleFormData, value: string) => {
    setDetalleFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];
    
    setFormData({
      ...initialFormData,
      fechaemision: fechaActual
    });
  };

  const resetDetalleForm = () => {
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];
    
    setDetalleFormData({
      ...initialDetalleFormData,
      fechavacunacion: fechaActual,
      carnetVacunacionId: selectedCarnet?.id || ''
    });
    setEditingDetalle(null);
  };

  const handleSubmitCarnet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const carnetInput: CarnetVacunacionInput = {
        fechaemision: formData.fechaemision,
        mascotaId: parseInt(formData.mascotaId)
      };

      await crearCarnetVacunacion({
        variables: { input: carnetInput }
      });

      refetch();
      resetForm();
      setIsCarnetOpen(false);
    } catch (error) {
      console.error('Error al crear carnet de vacunación:', error);
    }
  };

  const handleSubmitDetalle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDetalle) {
        const updateInput: DetalleVacunacionUpdateInput = {
          id: editingDetalle.id,
          fechavacunacion: detalleFormData.fechavacunacion,
          proximavacunacion: detalleFormData.proximavacunacion || undefined
        };

        await actualizarDetalleVacunacion({
          variables: { input: updateInput }
        });
      } else {
        const detalleInput: DetalleVacunacionInput = {
          fechavacunacion: detalleFormData.fechavacunacion,
          proximavacunacion: detalleFormData.proximavacunacion || undefined,
          carnetVacunacionId: parseInt(detalleFormData.carnetVacunacionId),
          vacunaId: parseInt(detalleFormData.vacunaId)
        };

        await crearDetalleVacunacion({
          variables: { input: detalleInput }
        });
      }

      refetch();
      refetchDetalles();
      resetDetalleForm();
      setIsDetalleOpen(false);
    } catch (error) {
      console.error('Error al guardar detalle de vacunación:', error);
    }
  };

  const handleEditDetalle = (detalle: DetalleVacunacion) => {
    setEditingDetalle(detalle);
    setDetalleFormData({
      fechavacunacion: detalle.fechavacunacion,
      proximavacunacion: detalle.proximavacunacion || '',
      vacunaId: detalle.vacuna?.id || '',
      carnetVacunacionId: detalle.carnetVacunacion?.id || ''
    });
    setIsDetalleOpen(true);
  };

  const handleDeleteDetalle = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de vacunación?')) {
      try {
        await eliminarDetalleVacunacion({
          variables: { id }
        });
        refetch();
        refetchDetalles();
      } catch (error) {
        console.error('Error al eliminar detalle de vacunación:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const isVaccinationOverdue = (proximaFecha: string) => {
    const today = new Date();
    const nextDate = new Date(proximaFecha);
    return nextDate < today;
  };

  const getDetallesByCarnet = (carnetId: string) => {
    return detalles.filter(detalle => detalle.carnetVacunacion?.id === carnetId);
  };

  if (loading) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center">Cargando información de vacunación...</div>
      </CardContent>
    </Card>
  </div>;
  
  if (error) return <div className="container mx-auto py-6">
    <Card>
      <CardContent className="py-6">
        <div className="text-center text-red-500">
          <p>Error al cargar información:</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </CardContent>
    </Card>
  </div>;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header con acciones principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Control de Vacunación
          </CardTitle>
          <CardDescription>
            Gestiona los carnets de vacunación y el historial de vacunas aplicadas
          </CardDescription>
          <div className="flex gap-2">
            <Dialog open={isCarnetOpen} onOpenChange={setIsCarnetOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Carnet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Crear Carnet de Vacunación</DialogTitle>
                  <DialogDescription>
                    Crea un nuevo carnet de vacunación para una mascota
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitCarnet} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mascotaId">Mascota</Label>
                    <NativeSelect
                      value={formData.mascotaId}
                      onChange={(e) => handleInputChange('mascotaId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar mascota</option>
                      {mascotasSinCarnet.map((mascota) => (
                        <option key={mascota.id} value={mascota.id}>
                          {mascota.nombre} - {mascota.cliente?.nombre} {mascota.cliente?.apellido}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaemision">Fecha de Emisión</Label>
                    <Input
                      id="fechaemision"
                      type="date"
                      value={formData.fechaemision}
                      onChange={(e) => handleInputChange('fechaemision', e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCarnetOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Carnet</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {selectedCarnet && (
              <Dialog open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={resetDetalleForm}>
                    <Syringe className="mr-2 h-4 w-4" />
                    Registrar Vacuna
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingDetalle ? 'Editar' : 'Registrar'} Vacuna
                    </DialogTitle>
                    <DialogDescription>
                      {editingDetalle ? 'Modifica' : 'Registra'} la información de la vacuna aplicada
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitDetalle} className="space-y-4">
                    {!editingDetalle && (
                      <div className="space-y-2">
                        <Label htmlFor="vacunaId">Tipo de Vacuna</Label>
                        <NativeSelect
                          value={detalleFormData.vacunaId}
                          onChange={(e) => handleDetalleInputChange('vacunaId', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar vacuna</option>
                          {vacunas.map((vacuna) => (
                            <option key={vacuna.id} value={vacuna.id}>
                              {vacuna.descripcion}
                            </option>
                          ))}
                        </NativeSelect>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="fechavacunacion">Fecha de Aplicación</Label>
                      <Input
                        id="fechavacunacion"
                        type="date"
                        value={detalleFormData.fechavacunacion}
                        onChange={(e) => handleDetalleInputChange('fechavacunacion', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proximavacunacion">Próxima Vacunación (Opcional)</Label>
                      <Input
                        id="proximavacunacion"
                        type="date"
                        value={detalleFormData.proximavacunacion}
                        onChange={(e) => handleDetalleInputChange('proximavacunacion', e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDetalleOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingDetalle ? 'Actualizar' : 'Registrar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Lista de carnets de vacunación */}
      <Card>
        <CardHeader>
          <CardTitle>Carnets de Vacunación</CardTitle>
          <CardDescription>
            Haz clic en un carnet para ver y gestionar las vacunas aplicadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                <TableHead>Vacunas Aplicadas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carnets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No hay carnets de vacunación registrados. Haz clic en "Nuevo Carnet" para crear el primero.
                  </TableCell>
                </TableRow>
              ) : (
                carnets.map((carnet) => {
                  const detallesCarnet = getDetallesByCarnet(carnet.id);
                  const proximasVacunas = detallesCarnet.filter(d => d.proximavacunacion && isVaccinationOverdue(d.proximavacunacion));
                  
                  return (
                    <TableRow 
                      key={carnet.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${selectedCarnet?.id === carnet.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedCarnet(selectedCarnet?.id === carnet.id ? null : carnet)}
                    >
                      <TableCell className="font-medium">{carnet.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{carnet.mascota?.nombre}</div>
                          <div className="text-xs text-muted-foreground">
                            {carnet.mascota?.especie?.descripcion}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {carnet.mascota?.cliente?.nombre} {carnet.mascota?.cliente?.apellido}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(carnet.fechaemision)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{detallesCarnet.length}</span> vacunas
                      </TableCell>
                      <TableCell>
                        {proximasVacunas.length > 0 ? (
                          <div className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">Pendientes</span>
                          </div>
                        ) : detallesCarnet.length > 0 ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Al día</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Shield className="h-4 w-4" />
                            <span className="text-xs">Sin vacunas</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={selectedCarnet?.id === carnet.id ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCarnet(selectedCarnet?.id === carnet.id ? null : carnet);
                          }}
                        >
                          {selectedCarnet?.id === carnet.id ? 'Seleccionado' : 'Seleccionar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalles del carnet seleccionado */}
      {selectedCarnet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Historial de Vacunas - {selectedCarnet.mascota?.nombre}
            </CardTitle>
            <CardDescription>
              Carnet #{selectedCarnet.id} emitido el {formatDate(selectedCarnet.fechaemision)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vacuna</TableHead>
                  <TableHead>Fecha Aplicación</TableHead>
                  <TableHead>Próxima Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getDetallesByCarnet(selectedCarnet.id).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No hay vacunas registradas para este carnet. Haz clic en "Registrar Vacuna" para agregar la primera.
                    </TableCell>
                  </TableRow>
                ) : (
                  getDetallesByCarnet(selectedCarnet.id).map((detalle) => {
                    const isOverdue = detalle.proximavacunacion && isVaccinationOverdue(detalle.proximavacunacion);
                    
                    return (
                      <TableRow key={detalle.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Syringe className="h-4 w-4 text-blue-600" />
                            {detalle.vacuna?.descripcion}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(detalle.fechavacunacion)}</TableCell>
                        <TableCell>
                          {detalle.proximavacunacion ? (
                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                              {isOverdue ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                              {formatDate(detalle.proximavacunacion)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No programada</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {detalle.proximavacunacion ? (
                            isOverdue ? (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">Vencida</span>
                            ) : (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Vigente</span>
                            )
                          ) : (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">Única dosis</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDetalle(detalle)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDetalle(detalle.id)}
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
      )}
    </div>
  );
}