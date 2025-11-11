import { gql } from "@apollo/client";

// Query principal para el dashboard
export const GET_DASHBOARD_RESUMEN = gql`
  query GetDashboardResumen {
    dashboardResumen {
      totalMascotas
      totalCitas
      totalClientes
      citasHoy
      ingresosMes
      crecimientoMensual
    }
  }
`;

// Query para citas por mes
export const GET_CITAS_POR_MES = gql`
  query GetCitasPorMes($anio: Int) {
    citasPorMes(anio: $anio) {
      mes
      anio
      totalCitas
      citasCompletadas
      citasCanceladas
      tasaCompletitud
    }
  }
`;

// Query para mascotas por especie
export const GET_MASCOTAS_POR_ESPECIE = gql`
  query GetMascotasPorEspecie {
    estadisticasMascotasPorEspecie {
      especie
      totalMascotas
      porcentaje
    }
  }
`;

// Query para performance de doctores
export const GET_DOCTOR_PERFORMANCE = gql`
  query GetDoctorPerformance($mes: Int, $anio: Int) {
    doctorPerformance(mes: $mes, anio: $anio) {
      doctorId
      doctorNombre
      totalCitas
      citasCompletadas
      tasaCompletitud
      promedioDiagnosticosPorCita
    }
  }
`;

// Query para estadísticas de vacunación
export const GET_VACUNACION_ESTADISTICAS = gql`
  query GetVacunacionEstadisticas {
    vacunacionEstadisticas {
      totalVacunaciones
      vacunacionesVencidas
      vacunacionesProximas
      vacunasMasAplicadas
    }
  }
`;

// Query para alertas de vacunación
export const GET_ALERTAS_VACUNACION = gql`
  query GetAlertasVacunacion($diasLimite: Int) {
    alertasVacunacion(diasLimite: $diasLimite) {
      mascotaId
      mascotaNombre
      clienteNombre
      tipoVacuna
      fechaUltima
      fechaProxima
      diasVencimiento
      prioridad
    }
  }
`;