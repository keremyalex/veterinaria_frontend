import { useQuery } from '@apollo/client/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_TRATAMIENTOS } from '@/graphql/queries/tratamientos.query';

export default function TratamientosPage() {
  const { data, loading, error } = useQuery(GET_TRATAMIENTOS);

  if (loading) return <div className="p-6">Cargando tratamientos...</div>;
  if (error) return <div className="p-6">Error: {error.message}</div>;

  const tratamientos = (data as any)?.tratamientos || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tratamientos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tratamientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Mascota</TableHead>
                <TableHead>Instrucciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tratamientos.map((tratamiento: any) => (
                <TableRow key={tratamiento.id}>
                  <TableCell>{tratamiento.descripcion}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      tratamiento.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tratamiento.estado}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(tratamiento.fechaInicio).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(tratamiento.fechaFin).toLocaleDateString()}</TableCell>
                  <TableCell>{tratamiento.diagnostico?.mascota?.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate">{tratamiento.instrucciones}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}