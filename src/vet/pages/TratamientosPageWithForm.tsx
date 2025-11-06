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

import { GET_TRATAMIENTOS } from '@/graphql/queries/tratamientos.query';
import { GET_DIAGNOSTICOS } from '@/graphql/queries/diagnosticos.query';
import { CREATE_TRATAMIENTO, UPDATE_TRATAMIENTO, DELETE_TRATAMIENTO } from '@/graphql/mutations/tratamientos.mutation';
import type { Tratamiento, Diagnostico, TratamientoInput } from '@/vet/interfaces/veterinaria.interface';
import { formatDateTimeForBackend, formatDateTimeForInput } from '@/lib/date-utils';

interface FormData {
    diagnosticoId: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    instrucciones: string;
    estado: string;
}

const initialFormData: FormData = {
    diagnosticoId: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    instrucciones: '',
    estado: 'activo'
};

const TratamientosPageWithForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTratamiento, setEditingTratamiento] = useState<Tratamiento | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    
    // Queries
    const { data: tratamientosData, loading, refetch } = useQuery(GET_TRATAMIENTOS);
    const { data: diagnosticosData } = useQuery(GET_DIAGNOSTICOS);
    
    // Mutations
    const [createTratamiento] = useMutation(CREATE_TRATAMIENTO);
    const [updateTratamiento] = useMutation(UPDATE_TRATAMIENTO);
    const [deleteTratamiento] = useMutation(DELETE_TRATAMIENTO);

    const tratamientos: Tratamiento[] = (tratamientosData as any)?.tratamientos || [];
    const diagnosticos: Diagnostico[] = (diagnosticosData as any)?.diagnosticos || [];

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingTratamiento(null);
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.diagnosticoId || !formData.descripcion || !formData.fechaInicio) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const tratamientoInput: TratamientoInput = {
                diagnosticoId: formData.diagnosticoId,
                descripcion: formData.descripcion,
                fechaInicio: formatDateTimeForBackend(formData.fechaInicio),
                fechaFin: formData.fechaFin ? formatDateTimeForBackend(formData.fechaFin) : undefined,
                instrucciones: formData.instrucciones || undefined,
                estado: formData.estado
            };

            if (editingTratamiento) {
                await updateTratamiento({
                    variables: {
                        input: {
                            id: editingTratamiento.id,
                            ...tratamientoInput
                        }
                    }
                });
                toast.success('Tratamiento actualizado correctamente');
            } else {
                await createTratamiento({
                    variables: { input: tratamientoInput }
                });
                toast.success('Tratamiento creado correctamente');
            }
            
            refetch();
            resetForm();
        } catch (error: any) {
            console.error('Error al guardar tratamiento:', error);
            toast.error(error.message || 'Error al guardar el tratamiento');
        }
    };

    const handleEdit = (tratamiento: Tratamiento) => {
        setEditingTratamiento(tratamiento);
        setFormData({
            diagnosticoId: tratamiento.diagnostico.id,
            descripcion: tratamiento.descripcion,
            fechaInicio: formatDateTimeForInput(tratamiento.fechaInicio),
            fechaFin: tratamiento.fechaFin ? formatDateTimeForInput(tratamiento.fechaFin) : '',
            instrucciones: tratamiento.instrucciones || '',
            estado: tratamiento.estado
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tratamiento?')) {
            try {
                await deleteTratamiento({ variables: { id } });
                toast.success('Tratamiento eliminado correctamente');
                refetch();
            } catch (error: any) {
                console.error('Error al eliminar tratamiento:', error);
                toast.error(error.message || 'Error al eliminar el tratamiento');
            }
        }
    };

    const getDiagnosticoInfo = (diagnostico: Diagnostico) => {
        return `${diagnostico.descripcion} - ${diagnostico.mascota.nombre} (${diagnostico.mascota.cliente.nombre})`;
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

    if (loading) return <div>Cargando tratamientos...</div>;

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gestión de Tratamientos</CardTitle>
                            <CardDescription>
                                Administra los tratamientos médicos basados en diagnósticos
                            </CardDescription>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Tratamiento
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingTratamiento ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingTratamiento ? 'Modifica los detalles del tratamiento' : 'Crea un nuevo tratamiento basado en un diagnóstico'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="diagnosticoId">Diagnóstico *</Label>
                                            <NativeSelect
                                                id="diagnosticoId"
                                                value={formData.diagnosticoId}
                                                onChange={(e) => handleInputChange('diagnosticoId', e.target.value)}
                                            >
                                                <option value="">Selecciona un diagnóstico</option>
                                                {diagnosticos.map(diagnostico => (
                                                    <option key={diagnostico.id} value={diagnostico.id}>
                                                        {getDiagnosticoInfo(diagnostico)}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="descripcion">Descripción del Tratamiento *</Label>
                                            <Input
                                                id="descripcion"
                                                value={formData.descripcion}
                                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                                placeholder="Descripción del tratamiento"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fechaInicio">Fecha y Hora de Inicio *</Label>
                                                <Input
                                                    id="fechaInicio"
                                                    type="datetime-local"
                                                    value={formData.fechaInicio}
                                                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fechaFin">Fecha y Hora de Fin</Label>
                                                <Input
                                                    id="fechaFin"
                                                    type="datetime-local"
                                                    value={formData.fechaFin}
                                                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="instrucciones">Instrucciones</Label>
                                            <textarea
                                                id="instrucciones"
                                                value={formData.instrucciones}
                                                onChange={(e) => handleInputChange('instrucciones', e.target.value)}
                                                placeholder="Instrucciones para el tratamiento"
                                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="estado">Estado</Label>
                                            <NativeSelect
                                                id="estado"
                                                value={formData.estado}
                                                onChange={(e) => handleInputChange('estado', e.target.value)}
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="completado">Completado</option>
                                                <option value="suspendido">Suspendido</option>
                                                <option value="cancelado">Cancelado</option>
                                            </NativeSelect>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">
                                            {editingTratamiento ? 'Actualizar' : 'Crear'} Tratamiento
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
                                <TableHead>Diagnóstico</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Fecha Inicio</TableHead>
                                <TableHead>Fecha Fin</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tratamientos.map((tratamiento) => (
                                <TableRow key={tratamiento.id}>
                                    <TableCell>
                                        {tratamiento.diagnostico.mascota.nombre}
                                    </TableCell>
                                    <TableCell>
                                        {tratamiento.diagnostico.descripcion}
                                    </TableCell>
                                    <TableCell>{tratamiento.descripcion}</TableCell>
                                    <TableCell>
                                        {formatDateTime(tratamiento.fechaInicio)}
                                    </TableCell>
                                    <TableCell>
                                        {tratamiento.fechaFin ? formatDateTime(tratamiento.fechaFin) : 'En curso'}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            tratamiento.estado === 'completado' ? 'bg-green-100 text-green-800' :
                                            tratamiento.estado === 'activo' ? 'bg-blue-100 text-blue-800' :
                                            tratamiento.estado === 'suspendido' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {tratamiento.estado}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(tratamiento)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(tratamiento.id)}
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

export default TratamientosPageWithForm;