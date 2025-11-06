import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_HORARIOS } from '@/graphql/queries/horarios.query';

export default function HorariosPage() {
  const { data, loading, error } = useQuery(GET_HORARIOS);

  if (loading) return <div className="p-6">Cargando horarios...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const horarios = (data as any)?.horarios || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Horarios</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Horarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Día</TableHead>
                <TableHead>Hora Inicio</TableHead>
                <TableHead>Hora Fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.map((horario: any) => (
                <TableRow key={horario.id}>
                  <TableCell>{horario.id}</TableCell>
                  <TableCell>{horario.dia}</TableCell>
                  <TableCell>{horario.horaInicio}</TableCell>
                  <TableCell>{horario.horaFin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}