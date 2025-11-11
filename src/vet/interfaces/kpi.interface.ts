// Interfaces para KPIs y Dashboard
export interface DashboardResumen {
  totalMascotas: number;
  totalCitas: number;
  totalClientes: number;
  citasHoy: number;
  ingresosMes: number;
  crecimientoMensual?: number;
}

export interface CitasPorMes {
  mes: string;
  anio: number;
  totalCitas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  tasaCompletitud: number;
}

export interface MascotasPorEspecie {
  especie: string;
  totalMascotas: number;
  porcentaje: number;
}

export interface DoctorPerformance {
  doctorId: number;
  doctorNombre: string;
  totalCitas: number;
  citasCompletadas: number;
  tasaCompletitud: number;
  promedioDiagnosticosPorCita: number;
}

export interface VacunacionEstadisticas {
  totalVacunaciones: number;
  vacunacionesVencidas: number;
  vacunacionesProximas: number;
  vacunasMasAplicadas: string[];
}

export interface AlertaVacunacion {
  mascotaId: number;
  mascotaNombre: string;
  clienteNombre: string;
  tipoVacuna: string;
  fechaUltima?: string;
  fechaProxima: string;
  diasVencimiento: number;
  prioridad: string;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}