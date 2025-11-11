import React from 'react';
import { History, Download, Trash2, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EstadoReporte, TipoReporte } from '../../interfaces/reports.interface';

interface ReportHistoryProps {
  reportes: EstadoReporte[];
  onDescargar: (reporte: EstadoReporte) => void;
  onEliminar: (reporteId: string) => void;
  cargando?: boolean;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reportes,
  onDescargar,
  onEliminar,
  cargando = false
}) => {

  const getEstadoIcon = (estado: EstadoReporte['estado']) => {
    switch (estado) {
      case 'COMPLETADO':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'GENERANDO':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'CANCELADO':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: EstadoReporte['estado']) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'GENERANDO':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ERROR':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'CANCELADO':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTipoReporteLabel = (tipo: TipoReporte) => {
    const labels = {
      'FINANCIERO': '💰 Financiero',
      'CLINICO': '🏥 Clínico',
      'OPERACIONAL': '⚙️ Operacional',
      'INVENTARIO': '📦 Inventario',
      'MARKETING': '📈 Marketing'
    };
    return labels[tipo];
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (cargando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-gray-500">Cargando historial...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historial de Reportes
          <span className="text-sm font-normal text-gray-500">
            ({reportes.length} reportes)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reportes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No hay reportes generados</p>
            <p className="text-sm">Los reportes que generes aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reportes.map((reporte) => (
              <div
                key={reporte.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {getTipoReporteLabel(reporte.tipo)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getEstadoColor(reporte.estado)}`}>
                      <span className="flex items-center gap-1">
                        {getEstadoIcon(reporte.estado)}
                        {reporte.estado}
                      </span>
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>ID: {reporte.id}</div>
                    <div>Creado: {formatearFecha(reporte.fechaCreacion)}</div>
                    {reporte.fechaCompletado && (
                      <div>Completado: {formatearFecha(reporte.fechaCompletado)}</div>
                    )}
                    {reporte.error && (
                      <div className="text-red-600">Error: {reporte.error}</div>
                    )}
                  </div>

                  {reporte.estado === 'GENERANDO' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${reporte.progreso}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {reporte.progreso}% completado
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {reporte.estado === 'COMPLETADO' && reporte.urlDescarga && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDescargar(reporte)}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEliminar(reporte.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {reportes.length > 0 && (
          <div className="mt-4 pt-4 border-t text-xs text-gray-500 text-center">
            Los reportes se almacenan por 30 días después de su generación
          </div>
        )}
      </CardContent>
    </Card>
  );
};