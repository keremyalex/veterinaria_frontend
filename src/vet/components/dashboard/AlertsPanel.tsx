import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import type { AlertaVacunacion } from "@/vet/interfaces/kpi.interface";

interface AlertsPanelProps {
  alertas: AlertaVacunacion[];
}

export const AlertsPanel = ({ alertas }: AlertsPanelProps) => {
  const getPriorityIcon = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'media':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityBadge = (prioridad: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'media':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  const urgentes = alertas.filter(a => a.prioridad.toLowerCase() === 'alta');
  const proximas = alertas.filter(a => a.prioridad.toLowerCase() === 'media');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alertas de Vacunación</CardTitle>
        <CardDescription>
          {urgentes.length} urgentes, {proximas.length} próximas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertas.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">
                ¡Todo al día!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                No hay alertas de vacunación pendientes
              </p>
            </div>
          ) : (
            alertas.slice(0, 5).map((alerta, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  {getPriorityIcon(alerta.prioridad)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {alerta.mascotaNombre} ({alerta.clienteNombre})
                  </p>
                  <p className="text-sm text-gray-500">
                    {alerta.tipoVacuna} - Vence en {alerta.diasVencimiento} días
                  </p>
                  <div className="mt-2">
                    <span className={getPriorityBadge(alerta.prioridad)}>
                      {alerta.prioridad}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {alertas.length > 5 && (
            <div className="text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                Ver {alertas.length - 5} alertas más...
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};