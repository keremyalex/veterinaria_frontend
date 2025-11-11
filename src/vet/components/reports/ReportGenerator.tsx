import React, { useState } from 'react';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import type { 
  TipoReporte, 
  FormatoReporte, 
  FiltrosReporte,
  RespuestaGenerarReporte 
} from '../../interfaces/reports.interface';
import { opcionesReporte, opcionesFormato } from '../../data/mock-reports';

interface ReportGeneratorProps {
  tipoReporte: TipoReporte;
  onTipoReporteChange: (tipo: TipoReporte) => void;
  formato: FormatoReporte;
  onFormatoChange: (formato: FormatoReporte) => void;
  filtros: FiltrosReporte;
  onGenerar: (tipo: TipoReporte, formato: FormatoReporte, filtros: FiltrosReporte) => Promise<RespuestaGenerarReporte>;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  tipoReporte,
  onTipoReporteChange,
  formato,
  onFormatoChange,
  filtros,
  onGenerar
}) => {
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState<RespuestaGenerarReporte | null>(null);

  const opcionSeleccionada = opcionesReporte.find(op => op.value === tipoReporte);

  const handleGenerar = async () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      setResultado({
        exito: false,
        mensaje: "Por favor selecciona un rango de fechas válido"
      });
      return;
    }

    setGenerando(true);
    setResultado(null);

    try {
      const respuesta = await onGenerar(tipoReporte, formato, filtros);
      setResultado(respuesta);
    } catch (error) {
      setResultado({
        exito: false,
        mensaje: `Error al generar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setGenerando(false);
    }
  };

  const puedeGenerar = filtros.fechaInicio && filtros.fechaFin && !generando;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Generador de Reportes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selector de tipo de reporte */}
        <div className="space-y-2">
          <Label htmlFor="tipoReporte" className="text-sm font-medium">
            Tipo de Reporte
          </Label>
          <NativeSelect
            id="tipoReporte"
            value={tipoReporte}
            onChange={(e) => onTipoReporteChange(e.target.value as TipoReporte)}
            className="w-full"
          >
            {opcionesReporte.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.icono} {opcion.label}
              </option>
            ))}
          </NativeSelect>
          {opcionSeleccionada && (
            <p className="text-xs text-gray-600 mt-1">
              {opcionSeleccionada.descripcion}
            </p>
          )}
        </div>

        {/* Selector de formato */}
        <div className="space-y-2">
          <Label htmlFor="formato" className="text-sm font-medium">
            Formato de Exportación
          </Label>
          <NativeSelect
            id="formato"
            value={formato}
            onChange={(e) => onFormatoChange(e.target.value as FormatoReporte)}
            className="w-full"
          >
            {opcionesFormato.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.icono} {opcion.label} ({opcion.extension})
              </option>
            ))}
          </NativeSelect>
        </div>

        {/* Botón generar */}
        <Button 
          onClick={handleGenerar}
          disabled={!puedeGenerar}
          className="w-full"
          size="lg"
        >
          {generando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando Reporte...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte
            </>
          )}
        </Button>

        {/* Resultado de la generación */}
        {resultado && (
          <div className={`p-4 rounded-lg border ${
            resultado.exito 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start gap-2">
              {resultado.exito ? (
                <Download className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {resultado.exito ? 'Reporte Generado' : 'Error'}
                </p>
                <p className="text-xs mt-1">{resultado.mensaje}</p>
                
                {resultado.exito && resultado.urlDescarga && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    asChild
                  >
                    <a href={resultado.urlDescarga} download>
                      <Download className="w-4 h-4 mr-1" />
                      Descargar
                    </a>
                  </Button>
                )}

                {resultado.tiempoEstimado && (
                  <p className="text-xs mt-1">
                    Tiempo estimado: {resultado.tiempoEstimado} segundos
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border">
          <strong>💡 Consejo:</strong> Los reportes en formato PDF son ideales para presentaciones, 
          mientras que Excel y CSV son perfectos para análisis de datos.
        </div>
      </CardContent>
    </Card>
  );
};