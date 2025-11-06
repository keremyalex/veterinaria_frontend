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

import { GET_DIAGNOSTICOS } from '@/graphql/queries/diagnosticos.query';
import { GET_MASCOTAS } from '@/graphql/queries/mascotas.query';
import { CREATE_DIAGNOSTICO, UPDATE_DIAGNOSTICO, DELETE_DIAGNOSTICO } from '@/graphql/mutations/diagnosticos.mutation';
import type { Diagnostico, Mascota, DiagnosticoInput } from '@/vet/interfaces/veterinaria.interface';

interface FormData {
    mascotaId: string;
    descripcion: string;
    observaciones: string;
}

const initialFormData: FormData = {
    mascotaId: '',
    descripcion: '',
    observaciones: ''
};

const DiagnosticosPageWithForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingDiagnostico, setEditingDiagnostico] = useState<Diagnostico | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    
    // Queries
    const { data: diagnosticosData, loading, refetch } = useQuery(GET_DIAGNOSTICOS);
    const { data: mascotasData } = useQuery(GET_MASCOTAS);
    
    // Mutations
    const [createDiagnostico] = useMutation(CREATE_DIAGNOSTICO);
    const [updateDiagnostico] = useMutation(UPDATE_DIAGNOSTICO);
    const [deleteDiagnostico] = useMutation(DELETE_DIAGNOSTICO);

    const diagnosticos: Diagnostico[] = (diagnosticosData as any)?.diagnosticos || [];
    const mascotas: Mascota[] = (mascotasData as any)?.mascotas || [];

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingDiagnostico(null);
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.mascotaId || !formData.descripcion) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const diagnosticoInput: DiagnosticoInput = {
                mascotaId: formData.mascotaId,
                descripcion: formData.descripcion,
                observaciones: formData.observaciones
            };

            if (editingDiagnostico) {
                await updateDiagnostico({
                    variables: {
                        input: {
                            id: editingDiagnostico.id,
                            ...diagnosticoInput
                        }
                    }
                });
                toast.success('Diagnóstico actualizado correctamente');
            } else {
                await createDiagnostico({
                    variables: { input: diagnosticoInput }
                });
                toast.success('Diagnóstico creado correctamente');
            }
            
            refetch();
            resetForm();
        } catch (error: any) {
            console.error('Error al guardar diagnóstico:', error);
            toast.error(error.message || 'Error al guardar el diagnóstico');
        }
    };

    const handleEdit = (diagnostico: Diagnostico) => {
        setEditingDiagnostico(diagnostico);
        setFormData({
            mascotaId: diagnostico.mascota.id,
            descripcion: diagnostico.descripcion,
            observaciones: diagnostico.observaciones || ''
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este diagnóstico?')) {
            try {
                await deleteDiagnostico({ variables: { id } });
                toast.success('Diagnóstico eliminado correctamente');
                refetch();
            } catch (error: any) {
                console.error('Error al eliminar diagnóstico:', error);
                toast.error(error.message || 'Error al eliminar el diagnóstico');
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

    if (loading) return <div>Cargando diagnósticos...</div>;

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gestión de Diagnósticos</CardTitle>
                            <CardDescription>
                                Administra los diagnósticos de las mascotas
                            </CardDescription>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Diagnóstico
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingDiagnostico ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingDiagnostico ? 'Modifica los detalles del diagnóstico' : 'Crea un nuevo diagnóstico para una mascota'}
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
                                            <Label htmlFor="descripcion">Descripción *</Label>
                                            <Input
                                                id="descripcion"
                                                value={formData.descripcion}
                                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                                placeholder="Descripción del diagnóstico"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="observaciones">Observaciones</Label>
                                            <textarea
                                                id="observaciones"
                                                value={formData.observaciones}
                                                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                                placeholder="Observaciones adicionales"
                                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">
                                            {editingDiagnostico ? 'Actualizar' : 'Crear'} Diagnóstico
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
                                <TableHead>Descripción</TableHead>
                                <TableHead>Fecha Diagnóstico</TableHead>
                                <TableHead>Observaciones</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {diagnosticos.map((diagnostico) => (
                                <TableRow key={diagnostico.id}>
                                    <TableCell>{diagnostico.mascota.nombre}</TableCell>
                                    <TableCell>
                                        {diagnostico.mascota.cliente.nombre} {diagnostico.mascota.cliente.apellidos}
                                    </TableCell>
                                    <TableCell>{diagnostico.descripcion}</TableCell>
                                    <TableCell>
                                        {formatDateTime(diagnostico.fechaDiagnostico)}
                                    </TableCell>
                                    <TableCell>
                                        {diagnostico.observaciones || 'Sin observaciones'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(diagnostico)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(diagnostico.id)}
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

export default DiagnosticosPageWithForm;