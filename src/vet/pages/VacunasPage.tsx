import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_VACUNAS } from '@/graphql/queries/vacunas.query';

export default function VacunasPage() {
  const { data, loading, error } = useQuery(GET_VACUNAS);

  if (loading) return <div className="p-6">Cargando vacunas...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const vacunas = (data as any)?.vacunas || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vacunas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Vacunas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Laboratorio</TableHead>
                <TableHead>Duración (meses)</TableHead>
                <TableHead>Edad Mínima (días)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacunas.map((vacuna: any) => (
                <TableRow key={vacuna.id}>
                  <TableCell className="font-medium">{vacuna.nombre}</TableCell>
                  <TableCell>{vacuna.descripcion}</TableCell>
                  <TableCell>{vacuna.laboratorio}</TableCell>
                  <TableCell>{vacuna.duracionMeses}</TableCell>
                  <TableCell>{vacuna.edadMinimaDias}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}