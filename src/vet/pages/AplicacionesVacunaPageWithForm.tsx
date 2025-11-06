import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NativeSelect } from '@/components/ui/native-select';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { GET_APLICACIONES_VACUNA, GET_VACUNAS } from '@/graphql/queries/vacunas.query';
import { GET_MASCOTAS } from '@/graphql/queries/mascotas.query';
import { APLICAR_VACUNA, UPDATE_MASCOTA_VACUNA, DELETE_MASCOTA_VACUNA } from '@/graphql/mutations/vacunas.mutation';
import type { AplicacionVacuna, Mascota, Vacuna, MascotaVacunaInput } from '@/vet/interfaces/veterinaria.interface';
import { formatDateTimeForBackend, formatDateTimeForInput } from '@/lib/date-utils';

interface FormData {
    mascotaId: string;
    vacunaId: string;
    fechaAplicacion: string;
    fechaProximaDosis: string;
    veterinario: string;
    observaciones: string;
    lote: string;
}

const initialFormData: FormData = {
    mascotaId: '',
    vacunaId: '',
    fechaAplicacion: '',
    fechaProximaDosis: '',
    veterinario: '',
    observaciones: '',
    lote: ''
};

const AplicacionesVacunaPageWithForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingAplicacion, setEditingAplicacion] = useState<AplicacionVacuna | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    
    // Queries
    const { data: aplicacionesData, loading, refetch } = useQuery(GET_APLICACIONES_VACUNA);
    const { data: mascotasData } = useQuery(GET_MASCOTAS);
    const { data: vacunasData } = useQuery(GET_VACUNAS);
    
    // Mutations
    const [createAplicacion] = useMutation(APLICAR_VACUNA);
    const [updateAplicacion] = useMutation(UPDATE_MASCOTA_VACUNA);
    const [deleteAplicacion] = useMutation(DELETE_MASCOTA_VACUNA);

    const aplicaciones: AplicacionVacuna[] = (aplicacionesData as any)?.mascotaVacunas || [];
    const mascotas: Mascota[] = (mascotasData as any)?.mascotas || [];
    const vacunas: Vacuna[] = (vacunasData as any)?.vacunas || [];

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingAplicacion(null);
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.mascotaId || !formData.vacunaId || !formData.fechaAplicacion || !formData.veterinario) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const aplicacionInput: MascotaVacunaInput = {
                mascotaId: formData.mascotaId,
                vacunaId: formData.vacunaId,
                fechaAplicacion: formatDateTimeForBackend(formData.fechaAplicacion),
                fechaProximaDosis: formData.fechaProximaDosis ? formatDateTimeForBackend(formData.fechaProximaDosis) : undefined,
                veterinario: formData.veterinario,
                observaciones: formData.observaciones || undefined,
                lote: formData.lote || undefined
            };

            if (editingAplicacion) {
                await updateAplicacion({
                    variables: {
                        input: {
                            id: editingAplicacion.id,
                            ...aplicacionInput
                        }
                    }
                });
                toast.success('Aplicación de vacuna actualizada correctamente');
            } else {
                await createAplicacion({
                    variables: { input: aplicacionInput }
                });
                toast.success('Aplicación de vacuna registrada correctamente');
            }
            
            refetch();
            resetForm();
        } catch (error: any) {
            console.error('Error al guardar aplicación de vacuna:', error);
            toast.error(error.message || 'Error al guardar la aplicación de vacuna');
        }
    };

    const handleEdit = (aplicacion: AplicacionVacuna) => {
        setEditingAplicacion(aplicacion);
        setFormData({
            mascotaId: aplicacion.mascota.id,
            vacunaId: aplicacion.vacuna.id,   
            fechaAplicacion: formatDateTimeForInput(aplicacion.fechaAplicacion),
            fechaProximaDosis: aplicacion.fechaProximaDosis ? formatDateTimeForInput(aplicacion.fechaProximaDosis) : '',
            veterinario: aplicacion.veterinario,
            observaciones: aplicacion.observaciones || '',
            lote: aplicacion.lote || ''
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro de aplicación de vacuna?')) {
            try {
                await deleteAplicacion({ variables: { id } });
                toast.success('Aplicación de vacuna eliminada correctamente');
                refetch();
            } catch (error: any) {
                console.error('Error al eliminar aplicación de vacuna:', error);
                toast.error(error.message || 'Error al eliminar la aplicación de vacuna');
            }
        }
    };

    const getMascotaInfo = (mascota: Mascota) => {
        return `${mascota.nombre} (${mascota.cliente.nombre} ${mascota.cliente.apellidos})`;
    };

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString('es-ES', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div>Cargando aplicaciones de vacuna...</div>;

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Aplicaciones de Vacuna</CardTitle>
                            <CardDescription>
                                Registra y administra las aplicaciones de vacunas a las mascotas
                            </CardDescription>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Aplicación
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingAplicacion ? 'Editar Aplicación de Vacuna' : 'Nueva Aplicación de Vacuna'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingAplicacion ? 'Modifica los detalles de la aplicación' : 'Registra una nueva aplicación de vacuna'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="mascotaId">Mascota *</Label>
                                            <NativeSelect
                                                id="mascotaId"
                                                value={formData.mascotaId}
                                                onChange={(e) => handleInputChange('mascotaId', e.target.value)}
                                            >
                                                <option value="">Selecciona una mascota</option>
                                                {mascotas.map(mascota => (
                                                    <option key={mascota.id} value={mascota.id}>
                                                        {getMascotaInfo(mascota)}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="vacunaId">Vacuna *</Label>
                                            <NativeSelect
                                                id="vacunaId"
                                                value={formData.vacunaId}
                                                onChange={(e) => handleInputChange('vacunaId', e.target.value)}
                                            >
                                                <option value="">Selecciona una vacuna</option>
                                                {vacunas.map(vacuna => (
                                                    <option key={vacuna.id} value={vacuna.id}>
                                                        {vacuna.nombre} - {vacuna.laboratorio}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fechaAplicacion">Fecha y Hora de Aplicación *</Label>
                                                <Input
                                                    id="fechaAplicacion"
                                                    type="datetime-local"
                                                    value={formData.fechaAplicacion}
                                                    onChange={(e) => handleInputChange('fechaAplicacion', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fechaProximaDosis">Fecha y Hora de Próxima Dosis</Label>
                                                <Input
                                                    id="fechaProximaDosis"
                                                    type="datetime-local"
                                                    value={formData.fechaProximaDosis}
                                                    onChange={(e) => handleInputChange('fechaProximaDosis', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="veterinario">Veterinario *</Label>
                                            <Input
                                                id="veterinario"
                                                value={formData.veterinario}
                                                onChange={(e) => handleInputChange('veterinario', e.target.value)}
                                                placeholder="Nombre del veterinario"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lote">Lote</Label>
                                            <Input
                                                id="lote"
                                                value={formData.lote}
                                                onChange={(e) => handleInputChange('lote', e.target.value)}
                                                placeholder="Número de lote de la vacuna"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="observaciones">Observaciones</Label>
                                            <textarea
                                                id="observaciones"
                                                value={formData.observaciones}
                                                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                                placeholder="Observaciones sobre la aplicación"
                                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">
                                            {editingAplicacion ? 'Actualizar' : 'Registrar'} Aplicación
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Vacuna</TableHead>
                                <TableHead>Fecha Aplicación</TableHead>
                                <TableHead>Próxima Dosis</TableHead>
                                <TableHead>Veterinario</TableHead>
                                <TableHead>Lote</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {aplicaciones.map((aplicacion) => (
                                <TableRow key={aplicacion.id}>
                                    <TableCell>{aplicacion.mascota.nombre}</TableCell>
                                    <TableCell>
                                        {aplicacion.mascota.cliente.nombre} {aplicacion.mascota.cliente.apellidos}
                                    </TableCell>
                                    <TableCell>{aplicacion.vacuna.nombre}</TableCell>
                                    <TableCell>
                                        {formatDateTime(aplicacion.fechaAplicacion)}
                                    </TableCell>
                                    <TableCell>
                                        {aplicacion.fechaProximaDosis 
                                            ? formatDateTime(aplicacion.fechaProximaDosis) 
                                            : 'No programada'}
                                    </TableCell>
                                    <TableCell>{aplicacion.veterinario}</TableCell>
                                    <TableCell>{aplicacion.lote || 'No especificado'}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(aplicacion)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(aplicacion.id)}
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
};

export default AplicacionesVacunaPageWithForm;