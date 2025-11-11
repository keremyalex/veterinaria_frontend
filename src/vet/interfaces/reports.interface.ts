/**
 * Interfaces para el sistema de reportes de la veterinaria
 * Basado en los schemas GraphQL de report_schema.py y kpi_schema.py
 */

// Tipos literales en lugar de enums
export type TipoReporte = 'FINANCIERO' | 'CLINICO' | 'OPERACIONAL' | 'MARKETING' | 'INVENTARIO';

export type FormatoReporte = 'PDF' | 'EXCEL' | 'CSV' | 'JSON';

export type PeriodoReporte = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL';

// Constantes para uso en la UI
export const TIPOS_REPORTE = {
  FINANCIERO: 'FINANCIERO' as const,
  CLINICO: 'CLINICO' as const,
  OPERACIONAL: 'OPERACIONAL' as const,
  MARKETING: 'MARKETING' as const,
  INVENTARIO: 'INVENTARIO' as const
} as const;

export const FORMATOS_REPORTE = {
  PDF: 'PDF' as const,
  EXCEL: 'EXCEL' as const,
  CSV: 'CSV' as const,
  JSON: 'JSON' as const
} as const;

export const PERIODOS_REPORTE = {
  DIARIO: 'DIARIO' as const,
  SEMANAL: 'SEMANAL' as const,
  MENSUAL: 'MENSUAL' as const,
  TRIMESTRAL: 'TRIMESTRAL' as const,
  ANUAL: 'ANUAL' as const
} as const;

// Filtros y configuración
export interface FiltrosReporte {
  fechaInicio: string;
  fechaFin: string;
  tipoReporte: TipoReporte;
  doctorId?: number;
  especie?: string;
  incluirDetalles?: boolean;
}

export interface ConfiguracionReporte {
  incluirGraficos: boolean;
  formatoExportacion: FormatoReporte;
  incluirComparaciones: boolean;
}

// Tipos de reportes específicos
export interface ReporteFinanciero {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  ingresosConsultas: number;
  ingresosVacunas: number;
  ingresosMedicamentos: number;
  ingresosCirugia: number;
  totalIngresos: number;
  costosOperativos: number;
  gananciaNeta: number;
  margenGanancia: number;
  comparacionPeriodoAnterior: number;
}

export interface ReporteClinico {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  totalConsultas: number;
  consultasPorTipo: string[];
  diagnosticosFrecuentes: string[];
  tratamientosAplicados: string[];
  cirugiasRealizadas: number;
  vacunasAplicadas: number;
  tiempoPromedioConsulta: number;
  tasaSeguimiento: number;
}

export interface ReporteOperacional {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  ocupacionConsultorios: number;
  utilizacionEquipos: number;
  tiempoEsperaPromedio: number;
  cancelaciones: number;
  tasaCancelacion: number;
  reprogramaciones: number;
  satisfaccionCliente?: number;
  eficienciaPersonal: number;
}

export interface ReporteInventario {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  medicamentosUtilizados: string[];
  stockBajo: string[];
  productosVencidos: string[];
  rotacionInventario: number;
  costoInventario: number;
  perdidasVencimiento: number;
}

// Metadata y resumen
export interface MetadataReporte {
  idReporte: string;
  fechaGeneracion: string;
  usuarioSolicitante: string;
  tiempoProcesamiento: number;
  totalRegistros: number;
  filtrosAplicados: string;
}

export interface ResumenReporte {
  puntosClave: string[];
  tendenciasPrincipales: string[];
  alertas: string[];
  recomendaciones: string[];
  metricasDestacadas: string[];
}

// Reporte completo
export interface ReporteCompleto {
  metadata: MetadataReporte;
  resumen: ResumenReporte;
  reporteFinanciero?: ReporteFinanciero;
  reporteClinico?: ReporteClinico;
  reporteOperacional?: ReporteOperacional;
  reporteInventario?: ReporteInventario;
}

// Estado del reporte
export interface EstadoReporte {
  id: string;
  tipo: TipoReporte;
  estado: 'GENERANDO' | 'COMPLETADO' | 'ERROR' | 'CANCELADO';
  progreso: number;
  fechaCreacion: string;
  fechaCompletado?: string;
  urlDescarga?: string;
  error?: string;
}

// Para la UI
export interface OpcionReporte {
  value: TipoReporte;
  label: string;
  descripcion: string;
  icono: string;
  color: string;
}

export interface OpcionFormato {
  value: FormatoReporte;
  label: string;
  extension: string;
  icono: string;
}

export interface RangoFecha {
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

// Respuestas del servidor
export interface RespuestaGenerarReporte {
  exito: boolean;
  idReporte?: string;
  mensaje: string;
  urlDescarga?: string;
  tiempoEstimado?: number;
}

export interface HistorialReporte {
  reportes: EstadoReporte[];
  total: number;
  pagina: number;
  limite: number;
}