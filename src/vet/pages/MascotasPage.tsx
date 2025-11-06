import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_MASCOTAS } from '@/graphql/queries/mascotas.query';

export default function MascotasPage() {
  const { data, loading, error } = useQuery(GET_MASCOTAS);

  if (loading) return <div className="p-6">Cargando mascotas...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const mascotas = (data as any)?.mascotas || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mascotas</h1>
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
                <TableHead>Fecha Nacimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mascotas.map((mascota: any) => (
                <TableRow key={mascota.id}>
                  <TableCell>{mascota.nombre}</TableCell>
                  <TableCell>{mascota.raza}</TableCell>
                  <TableCell>{mascota.sexo}</TableCell>
                  <TableCell>{mascota.peso ? `${mascota.peso} kg` : 'N/A'}</TableCell>
                  <TableCell>{mascota.cliente?.nombre} {mascota.cliente?.apellidos}</TableCell>
                  <TableCell>{mascota.especie?.descripcion}</TableCell>
                  <TableCell>{new Date(mascota.fechaNacimiento).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}