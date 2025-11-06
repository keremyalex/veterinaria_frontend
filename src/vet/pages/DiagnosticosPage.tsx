import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_DIAGNOSTICOS } from '@/graphql/queries/diagnosticos.query';

export default function DiagnosticosPage() {
  const { data, loading, error } = useQuery(GET_DIAGNOSTICOS);

  if (loading) return <div className="p-6">Cargando diagnósticos...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const diagnosticos = (data as any)?.diagnosticos || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Diagnósticos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Diagnósticos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diagnosticos.map((diagnostico: any) => (
                <TableRow key={diagnostico.id}>
                  <TableCell>{diagnostico.descripcion}</TableCell>
                  <TableCell>{new Date(diagnostico.fechaDiagnostico).toLocaleDateString()}</TableCell>
                  <TableCell>{diagnostico.mascota?.nombre} ({diagnostico.mascota?.raza})</TableCell>
                  <TableCell>{diagnostico.mascota?.cliente?.nombre} {diagnostico.mascota?.cliente?.apellidos}</TableCell>
                  <TableCell>{diagnostico.observaciones || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}