import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_APLICACIONES_VACUNA } from '@/graphql/queries/vacunas.query';

export default function AplicacionesVacunaPage() {
  const { data, loading, error } = useQuery(GET_APLICACIONES_VACUNA);

  if (loading) return <div className="p-6">Cargando aplicaciones de vacunas...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const aplicaciones = (data as any)?.mascotaVacunas || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aplicaciones de Vacunas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Aplicaciones de Vacunas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vacuna</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha Aplicación</TableHead>
                <TableHead>Próxima Dosis</TableHead>
                <TableHead>Veterinario</TableHead>
                <TableHead>Lote</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aplicaciones.map((aplicacion: any) => (
                <TableRow key={aplicacion.id}>
                  <TableCell className="font-medium">{aplicacion.vacuna?.nombre}</TableCell>
                  <TableCell>{aplicacion.mascota?.nombre} ({aplicacion.mascota?.raza})</TableCell>
                  <TableCell>{aplicacion.mascota?.cliente?.nombre} {aplicacion.mascota?.cliente?.apellidos}</TableCell>
                  <TableCell>{new Date(aplicacion.fechaAplicacion).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(aplicacion.fechaProximaDosis).toLocaleDateString()}</TableCell>
                  <TableCell>{aplicacion.veterinario}</TableCell>
                  <TableCell>{aplicacion.lote}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}