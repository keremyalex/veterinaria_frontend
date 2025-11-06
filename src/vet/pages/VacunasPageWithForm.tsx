import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

import { GET_VACUNAS } from '@/graphql/queries/vacunas.query';
import { CREATE_VACUNA, UPDATE_VACUNA, DELETE_VACUNA } from '@/graphql/mutations/vacunas.mutation';
import type { Vacuna, VacunaInput } from '@/vet/interfaces/veterinaria.interface';

interface FormData {
    nombre: string;
    descripcion: string;
    duracionMeses: string;
    laboratorio: string;
    edadMinimaDias: string;
}

const initialFormData: FormData = {
    nombre: '',
    descripcion: '',
    duracionMeses: '',
    laboratorio: '',
    edadMinimaDias: ''
};

const VacunasPageWithForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingVacuna, setEditingVacuna] = useState<Vacuna | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    
    // Queries
    const { data: vacunasData, loading, refetch } = useQuery(GET_VACUNAS);
    
    // Mutations
    const [createVacuna] = useMutation(CREATE_VACUNA);
    const [updateVacuna] = useMutation(UPDATE_VACUNA);
    const [deleteVacuna] = useMutation(DELETE_VACUNA);

    const vacunas: Vacuna[] = (vacunasData as any)?.vacunas || [];

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingVacuna(null);
        setIsOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.descripcion || !formData.laboratorio) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            const vacunaInput: VacunaInput = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                duracionMeses: formData.duracionMeses ? parseInt(formData.duracionMeses) : undefined,
                laboratorio: formData.laboratorio,
                edadMinimaDias: formData.edadMinimaDias ? parseInt(formData.edadMinimaDias) : undefined
            };

            if (editingVacuna) {
                await updateVacuna({
                    variables: {
                        input: {
                            id: editingVacuna.id,
                            ...vacunaInput
                        }
                    }
                });
                toast.success('Vacuna actualizada correctamente');
            } else {
                await createVacuna({
                    variables: { input: vacunaInput }
                });
                toast.success('Vacuna creada correctamente');
            }
            
            refetch();
            resetForm();
        } catch (error: any) {
            console.error('Error al guardar vacuna:', error);
            toast.error(error.message || 'Error al guardar la vacuna');
        }
    };

    const handleEdit = (vacuna: Vacuna) => {
        setEditingVacuna(vacuna);
        setFormData({
            nombre: vacuna.nombre,
            descripcion: vacuna.descripcion,
            duracionMeses: vacuna.duracionMeses?.toString() || '',
            laboratorio: vacuna.laboratorio,
            edadMinimaDias: vacuna.edadMinimaDias?.toString() || ''
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta vacuna?')) {
            try {
                await deleteVacuna({ variables: { id } });
                toast.success('Vacuna eliminada correctamente');
                refetch();
            } catch (error: any) {
                console.error('Error al eliminar vacuna:', error);
                toast.error(error.message || 'Error al eliminar la vacuna');
            }
        }
    };

    if (loading) return <div>Cargando vacunas...</div>;

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gestión de Vacunas</CardTitle>
                            <CardDescription>
                                Administra el catálogo de vacunas disponibles
                            </CardDescription>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => resetForm()}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Vacuna
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingVacuna ? 'Editar Vacuna' : 'Nueva Vacuna'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {editingVacuna ? 'Modifica los detalles de la vacuna' : 'Agrega una nueva vacuna al catálogo'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">Nombre *</Label>
                                            <Input
                                                id="nombre"
                                                value={formData.nombre}
                                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                                placeholder="Nombre de la vacuna"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="descripcion">Descripción *</Label>
                                            <textarea
                                                id="descripcion"
                                                value={formData.descripcion}
                                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                                placeholder="Descripción de la vacuna"
                                                required
                                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="laboratorio">Laboratorio *</Label>
                                            <Input
                                                id="laboratorio"
                                                value={formData.laboratorio}
                                                onChange={(e) => handleInputChange('laboratorio', e.target.value)}
                                                placeholder="Laboratorio fabricante"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="duracionMeses">Duración (meses)</Label>
                                                <Input
                                                    id="duracionMeses"
                                                    type="number"
                                                    min="0"
                                                    value={formData.duracionMeses}
                                                    onChange={(e) => handleInputChange('duracionMeses', e.target.value)}
                                                    placeholder="12"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="edadMinimaDias">Edad mínima (días)</Label>
                                                <Input
                                                    id="edadMinimaDias"
                                                    type="number"
                                                    min="0"
                                                    value={formData.edadMinimaDias}
                                                    onChange={(e) => handleInputChange('edadMinimaDias', e.target.value)}
                                                    placeholder="42"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={resetForm}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">
                                            {editingVacuna ? 'Actualizar' : 'Crear'} Vacuna
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
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Laboratorio</TableHead>
                                <TableHead>Duración</TableHead>
                                <TableHead>Edad Mínima</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vacunas.map((vacuna) => (
                                <TableRow key={vacuna.id}>
                                    <TableCell className="font-medium">{vacuna.nombre}</TableCell>
                                    <TableCell>{vacuna.descripcion}</TableCell>
                                    <TableCell>{vacuna.laboratorio}</TableCell>
                                    <TableCell>
                                        {vacuna.duracionMeses ? `${vacuna.duracionMeses} meses` : 'No especificada'}
                                    </TableCell>
                                    <TableCell>
                                        {vacuna.edadMinimaDias ? `${vacuna.edadMinimaDias} días` : 'No especificada'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(vacuna)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(vacuna.id)}
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

export default VacunasPageWithForm;