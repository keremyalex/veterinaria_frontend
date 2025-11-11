import React from 'react';
import { Eye, TrendingUp, TrendingDown, DollarSign, Activity, Users, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { 
  ReporteFinanciero, 
  ReporteClinico, 
  ReporteOperacional, 
  ReporteInventario,
  TipoReporte 
} from '../../interfaces/reports.interface';

interface ReportPreviewProps {
  tipoReporte: TipoReporte;
  datos?: ReporteFinanciero | ReporteClinico | ReporteOperacional | ReporteInventario;
  cargando?: boolean;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  tipoReporte,
  datos,
  cargando = false
}) => {

  const renderFinanciero = (reporte: ReporteFinanciero) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-800">
            ${(reporte.totalIngresos || 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-600">Ingresos Totales</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-800">
            ${(reporte.gananciaNeta || 0).toLocaleString()}
          </p>
          <p className="text-sm text-blue-600">Ganancia Neta</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-purple-800">
            {reporte.margenGanancia ? reporte.margenGanancia.toFixed(1) : '0.0'}%
          </p>
          <p className="text-sm text-purple-600">Margen</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          {(reporte.comparacionPeriodoAnterior || 0) >= 0 ? (
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          ) : (
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-600" />
          )}
          <p className="text-2xl font-bold text-orange-800">
            {(reporte.comparacionPeriodoAnterior || 0) >= 0 ? '+' : ''}
            {reporte.comparacionPeriodoAnterior ? reporte.comparacionPeriodoAnterior.toFixed(1) : '0.0'}%
          </p>
          <p className="text-sm text-orange-600">vs Período Anterior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Desglose de Ingresos</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Consultas:</span>
              <span className="font-medium">${(reporte.ingresosConsultas || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Vacunas:</span>
              <span className="font-medium">${(reporte.ingresosVacunas || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Medicamentos:</span>
              <span className="font-medium">${(reporte.ingresosMedicamentos || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Cirugía:</span>
              <span className="font-medium">${(reporte.ingresosCirugia || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Costos y Rentabilidad</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Costos Operativos:</span>
              <span className="font-medium text-red-600">${(reporte.costosOperativos || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="font-medium">Ganancia Neta:</span>
              <span className="font-bold text-green-600">${(reporte.gananciaNeta || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClinico = (reporte: ReporteClinico) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-800">{reporte.totalConsultas || 0}</p>
          <p className="text-sm text-blue-600">Total Consultas</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-800">{reporte.vacunasAplicadas || 0}</p>
          <p className="text-sm text-green-600">Vacunas Aplicadas</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-purple-800">{reporte.cirugiasRealizadas || 0}</p>
          <p className="text-sm text-purple-600">Cirugías</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <p className="text-2xl font-bold text-orange-800">
            {reporte.tasaSeguimiento ? reporte.tasaSeguimiento.toFixed(1) : '0.0'}%
          </p>
          <p className="text-sm text-orange-600">Tasa Seguimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Diagnósticos Frecuentes</h4>
          <div className="space-y-1 text-sm">
            {(reporte.diagnosticosFrecuentes || []).slice(0, 5).map((diagnostico, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-200 text-blue-800 text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span>{diagnostico}</span>
              </div>
            ))}
            {(!reporte.diagnosticosFrecuentes || reporte.diagnosticosFrecuentes.length === 0) && (
              <p className="text-gray-500 text-xs">No hay datos disponibles</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Tipos de Consulta</h4>
          <div className="space-y-1 text-sm">
            {(reporte.consultasPorTipo || []).slice(0, 4).map((tipo, index) => (
              <div key={index} className="flex justify-between">
                <span>{tipo.split(':')[0]}:</span>
                <span className="font-medium">{tipo.split(':')[1]?.trim()}</span>
              </div>
            ))}
            {(!reporte.consultasPorTipo || reporte.consultasPorTipo.length === 0) && (
              <p className="text-gray-500 text-xs">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperacional = (reporte: ReporteOperacional) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-800">
            {reporte.ocupacionConsultorios ? reporte.ocupacionConsultorios.toFixed(1) : '0.0'}%
          </p>
          <p className="text-sm text-green-600">Ocupación</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-800">
            {reporte.eficienciaPersonal ? reporte.eficienciaPersonal.toFixed(1) : '0.0'}%
          </p>
          <p className="text-sm text-blue-600">Eficiencia</p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
          <p className="text-2xl font-bold text-orange-800">
            {reporte.tiempoEsperaPromedio ? reporte.tiempoEsperaPromedio.toFixed(1) : '0.0'} min
          </p>
          <p className="text-sm text-orange-600">Tiempo Espera</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold text-red-800">
            {reporte.tasaCancelacion ? reporte.tasaCancelacion.toFixed(1) : '0.0'}%
          </p>
          <p className="text-sm text-red-600">Cancelaciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Métricas Operacionales</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Utilización Equipos:</span>
              <span className="font-medium">
                {reporte.utilizacionEquipos ? reporte.utilizacionEquipos.toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cancelaciones:</span>
              <span className="font-medium">{reporte.cancelaciones || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Reprogramaciones:</span>
              <span className="font-medium">{reporte.reprogramaciones || 0}</span>
            </div>
            {reporte.satisfaccionCliente && (
              <div className="flex justify-between">
                <span>Satisfacción Cliente:</span>
                <span className="font-medium">{reporte.satisfaccionCliente.toFixed(1)}/5.0</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventario = (reporte: ReporteInventario) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-800">
            {reporte.rotacionInventario ? reporte.rotacionInventario.toFixed(1) : '0.0'}
          </p>
          <p className="text-sm text-blue-600">Rotación</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-green-800">
            ${(reporte.costoInventario || 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-600">Costo Total</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold text-red-800">
            ${(reporte.perdidasVencimiento || 0).toLocaleString()}
          </p>
          <p className="text-sm text-red-600">Pérdidas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Más Utilizados</h4>
          <div className="space-y-1 text-sm">
            {(reporte.medicamentosUtilizados || []).slice(0, 3).map((med, index) => (
              <div key={index} className="text-xs">{med}</div>
            ))}
            {(!reporte.medicamentosUtilizados || reporte.medicamentosUtilizados.length === 0) && (
              <p className="text-gray-500 text-xs">No hay datos</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-orange-600">Stock Bajo</h4>
          <div className="space-y-1 text-sm">
            {(reporte.stockBajo || []).slice(0, 3).map((item, index) => (
              <div key={index} className="text-xs text-orange-600">{item}</div>
            ))}
            {(!reporte.stockBajo || reporte.stockBajo.length === 0) && (
              <p className="text-gray-500 text-xs">Todo en stock</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-red-600">Vencidos</h4>
          <div className="space-y-1 text-sm">
            {(reporte.productosVencidos || []).slice(0, 3).map((item, index) => (
              <div key={index} className="text-xs text-red-600">{item}</div>
            ))}
            {(!reporte.productosVencidos || reporte.productosVencidos.length === 0) && (
              <p className="text-gray-500 text-xs">Sin vencimientos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (cargando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Vista Previa del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Cargando vista previa...</p>
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
          <Eye className="w-5 h-5" />
          Vista Previa - Reporte {tipoReporte}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {datos ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <strong>Período:</strong> {datos.fechaInicio} al {datos.fechaFin}
            </div>
            
            {tipoReporte === 'FINANCIERO' && renderFinanciero(datos as ReporteFinanciero)}
            {tipoReporte === 'CLINICO' && renderClinico(datos as ReporteClinico)}
            {tipoReporte === 'OPERACIONAL' && renderOperacional(datos as ReporteOperacional)}
            {tipoReporte === 'INVENTARIO' && renderInventario(datos as ReporteInventario)}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Selecciona las fechas y genera el reporte para ver la vista previa</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};