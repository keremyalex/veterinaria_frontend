import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { GET_CLIENTES } from '@/graphql/queries/clinic.queries';
import { CREAR_CLIENTE, ACTUALIZAR_CLIENTE, ELIMINAR_CLIENTE } from '@/graphql/mutations/clinic.mutations';
import type { Cliente, ClienteInput, ClienteUpdateInput } from '@/vet/interfaces/clinic.interface';

interface FormData {
  ci: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fotourl?: string;
}

const initialFormData: FormData = {
  ci: '',
  nombre: '',
  apellido: '',
  telefono: '',
  fotourl: ''
};

export default function ClientesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  const { data: clientesData, loading, error, refetch } = useQuery(GET_CLIENTES);
  const [crearCliente] = useMutation(CREAR_CLIENTE);
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);
  const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE);

  // Datos ordenados por ID ascendente (más antiguos primero: 1, 2, 3...)
  const clientes: Cliente[] = [...((clientesData as any)?.clientes || [])]
    .sort((a: Cliente, b: Cliente) => {
      const idA = parseInt(a.id, 10);
      const idB = parseInt(b.id, 10);
      return idA - idB; // Menor a mayor (más antiguo primero)
    });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingCliente(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        const updateInput: ClienteUpdateInput = {
          id: parseInt(editingCliente.id),
          ci: formData.ci,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          fotourl: formData.fotourl
        };

        await actualizarCliente({
          variables: { input: updateInput }
        });
      } else {
        const clienteInput: ClienteInput = {
          ci: formData.ci,
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          fotourl: formData.fotourl
        };

        await crearCliente({
          variables: { input: clienteInput }
        });
      }

      refetch();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      ci: cliente.ci,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      fotourl: cliente.fotourl || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await eliminarCliente({
          variables: { id }
        });
        refetch();
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Clientes</CardTitle>
          <CardDescription>
            Administra los clientes de la clínica veterinaria
          </CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCliente ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
                </DialogTitle>
                <DialogDescription>
                  {editingCliente ? 'Modifica' : 'Completa'} la información del cliente aquí. Haz clic en guardar cuando termines.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ci">Cédula de Identidad</Label>
                  <Input
                    id="ci"
                    value={formData.ci}
                    onChange={(e) => handleInputChange('ci', e.target.value)}
                    placeholder="Número de identificación"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Apellido del cliente"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="Número de contacto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fotourl">URL Foto (Opcional)</Label>
                  <Input
                    id="fotourl"
                    value={formData.fotourl}
                    onChange={(e) => handleInputChange('fotourl', e.target.value)}
                    placeholder="URL de la imagen del cliente"
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
                    {editingCliente ? 'Actualizar' : 'Crear'} Cliente
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
                <TableHead>Cédula</TableHead>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.id}</TableCell>
                  <TableCell>{cliente.ci}</TableCell>
                  <TableCell>{cliente.nombre} {cliente.apellido}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cliente)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cliente.id)}
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