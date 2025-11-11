/**
 * Mock data para el sistema de reportes
 * Datos de ejemplo para desarrollo sin backend completo
 */

import type {
  ReporteFinanciero,
  ReporteClinico,
  ReporteOperacional,
  ReporteInventario,
  ReporteCompleto,
  MetadataReporte,
  ResumenReporte,
  EstadoReporte,
  OpcionReporte,
  OpcionFormato
} from '../interfaces/reports.interface';

// Mock reporte financiero
export const mockReporteFinanciero: ReporteFinanciero = {
  periodo: "Noviembre 2024",
  fechaInicio: "2024-11-01",
  fechaFin: "2024-11-30",
  ingresosConsultas: 45000,
  ingresosVacunas: 28000,
  ingresosMedicamentos: 32000,
  ingresosCirugia: 18000,
  totalIngresos: 123000,
  costosOperativos: 75000,
  gananciaNeta: 48000,
  margenGanancia: 39.02,
  comparacionPeriodoAnterior: 12.5
};

// Mock reporte clínico
export const mockReporteClinico: ReporteClinico = {
  periodo: "Noviembre 2024",
  fechaInicio: "2024-11-01",
  fechaFin: "2024-11-30",
  totalConsultas: 342,
  consultasPorTipo: [
    "Consulta General: 180",
    "Vacunación: 95",
    "Control Post-operatorio: 45",
    "Emergencia: 22"
  ],
  diagnosticosFrecuentes: [
    "Infección del oído",
    "Gastroenteritis",
    "Dermatitis alérgica",
    "Infección urinaria",
    "Parásitos intestinales"
  ],
  tratamientosAplicados: [
    "Antibioterapia: 125",
    "Desparasitación: 98",
    "Tratamiento dermatológico: 67",
    "Cirugía menor: 23",
    "Terapia de fluidos: 18"
  ],
  cirugiasRealizadas: 23,
  vacunasAplicadas: 95,
  tiempoPromedioConsulta: 32.5,
  tasaSeguimiento: 87.3
};

// Mock reporte operacional
export const mockReporteOperacional: ReporteOperacional = {
  periodo: "Noviembre 2024",
  fechaInicio: "2024-11-01",
  fechaFin: "2024-11-30",
  ocupacionConsultorios: 78.5,
  utilizacionEquipos: 82.3,
  tiempoEsperaPromedio: 15.7,
  cancelaciones: 28,
  tasaCancelacion: 8.2,
  reprogramaciones: 45,
  satisfaccionCliente: 4.2,
  eficienciaPersonal: 91.8
};

// Mock reporte inventario
export const mockReporteInventario: ReporteInventario = {
  periodo: "Noviembre 2024",
  fechaInicio: "2024-11-01",
  fechaFin: "2024-11-30",
  medicamentosUtilizados: [
    "Amoxicilina: 45 unidades",
    "Metacam: 32 unidades", 
    "Frontline: 67 unidades",
    "Drontal: 28 unidades",
    "Ketamina: 12 unidades"
  ],
  stockBajo: [
    "Amoxicilina (5 unidades restantes)",
    "Suero fisiológico (12 unidades)",
    "Jeringas 5ml (8 unidades)"
  ],
  productosVencidos: [
    "Vitamina B12 - Vencida 15/10/2024",
    "Antihistamínico - Vencido 22/09/2024"
  ],
  rotacionInventario: 2.3,
  costoInventario: 18500,
  perdidasVencimiento: 1250
};

// Mock metadata
export const mockMetadataReporte: MetadataReporte = {
  idReporte: "RPT-2024-11-001",
  fechaGeneracion: new Date().toISOString(),
  usuarioSolicitante: "Dr. María González",
  tiempoProcesamiento: 2.34,
  totalRegistros: 1250,
  filtrosAplicados: "Período: Nov 2024, Doctor: Todos, Especie: Todas"
};

// Mock resumen
export const mockResumenReporte: ResumenReporte = {
  puntosClave: [
    "Incremento del 12.5% en ingresos respecto al mes anterior",
    "Mayor demanda en consultas de vacunación (+15%)",
    "Reducción del tiempo de espera promedio (-3.2 min)",
    "Alta satisfacción del cliente (4.2/5.0)"
  ],
  tendenciasPrincipales: [
    "Aumento sostenido en consultas preventivas",
    "Mayor adopción de tratamientos especializados",
    "Mejora en eficiencia operacional",
    "Crecimiento en cirugías programadas"
  ],
  alertas: [
    "Stock crítico en 3 medicamentos esenciales",
    "2 productos próximos a vencer en diciembre",
    "Incremento en cancelaciones de último momento"
  ],
  recomendaciones: [
    "Reabastecer inventario de medicamentos críticos",
    "Implementar recordatorios automáticos de citas",
    "Considerar ampliar horarios de atención los fines de semana",
    "Revisar precios de servicios de cirugía"
  ],
  metricasDestacadas: [
    "Tasa de completitud de citas: 91.8%",
    "Tiempo promedio de consulta: 32.5 min",
    "Margen de ganancia: 39.02%",
    "Satisfacción del cliente: 4.2/5.0"
  ]
};

