import { gql } from '@apollo/client';

/**
 * Queries GraphQL para el sistema de reportes
 * Basado en los schemas de report_schema.py y kpi_schema.py
 */

// Fragmentos comunes
export const METADATA_REPORTE_FRAGMENT = gql`
  fragment MetadataReporte on MetadataReporte {
    idReporte
    fechaGeneracion
    usuarioSolicitante
    tiempoProcesamiento
    totalRegistros
    filtrosAplicados
  }
`;

export const RESUMEN_REPORTE_FRAGMENT = gql`
  fragment ResumenReporte on ResumenReporte {
    puntosClave
    tendenciasPrincipales
    alertas
    recomendaciones
    metricasDestacadas
  }
`;

// Query para reporte financiero
export const GENERAR_REPORTE_FINANCIERO = gql`
  query GenerarReporteFinanciero(
    $fechaInicio: Date!
    $fechaFin: Date!
    $doctorId: Int
  ) {
    generarReporteFinanciero(
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      doctorId: $doctorId
    ) {
      periodo
      fechaInicio
      fechaFin
      ingresosConsultas
      ingresosVacunas
      ingresosMedicamentos
      ingresosCirugia
      totalIngresos
      costosOperativos
      gananciaNeta
      margenGanancia
      comparacionPeriodoAnterior
    }
  }
`;

// Query para reporte clínico
export const GENERAR_REPORTE_CLINICO = gql`
  query GenerarReporteClinico(
    $fechaInicio: Date!
    $fechaFin: Date!
    $doctorId: Int
    $especie: String
  ) {
    generarReporteClinico(
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      doctorId: $doctorId
      especie: $especie
    ) {
      periodo
      fechaInicio
      fechaFin
      totalConsultas
      consultasPorTipo
      diagnosticosFrecuentes
      tratamientosAplicados
      cirugiasRealizadas
      vacunasAplicadas
      tiempoPromedioConsulta
      tasaSeguimiento
    }
  }
`;

// Query para reporte operacional
export const GENERAR_REPORTE_OPERACIONAL = gql`
  query GenerarReporteOperacional(
    $fechaInicio: Date!
    $fechaFin: Date!
  ) {
    generarReporteOperacional(
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      periodo
      fechaInicio
      fechaFin
      ocupacionConsultorios
      utilizacionEquipos
      tiempoEsperaPromedio
      cancelaciones
      tasaCancelacion
      reprogramaciones
      satisfaccionCliente
      eficienciaPersonal
    }
  }
`;

// Query para reporte de inventario
export const GENERAR_REPORTE_INVENTARIO = gql`
  query GenerarReporteInventario(
    $fechaInicio: Date!
    $fechaFin: Date!
  ) {
    generarReporteInventario(
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      periodo
      fechaInicio
      fechaFin
      medicamentosUtilizados
      stockBajo
      productosVencidos
      rotacionInventario
      costoInventario
      perdidasVencimiento
    }
  }
`;

// Query para reporte completo
export const GENERAR_REPORTE_COMPLETO = gql`
  query GenerarReporteCompleto(
    $fechaInicio: Date!
    $fechaFin: Date!
    $tipoReporte: TipoReporte!
    $incluirGraficos: Boolean = true
    $formato: FormatoReporte = PDF
    $doctorId: Int
    $especie: String
  ) {
    generarReporteCompleto(
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      tipoReporte: $tipoReporte
      incluirGraficos: $incluirGraficos
      formato: $formato
      doctorId: $doctorId
      especie: $especie
    ) {
      metadata {
        ...MetadataReporte
      }
      resumen {
        ...ResumenReporte
      }
      reporteFinanciero {
        periodo
        fechaInicio
        fechaFin
        ingresosConsultas
        ingresosVacunas
        ingresosMedicamentos
        ingresosCirugia
        totalIngresos
        costosOperativos
        gananciaNeta
        margenGanancia
        comparacionPeriodoAnterior
      }
      reporteClinico {
        periodo
        fechaInicio
        fechaFin
        totalConsultas
        consultasPorTipo
        diagnosticosFrecuentes
        tratamientosAplicados
        cirugiasRealizadas
        vacunasAplicadas
        tiempoPromedioConsulta
        tasaSeguimiento
      }
      reporteOperacional {
        periodo
        fechaInicio
        fechaFin
        ocupacionConsultorios
        utilizacionEquipos
        tiempoEsperaPromedio
        cancelaciones
        tasaCancelacion
        reprogramaciones
        satisfaccionCliente
        eficienciaPersonal
      }
      reporteInventario {
        periodo
        fechaInicio
        fechaFin
        medicamentosUtilizados
        stockBajo
        productosVencidos
        rotacionInventario
        costoInventario
        perdidasVencimiento
      }
    }
  }
  ${METADATA_REPORTE_FRAGMENT}
  ${RESUMEN_REPORTE_FRAGMENT}
`;

// Query para obtener tipos de reportes disponibles
export const OBTENER_TIPOS_REPORTE = gql`
  query ObtenerTiposReporte {
    obtenerTiposReporte
  }
`;

// Queries auxiliares para datos necesarios en filtros
export const OBTENER_DOCTORES_PARA_FILTROS = gql`
  query ObtenerDoctoresParaFiltros {
    doctores {
      id
      nombre
      apellido
      ci
    }
  }
`;

export const OBTENER_ESPECIES_PARA_FILTROS = gql`
  query ObtenerEspeciesParaFiltros {
    especies {
      id
      descripcion
    }
  }
`;