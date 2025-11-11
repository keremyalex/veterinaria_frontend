// Mock data para el dashboard cuando el backend no está disponible
import type { 
  DashboardResumen, 
  MascotasPorEspecie,
  CitasPorMes,
  DoctorPerformance,
  VacunacionEstadisticas,
  AlertaVacunacion
} from "@/vet/interfaces/kpi.interface";

export const mockDashboardResumen: DashboardResumen = {
  totalMascotas: 1247,
  totalCitas: 2856,
  totalClientes: 892,
  citasHoy: 18,
  ingresosMes: 125450.50,
  crecimientoMensual: 12.5
};

export const mockMascotasPorEspecie: MascotasPorEspecie[] = [
  { especie: "Caninos", totalMascotas: 756, porcentaje: 60.6 },
  { especie: "Felinos", totalMascotas: 312, porcentaje: 25.0 },
  { especie: "Aves", totalMascotas: 89, porcentaje: 7.1 },
  { especie: "Roedores", totalMascotas: 56, porcentaje: 4.5 },
  { especie: "Reptiles", totalMascotas: 34, porcentaje: 2.8 }
];

export const mockCitasPorMes: CitasPorMes[] = [
  { mes: "Enero", anio: 2025, totalCitas: 245, citasCompletadas: 230, citasCanceladas: 15, tasaCompletitud: 93.9 },
  { mes: "Febrero", anio: 2025, totalCitas: 267, citasCompletadas: 251, citasCanceladas: 16, tasaCompletitud: 94.0 },
  { mes: "Marzo", anio: 2025, totalCitas: 289, citasCompletadas: 275, citasCanceladas: 14, tasaCompletitud: 95.2 },
  { mes: "Abril", anio: 2025, totalCitas: 312, citasCompletadas: 298, citasCanceladas: 14, tasaCompletitud: 95.5 },
  { mes: "Mayo", anio: 2025, totalCitas: 334, citasCompletadas: 319, citasCanceladas: 15, tasaCompletitud: 95.5 },
  { mes: "Junio", anio: 2025, totalCitas: 298, citasCompletadas: 285, citasCanceladas: 13, tasaCompletitud: 95.6 }
];

export const mockDoctorPerformance: DoctorPerformance[] = [
  { 
    doctorId: 1, 
    doctorNombre: "Dr. Ana García", 
    totalCitas: 156, 
    citasCompletadas: 148, 
    tasaCompletitud: 94.9, 
    promedioDiagnosticosPorCita: 1.2 
  },
  { 
    doctorId: 2, 
    doctorNombre: "Dr. Carlos López", 
    totalCitas: 142, 
    citasCompletadas: 136, 
    tasaCompletitud: 95.8, 
    promedioDiagnosticosPorCita: 1.4 
  },
  { 
    doctorId: 3, 
    doctorNombre: "Dra. María Rodríguez", 
    totalCitas: 134, 
    citasCompletadas: 129, 
    tasaCompletitud: 96.3, 
    promedioDiagnosticosPorCita: 1.1 
  }
];

export const mockVacunacionEstadisticas: VacunacionEstadisticas = {
  totalVacunaciones: 2847,
  vacunacionesVencidas: 23,
  vacunacionesProximas: 67,
  vacunasMasAplicadas: ["Rabia", "Quintuple Canina", "Triple Felina", "Parvovirus"]
};

export const mockAlertasVacunacion: AlertaVacunacion[] = [
  {
    mascotaId: 1,
    mascotaNombre: "Max",
    clienteNombre: "Juan Pérez",
    tipoVacuna: "Rabia",
    fechaUltima: "2024-11-10",
    fechaProxima: "2025-11-10",
    diasVencimiento: 15,
    prioridad: "Media"
  },
  {
    mascotaId: 2,
    mascotaNombre: "Luna",
    clienteNombre: "María García",
    tipoVacuna: "Quintuple",
    fechaUltima: "2024-10-01",
    fechaProxima: "2025-01-01",
    diasVencimiento: -10,
    prioridad: "Alta"
  },
  {
    mascotaId: 3,
    mascotaNombre: "Rocky",
    clienteNombre: "Pedro Martínez",
    tipoVacuna: "Parvovirus",
    fechaProxima: "2025-12-25",
    diasVencimiento: 25,
    prioridad: "Baja"
  }
];