// Mock reporte completo
export const mockReporteCompleto: ReporteCompleto = {
  metadata: mockMetadataReporte,
  resumen: mockResumenReporte,
  reporteFinanciero: mockReporteFinanciero,
  reporteClinico: mockReporteClinico,
  reporteOperacional: mockReporteOperacional,
  reporteInventario: mockReporteInventario
};

// Mock historial de reportes
export const mockHistorialReportes: EstadoReporte[] = [
  {
    id: "RPT-2024-11-001",
    tipo: "FINANCIERO",
    estado: "COMPLETADO",
    progreso: 100,
    fechaCreacion: "2024-11-08T10:30:00Z",
    fechaCompletado: "2024-11-08T10:32:34Z",
    urlDescarga: "/reports/RPT-2024-11-001.pdf"
  },
  {
    id: "RPT-2024-11-002", 
    tipo: "CLINICO",
    estado: "COMPLETADO",
    progreso: 100,
    fechaCreacion: "2024-11-07T14:15:00Z",
    fechaCompletado: "2024-11-07T14:18:12Z",
    urlDescarga: "/reports/RPT-2024-11-002.pdf"
  },
  {
    id: "RPT-2024-11-003",
    tipo: "OPERACIONAL", 
    estado: "GENERANDO",
    progreso: 65,
    fechaCreacion: "2024-11-08T16:45:00Z"
  },
  {
    id: "RPT-2024-10-028",
    tipo: "INVENTARIO",
    estado: "ERROR",
    progreso: 0,
    fechaCreacion: "2024-10-28T09:20:00Z",
    error: "Error de conexión con el sistema de inventario"
  }
];

// Opciones para la UI
export const opcionesReporte: OpcionReporte[] = [
  {
    value: "FINANCIERO",
    label: "Reporte Financiero",
    descripcion: "Ingresos, costos, ganancias y análisis financiero detallado",
    icono: "💰",
    color: "green"
  },
  {
    value: "CLINICO", 
    label: "Reporte Clínico",
    descripcion: "Consultas, diagnósticos, tratamientos y estadísticas médicas",
    icono: "🏥",
    color: "blue"
  },
  {
    value: "OPERACIONAL",
    label: "Reporte Operacional", 
    descripcion: "Eficiencia, tiempos de espera, ocupación y rendimiento",
    icono: "⚙️",
    color: "purple"
  },
  {
    value: "INVENTARIO",
    label: "Reporte de Inventario",
    descripcion: "Stock, rotación, vencimientos y control de medicamentos",
    icono: "📦",
    color: "orange"
  },
  {
    value: "MARKETING",
    label: "Reporte de Marketing",
    descripcion: "Análisis de clientes, retención y crecimiento del negocio",
    icono: "📈",
    color: "pink"
  }
];

export const opcionesFormato: OpcionFormato[] = [
  {
    value: "PDF",
    label: "PDF",
    extension: ".pdf",
    icono: "📄"
  },
  {
    value: "EXCEL",
    label: "Excel",
    extension: ".xlsx", 
    icono: "📊"
  },
  {
    value: "CSV",
    label: "CSV",
    extension: ".csv",
    icono: "📋"
  },
  {
    value: "JSON",
    label: "JSON",
    extension: ".json",
    icono: "🔧"
  }
];

// Doctores mock para filtros
export const mockDoctoresParaFiltros = [
  { id: 1, nombre: "María", apellido: "González", ci: "12345678" },
  { id: 2, nombre: "Carlos", apellido: "Rodríguez", ci: "87654321" },
  { id: 3, nombre: "Ana", apellido: "López", ci: "11223344" },
  { id: 4, nombre: "Pedro", apellido: "Martínez", ci: "55667788" }
];

// Especies mock para filtros
export const mockEspeciesParaFiltros = [
  { id: 1, descripcion: "Perro" },
  { id: 2, descripcion: "Gato" },
  { id: 3, descripcion: "Conejo" },
  { id: 4, descripcion: "Ave" },
  { id: 5, descripcion: "Reptil" }
];

// Helper para generar fechas
export const generarFechasMock = (diasAtras: number = 30) => {
  const fechaFin = new Date();
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaFin.getDate() - diasAtras);
  
  return {
    fechaInicio: fechaInicio.toISOString().split('T')[0],
    fechaFin: fechaFin.toISOString().split('T')[0]
  };
};