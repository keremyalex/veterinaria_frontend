import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect } from '@/components/ui/native-select';
import { Trash2, Edit, Plus } from 'lucide-react';
import { GET_MASCOTAS, GET_CLIENTES, GET_ESPECIES } from '@/graphql/queries/clinic.queries';
import { CREAR_MASCOTA, ACTUALIZAR_MASCOTA, ELIMINAR_MASCOTA } from '@/graphql/mutations/clinic.mutations';
import type { Mascota, MascotaInput, MascotaUpdateInput, Cliente, Especie } from '@/vet/interfaces/clinic.interface';

interface FormData {
  nombre: string;
  fechanacimiento: string;
  raza: string;
  sexo: string;
  fotourl?: string;
  clienteId: string;
  especieId: string;
}

const initialFormData: FormData = {
  nombre: '',
  fechanacimiento: '',
  raza: '',
  sexo: '',
  fotourl: '',
  clienteId: '',
  especieId: ''
};

export default function MascotasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null);

  // Queries
  const { data: mascotasData, loading, error, refetch } = useQuery(GET_MASCOTAS);
  const { data: clientesData } = useQuery(GET_CLIENTES);
  const { data: especiesData } = useQuery(GET_ESPECIES);

  // Mutations
  const [crearMascota] = useMutation(CREAR_MASCOTA);
  const [actualizarMascota] = useMutation(ACTUALIZAR_MASCOTA);
  const [eliminarMascota] = useMutation(ELIMINAR_MASCOTA);

  // Datos ordenados por ID ascendente (más antiguos primero: 1, 2, 3...)
  const mascotas: Mascota[] = [...((mascotasData as any)?.mascotas || [])]
    .sort((a: Mascota, b: Mascota) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });
  
  const clientes: Cliente[] = (clientesData as any)?.clientes || [];
  const especies: Especie[] = (especiesData as any)?.especies || [];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingMascota(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMascota) {
        const updateInput: MascotaUpdateInput = {
          id: parseInt(editingMascota.id),
          nombre: formData.nombre,
          fechanacimiento: formData.fechanacimiento,
          raza: formData.raza,
          sexo: formData.sexo,
          fotourl: formData.fotourl,
          clienteId: parseInt(formData.clienteId),
          especieId: parseInt(formData.especieId)
        };

        await actualizarMascota({
          variables: { input: updateInput }
        });
      } else {
        const mascotaInput: MascotaInput = {
          nombre: formData.nombre,
          fechanacimiento: formData.fechanacimiento,
          raza: formData.raza,
          sexo: formData.sexo,
          fotourl: formData.fotourl,
          clienteId: parseInt(formData.clienteId),
          especieId: parseInt(formData.especieId)
        };

        await crearMascota({
          variables: { input: mascotaInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar mascota:', error);
    }
  };

  const handleEdit = (mascota: Mascota) => {
    setEditingMascota(mascota);
    setFormData({
      nombre: mascota.nombre,
      fechanacimiento: mascota.fechanacimiento,
      raza: mascota.raza,
      sexo: mascota.sexo,
      fotourl: mascota.fotourl || '',
      clienteId: mascota.cliente.id,
      especieId: mascota.especie.id
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      try {
        await eliminarMascota({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar mascota:', error);
      }
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMs = today.getTime() - birth.getTime();
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365));
    return ageInYears;
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Mascotas</CardTitle>
          <CardDescription>
            Administra las mascotas registradas en la clínica veterinaria
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Mascota
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingMascota ? 'Editar Mascota' : 'Agregar Nueva Mascota'}
                </DialogTitle>
                <DialogDescription>
                  {editingMascota ? 'Modifica' : 'Completa'} la información de la mascota aquí. Haz clic en guardar cuando termines.
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
                      placeholder="Nombre de la mascota"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fechanacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="fechanacimiento"
                      type="date"
                      value={formData.fechanacimiento}
                      onChange={(e) => handleInputChange('fechanacimiento', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="raza">Raza</Label>
                    <Input
                      id="raza"
                      value={formData.raza}
                      onChange={(e) => handleInputChange('raza', e.target.value)}
                      placeholder="Raza de la mascota"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sexo">Sexo</Label>
                    <NativeSelect
                      value={formData.sexo}
                      onChange={(e) => handleInputChange('sexo', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar sexo</option>
                      <option value="M">Macho</option>
                      <option value="F">Hembra</option>
                    </NativeSelect>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clienteId">Cliente Propietario</Label>
                  <NativeSelect
                    value={formData.clienteId}
                    onChange={(e) => handleInputChange('clienteId', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido} - CI: {cliente.ci}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especieId">Especie</Label>
                  <NativeSelect
                    value={formData.especieId}
                    onChange={(e) => handleInputChange('especieId', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar especie</option>
                    {especies.map((especie) => (
                      <option key={especie.id} value={especie.id}>
                        {especie.descripcion}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fotourl">URL Foto (Opcional)</Label>
                  <Input
                    id="fotourl"
                    value={formData.fotourl}
                    onChange={(e) => handleInputChange('fotourl', e.target.value)}
                    placeholder="URL de la imagen de la mascota"
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
                    {editingMascota ? 'Actualizar' : 'Crear'} Mascota
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
                <TableHead>Especie</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mascotas.map((mascota) => (
                <TableRow key={mascota.id}>
                  <TableCell className="font-medium">{mascota.id}</TableCell>
                  <TableCell>{mascota.nombre}</TableCell>
                  <TableCell>{mascota.especie.descripcion}</TableCell>
                  <TableCell>{mascota.raza}</TableCell>
                  <TableCell>{mascota.sexo === 'M' ? 'Macho' : 'Hembra'}</TableCell>
                  <TableCell>{calculateAge(mascota.fechanacimiento)} años</TableCell>
                  <TableCell>{mascota.cliente.nombre} {mascota.cliente.apellido}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(mascota)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(mascota.id)}
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