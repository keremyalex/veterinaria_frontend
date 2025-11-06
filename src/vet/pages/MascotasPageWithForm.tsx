import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { GET_MASCOTAS } from '@/graphql/queries/mascotas.query';
import { GET_CLIENTES } from '@/graphql/queries/clientes.query';
import { GET_ESPECIES } from '@/graphql/queries/especies.query';
import { CREATE_MASCOTA, UPDATE_MASCOTA, DELETE_MASCOTA } from '@/graphql/mutations/mascotas.mutation';
import { toast } from 'sonner';

export default function MascotasPageWithForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMascota, setEditingMascota] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    sexo: '',
    raza: '',
    fechaNacimiento: '',
    peso: '',
    clienteId: '',
    especieId: ''
  });

  const { data, loading, refetch } = useQuery(GET_MASCOTAS);
  const { data: clientesData } = useQuery(GET_CLIENTES);
  const { data: especiesData } = useQuery(GET_ESPECIES);
  
  const [createMascota] = useMutation(CREATE_MASCOTA);
  const [updateMascota] = useMutation(UPDATE_MASCOTA);
  const [deleteMascota] = useMutation(DELETE_MASCOTA);

  const mascotas = (data as any)?.mascotas || [];
  const clientes = (clientesData as any)?.clientes || [];
  const especies = (especiesData as any)?.especies || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const input = {
        ...formData,
        peso: formData.peso ? parseFloat(formData.peso) : undefined
      };

      if (editingMascota) {
        await updateMascota({
          variables: {
            input: {
              id: editingMascota.id,
              ...input
            }
          }
        });
        toast.success('Mascota actualizada correctamente');
      } else {
        await createMascota({
          variables: {
            input
          }
        });
        toast.success('Mascota creada correctamente');
      }
      
      setIsDialogOpen(false);
      setEditingMascota(null);
      resetForm();
      refetch();
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let errorMessage = editingMascota ? 'Error al actualizar la mascota' : 'Error al crear la mascota';
      if (error?.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error?.networkError) {
        errorMessage = `Error de red: ${error.networkError.message}`;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEdit = (mascota: any) => {
    setEditingMascota(mascota);
    setFormData({
      nombre: mascota.nombre,
      sexo: mascota.sexo,
      raza: mascota.raza,
      fechaNacimiento: mascota.fechaNacimiento,
      peso: mascota.peso?.toString() || '',
      clienteId: mascota.cliente.id,
      especieId: mascota.especie.id
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      try {
        await deleteMascota({
          variables: { id }
        });
        toast.success('Mascota eliminada correctamente');
        refetch();
      } catch (error: any) {
        console.error('Error:', error);
        let errorMessage = 'Error al eliminar la mascota';
        if (error?.graphQLErrors?.length > 0) {
          errorMessage = error.graphQLErrors[0].message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      sexo: '',
      raza: '',
      fechaNacimiento: '',
      peso: '',
      clienteId: '',
      especieId: ''
    });
    setEditingMascota(null);
  };

  if (loading) return <div className="p-6">Cargando mascotas...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mascotas</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Mascota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingMascota ? 'Editar Mascota' : 'Nueva Mascota'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <NativeSelect
                  id="sexo"
                  value={formData.sexo}
                  onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                  required
                >
                  <option value="">Seleccionar sexo</option>
                  <option value="M">Macho</option>
                  <option value="F">Hembra</option>
                </NativeSelect>
              </div>

              <div>
                <Label htmlFor="raza">Raza</Label>
                <Input
                  id="raza"
                  value={formData.raza}
                  onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="peso">Peso (kg) - Opcional</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="clienteId">Cliente</Label>
                <NativeSelect
                  id="clienteId"
                  value={formData.clienteId}
                  onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente: any) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellidos}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div>
                <Label htmlFor="especieId">Especie</Label>
                <NativeSelect
                  id="especieId"
                  value={formData.especieId}
                  onChange={(e) => setFormData({ ...formData, especieId: e.target.value })}
                  required
                >
                  <option value="">Seleccionar especie</option>
                  {especies.map((especie: any) => (
                    <option key={especie.id} value={especie.id}>
                      {especie.descripcion}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingMascota ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Mascotas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mascotas.map((mascota: any) => (
                <TableRow key={mascota.id}>
                  <TableCell className="font-medium">{mascota.nombre}</TableCell>
                  <TableCell>{mascota.raza}</TableCell>
                  <TableCell>{mascota.sexo === 'M' ? 'Macho' : 'Hembra'}</TableCell>
                  <TableCell>{mascota.peso ? `${mascota.peso} kg` : 'N/A'}</TableCell>
                  <TableCell>{mascota.cliente?.nombre} {mascota.cliente?.apellidos}</TableCell>
                  <TableCell>{mascota.especie?.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(mascota)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(mascota.id)}
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
}