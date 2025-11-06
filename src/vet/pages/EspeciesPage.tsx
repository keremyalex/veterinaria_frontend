import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GET_ESPECIES } from '@/graphql/queries/especies.query';
import { CREATE_ESPECIE } from '@/graphql/mutations/especies.mutation';
import { toast } from 'sonner';

export default function EspeciesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEspecie, setEditingEspecie] = useState<any>(null);
  const [formData, setFormData] = useState({
    descripcion: ''
  });

  const { data, loading, refetch } = useQuery(GET_ESPECIES);
  const [createEspecie] = useMutation(CREATE_ESPECIE);
  // UPDATE y DELETE mutations no están implementadas en el backend según el archivo GraphQL

  const especies = (data as any)?.especies || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEspecie) {
      toast.error('La funcionalidad de actualizar no está disponible. Necesita implementarse en el backend.');
      return;
    }
    
    try {
      console.log('Input para crear:', formData);
      const result = await createEspecie({
        variables: {
          input: formData
        }
      });
      console.log('Resultado de creación:', result);
      toast.success('Especie creada correctamente');
      
      setIsDialogOpen(false);
      setEditingEspecie(null);
      setFormData({ descripcion: '' });
      refetch();
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let errorMessage = 'Error al crear la especie';
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

  const handleEdit = (especie: any) => {
    setEditingEspecie(especie);
    setFormData({
      descripcion: especie.descripcion
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (_id: string) => {
    toast.error('La funcionalidad de eliminar no está disponible. Necesita implementarse en el backend.');
  };

  const resetForm = () => {
    setFormData({ descripcion: '' });
    setEditingEspecie(null);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Especies</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Especie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEspecie ? 'Editar Especie' : 'Nueva Especie'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                />
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
                  {editingEspecie ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Las funcionalidades de editar y eliminar están deshabilitadas porque las mutations UPDATE y DELETE 
          para especies no están implementadas en el backend GraphQL.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Especies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {especies.map((especie: any) => (
                <TableRow key={especie.id}>
                  <TableCell>{especie.id}</TableCell>
                  <TableCell>{especie.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        onClick={() => handleEdit(especie)}
                        title="Funcionalidad no disponible - necesita implementarse en el backend"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        onClick={() => handleDelete(especie.id)}
                        title="Funcionalidad no disponible - necesita implementarse en el backend"
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