import { useState, useEffect, useMemo } from 'react';
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

import { GET_CITAS } from '@/graphql/queries/citas.query';
import { GET_CLIENTES } from '@/graphql/queries/clientes.query';
import { GET_MASCOTAS } from '@/graphql/queries/mascotas.query';
import { GET_HORARIOS } from '@/graphql/queries/horarios.query';
import { CREATE_CITA, UPDATE_CITA, DELETE_CITA } from '@/graphql/mutations/citas.mutation';
import type { Cita, Cliente, Mascota, Horario, CitaInput } from '@/vet/interfaces/veterinaria.interface';
import { formatDateTime, formatDateTimeForBackend, formatDateTimeForInput } from '@/lib/date-utils';

interface FormData {
    clienteId: string;
    mascotaId: string;
    horarioId: string;
    fechaProgramada: string;
    motivo: string;
}

const initialFormData: FormData = {
    clienteId: '',
    mascotaId: '',
    horarioId: '',
    fechaProgramada: '',
    motivo: ''
};

const CitasPageWithForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCita, setEditingCita] = useState<Cita | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [filteredMascotas, setFilteredMascotas] = useState<Mascota[]>([]);
    
    // Queries
    const { data: citasData, loading, refetch } = useQuery(GET_CITAS);
    const { data: clientesData } = useQuery(GET_CLIENTES);
    const { data: mascotasData } = useQuery(GET_MASCOTAS);
    const { data: horariosData } = useQuery(GET_HORARIOS);
    
    // Mutations
    const [createCita] = useMutation(CREATE_CITA);
    const [updateCita] = useMutation(UPDATE_CITA);
    const [deleteCita] = useMutation(DELETE_CITA);

    const citas: Cita[] = useMemo(() => (citasData as any)?.citas || [], [citasData]);
    const clientes: Cliente[] = useMemo(() => (clientesData as any)?.clientes || [], [clientesData]);
    const mascotas: Mascota[] = useMemo(() => (mascotasData as any)?.mascotas || [], [mascotasData]);
    const horarios: Horario[] = useMemo(() => (horariosData as any)?.horarios || [], [horariosData]);

    // Filter mascotas based on selected cliente
    // Effect to filter mascotas when clienteId or mascotas change
    useEffect(() => {
        if (formData.clienteId) {
            const filtered = mascotas.filter(mascota => mascota.cliente.id === formData.clienteId);
            setFilteredMascotas(filtered);
        } else {
            setFilteredMascotas([]);
        }
    }, [formData.clienteId, mascotas]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        if (field === 'clienteId') {
            // When changing client, reset mascotaId to avoid invalid combinations
            setFormData(prev => ({ ...prev, [field]: value, mascotaId: '' }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingCita(null);
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.clienteId || !formData.mascotaId || !formData.horarioId || !formData.fechaProgramada || !formData.motivo) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const citaInput: CitaInput = {
                clienteId: formData.clienteId,
                mascotaId: formData.mascotaId,
                horarioId: formData.horarioId,
                fechaProgramada: formatDateTimeForBackend(formData.fechaProgramada),
                motivo: formData.motivo
            };

            if (editingCita) {
                await updateCita({
                    variables: {
                        input: {
                            id: editingCita.id,
                            ...citaInput
                        }
                    }
                });
                toast.success('Cita actualizada correctamente');
            } else {
                await createCita({
                    variables: { input: citaInput }
                });
                toast.success('Cita creada correctamente');
            }
            
            refetch();
            resetForm();
        } catch (error: any) {
            console.error('Error al guardar cita:', error);
            toast.error(error.message || 'Error al guardar la cita');
        }
    };

    const handleEdit = (cita: Cita) => {
        setEditingCita(cita);
        setFormData({
            clienteId: cita.cliente.id,
            mascotaId: cita.mascota.id,
            horarioId: cita.horario.id,
            fechaProgramada: formatDateTimeForInput(cita.fechaProgramada),
            motivo: cita.motivo
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
            try {
                await deleteCita({ variables: { id } });
                toast.success('Cita eliminada correctamente');
                refetch();
            } catch (error: any) {
                console.error('Error al eliminar cita:', error);
                toast.error(error.message || 'Error al eliminar la cita');
            }
        }
    };

    const getClienteNombre = (cliente: Cliente) => {
        return `${cliente.nombre} ${cliente.apellidos}`;
    };

    const getMascotaNombre = (mascota: Mascota) => {
        return mascota.nombre;
    };

    const getHorarioInfo = (horario: Horario) => {
        return `${horario.dia} ${horario.horaInicio}-${horario.horaFin}`;
    };

    if (loading) return <div>Cargando citas...</div>;

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gestión de Citas</CardTitle>
                            <CardDescription>
                                Administra las citas de la veterinaria
                            </CardDescription>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Cita
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingCita ? 'Editar Cita' : 'Nueva Cita'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingCita ? 'Modifica los detalles de la cita' : 'Crea una nueva cita para la veterinaria'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="clienteId">Cliente *</Label>
                                            <NativeSelect
                                                id="clienteId"
                                                value={formData.clienteId}
                                                onChange={(e) => handleInputChange('clienteId', e.target.value)}
                                            >
                                                <option value="">Selecciona un cliente</option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.nombre} {cliente.apellidos}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="mascotaId">Mascota *</Label>
                                            <NativeSelect
                                                id="mascotaId"
                                                value={formData.mascotaId}
                                                onChange={(e) => handleInputChange('mascotaId', e.target.value)}
                                                disabled={!formData.clienteId}
                                            >
                                                <option value="">Selecciona una mascota</option>
                                                {filteredMascotas.map(mascota => (
                                                    <option key={mascota.id} value={mascota.id}>
                                                        {mascota.nombre}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="horarioId">Horario *</Label>
                                            <NativeSelect
                                                id="horarioId"
                                                value={formData.horarioId}
                                                onChange={(e) => handleInputChange('horarioId', e.target.value)}
                                            >
                                                <option value="">Selecciona un horario</option>
                                                {horarios.map(horario => (
                                                    <option key={horario.id} value={horario.id}>
                                                        {horario.dia} - {horario.horaInicio}:00 a {horario.horaFin}:00
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="fechaProgramada">Fecha y Hora *</Label>
                                            <Input
                                                id="fechaProgramada"
                                                type="datetime-local"
                                                value={formData.fechaProgramada}
                                                onChange={(e) => handleInputChange('fechaProgramada', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="motivo">Motivo *</Label>
                                            <Input
                                                id="motivo"
                                                value={formData.motivo}
                                                onChange={(e) => handleInputChange('motivo', e.target.value)}
                                                placeholder="Motivo de la cita"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">
                                            {editingCita ? 'Actualizar' : 'Crear'} Cita
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
                                <TableHead>Cliente</TableHead>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Horario</TableHead>
                                <TableHead>Fecha Programada</TableHead>
                                <TableHead>Motivo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {citas.map((cita) => (
                                <TableRow key={cita.id}>
                                    <TableCell>{getClienteNombre(cita.cliente)}</TableCell>
                                    <TableCell>{getMascotaNombre(cita.mascota)}</TableCell>
                                    <TableCell>{getHorarioInfo(cita.horario)}</TableCell>
                                    <TableCell>{formatDateTime(cita.fechaProgramada)}</TableCell>
                                    <TableCell>{cita.motivo}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Programada
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(cita)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(cita.id)}
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

export default CitasPageWithForm;