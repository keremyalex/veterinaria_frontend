import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_CITAS } from '@/graphql/queries/citas.query';

export default function CitasPage() {
  const { data, loading, error } = useQuery(GET_CITAS);

  if (loading) return <div className="p-6">Cargando citas...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const citas = (data as any)?.citas || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Citas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motivo</TableHead>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Horario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citas.map((cita: any) => (
                <TableRow key={cita.id}>
                  <TableCell>{cita.motivo}</TableCell>
                  <TableCell>{new Date(cita.fechaProgramada).toLocaleString()}</TableCell>
                  <TableCell>{cita.cliente?.nombre} {cita.cliente?.apellidos}</TableCell>
                  <TableCell>{cita.mascota?.nombre} ({cita.mascota?.raza})</TableCell>
                  <TableCell>{cita.horario?.dia} {cita.horario?.horaInicio}-{cita.horario?.horaFin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}