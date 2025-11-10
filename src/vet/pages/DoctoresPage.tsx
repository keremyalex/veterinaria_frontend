import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { GET_DOCTORES } from '@/graphql/queries/clinic.queries';
import { CREAR_DOCTOR, ACTUALIZAR_DOCTOR, ELIMINAR_DOCTOR } from '@/graphql/mutations/clinic.mutations';
import type { Doctor, DoctorInput, DoctorUpdateInput } from '@/vet/interfaces/clinic.interface';

interface FormData {
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  email: string;
  fotourl: string;
}

const initialFormData: FormData = {
  nombre: '',
  apellido: '',
  ci: '',
  telefono: '',
  email: '',
  fotourl: ''
};

export default function DoctoresPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const { data: doctoresData, loading, error, refetch } = useQuery(GET_DOCTORES);
  const [crearDoctor] = useMutation(CREAR_DOCTOR);
  const [actualizarDoctor] = useMutation(ACTUALIZAR_DOCTOR);
  const [eliminarDoctor] = useMutation(ELIMINAR_DOCTOR);

  // Datos ordenados - versión más robusta
  const rawDoctores = (doctoresData as any)?.doctores || [];
  const doctores: Doctor[] = React.useMemo(() => {
    return [...rawDoctores]
      .sort((a: Doctor, b: Doctor) => {
        // Intentar primero como números
        const numA = Number(a.id);
        const numB = Number(b.id);
        
        // Si ambos son números válidos
        if (!isNaN(numA) && !isNaN(numB)) {
          return numB - numA; // Descendente
        }
        
        // Si no son números, comparar como strings
        return b.id.toString().localeCompare(a.id.toString(), undefined, { numeric: true });
      });
  }, [rawDoctores]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingDoctor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        const updateInput: DoctorUpdateInput = {
          id: parseInt(editingDoctor.id),
          nombre: formData.nombre,
          apellido: formData.apellido,
          ci: formData.ci,
          telefono: formData.telefono,
          email: formData.email,
          fotourl: formData.fotourl || undefined
        };

        await actualizarDoctor({
          variables: { input: updateInput }
        });
      } else {
        const doctorInput: DoctorInput = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          ci: formData.ci,
          telefono: formData.telefono,
          email: formData.email,
          fotourl: formData.fotourl || undefined
        };

        await crearDoctor({
          variables: { input: doctorInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar doctor:', error);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      nombre: doctor.nombre,
      apellido: doctor.apellido,
      ci: doctor.ci,
      telefono: doctor.telefono,
      email: doctor.email,
      fotourl: doctor.fotourl || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este doctor?')) {
      try {
        await eliminarDoctor({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar doctor:', error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Doctores</CardTitle>
          <CardDescription>
            Administra la información de los doctores de la clínica veterinaria
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDoctor ? 'Editar Doctor' : 'Agregar Nuevo Doctor'}
                </DialogTitle>
                <DialogDescription>
                  {editingDoctor ? 'Modifica' : 'Completa'} la información del doctor aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ci">Cédula de Identidad</Label>
                  <Input
                    id="ci"
                    value={formData.ci}
                    onChange={(e) => handleInputChange('ci', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fotourl">URL de Foto (opcional)</Label>
                  <Input
                    id="fotourl"
                    value={formData.fotourl}
                    onChange={(e) => handleInputChange('fotourl', e.target.value)}
                    placeholder="https://..."
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
                    {editingDoctor ? 'Actualizar' : 'Crear'} Doctor
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
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>CI</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctores.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.id}</TableCell>
                  <TableCell>{doctor.nombre}</TableCell>
                  <TableCell>{doctor.apellido}</TableCell>
                  <TableCell>{doctor.ci}</TableCell>
                  <TableCell>{doctor.telefono}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doctor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
}