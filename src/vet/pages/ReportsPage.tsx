import React, { useState, useEffect } from 'react';
import { FileText, Calendar, TrendingUp, Download } from 'lucide-react';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { ReportFilters } from '../components/reports/ReportFilters';
import { ReportPreview } from '../components/reports/ReportPreview';
import { ReportHistory } from '../components/reports/ReportHistory';
import type { 
  TipoReporte, 
  FormatoReporte, 
  FiltrosReporte,
  RespuestaGenerarReporte,
  EstadoReporte
} from '../interfaces/reports.interface';
import { 
  mockReporteFinanciero,
  mockReporteClinico,
  mockReporteOperacional,
  mockReporteInventario,
  mockHistorialReportes,
  generarFechasMock
} from '../data/mock-reports';

export const ReportsPage: React.FC = () => {
  // Estados principales
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>('FINANCIERO');
  const [formato, setFormato] = useState<FormatoReporte>('PDF');
  const [filtros, setFiltros] = useState<FiltrosReporte>(() => {
    const fechas = generarFechasMock(30);
    return {
      fechaInicio: fechas.fechaInicio,
      fechaFin: fechas.fechaFin,
      tipoReporte: 'FINANCIERO',
      incluirDetalles: false
    };
  });

  // Estados de datos
  const [datosReporte, setDatosReporte] = useState<any>(null);
  const [cargandoPreview, setCargandoPreview] = useState(false);
  const [historialReportes, setHistorialReportes] = useState<EstadoReporte[]>(mockHistorialReportes);

  // Actualizar filtros cuando cambia el tipo de reporte
  useEffect(() => {
    setFiltros(prev => ({
      ...prev,
      tipoReporte: tipoReporte,
      // Limpiar filtros específicos cuando cambia el tipo
      doctorId: undefined,
      especie: undefined
    }));
  }, [tipoReporte]);

  // Cargar vista previa automáticamente cuando cambian filtros válidos
  useEffect(() => {
    if (filtros.fechaInicio && filtros.fechaFin) {
      cargarVistaPrevia();
    }
  }, [filtros.fechaInicio, filtros.fechaFin, tipoReporte]);

  const cargarVistaPrevia = async () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      setDatosReporte(null);
      return;
    }

    setCargandoPreview(true);
    
    try {
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usar datos mock según el tipo de reporte
      let datos;
      switch (tipoReporte) {
        case 'FINANCIERO':
          datos = { ...mockReporteFinanciero, fechaInicio: filtros.fechaInicio, fechaFin: filtros.fechaFin };
          break;
        case 'CLINICO':
          datos = { ...mockReporteClinico, fechaInicio: filtros.fechaInicio, fechaFin: filtros.fechaFin };
          break;
        case 'OPERACIONAL':
          datos = { ...mockReporteOperacional, fechaInicio: filtros.fechaInicio, fechaFin: filtros.fechaFin };
          break;
        case 'INVENTARIO':
          datos = { ...mockReporteInventario, fechaInicio: filtros.fechaInicio, fechaFin: filtros.fechaFin };
          break;
        default:
          datos = null;
      }
      
      setDatosReporte(datos);
    } catch (error) {
      console.error('Error cargando vista previa:', error);
      setDatosReporte(null);
    } finally {
      setCargandoPreview(false);
    }
  };

  const handleFiltrosChange = (nuevosFiltros: Partial<FiltrosReporte>) => {
    setFiltros(prev => ({
      ...prev,
      ...nuevosFiltros
    }));
  };

  const handleLimpiarFiltros = () => {
    const fechas = generarFechasMock(30);
    setFiltros({
      fechaInicio: fechas.fechaInicio,
      fechaFin: fechas.fechaFin,
      tipoReporte: tipoReporte,
      incluirDetalles: false
    });
  };

  const handleGenerarReporte = async (
    tipo: TipoReporte, 
    formatoReporte: FormatoReporte, 
    _filtrosReporte: FiltrosReporte
  ): Promise<RespuestaGenerarReporte> => {
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generar ID único para el reporte
      const idReporte = `RPT-${Date.now()}`;
      const urlDescarga = `/reports/${idReporte}.${formatoReporte.toLowerCase()}`;
      
      // Agregar al historial
      const nuevoReporte: EstadoReporte = {
        id: idReporte,
        tipo: tipo,
        estado: 'COMPLETADO',
        progreso: 100,
        fechaCreacion: new Date().toISOString(),
        fechaCompletado: new Date().toISOString(),
        urlDescarga: urlDescarga
      };
      
      setHistorialReportes(prev => [nuevoReporte, ...prev]);
      
      return {
        exito: true,
        idReporte: idReporte,
        mensaje: `Reporte ${tipo} generado exitosamente en formato ${formatoReporte}`,
        urlDescarga: urlDescarga,
        tiempoEstimado: 2
      };
    } catch (error) {
      return {
        exito: false,
        mensaje: `Error al generar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  };

  const handleDescargarReporte = (reporte: EstadoReporte) => {
    if (reporte.urlDescarga) {
      // En una app real, esto descargaría el archivo
      window.open(reporte.urlDescarga, '_blank');
      console.log('Descargando reporte:', reporte.id);
    }
  };

  const handleEliminarReporte = (reporteId: string) => {
    setHistorialReportes(prev => prev.filter(r => r.id !== reporteId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Genera y gestiona reportes detallados de la clínica veterinaria
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Reportes este mes</p>
              <p className="text-2xl font-bold">{historialReportes.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Completados</p>
              <p className="text-2xl font-bold">
                {historialReportes.filter(r => r.estado === 'COMPLETADO').length}
              </p>
            </div>
            <Download className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Período actual</p>
              <p className="text-xl font-bold">30 días</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Tendencia</p>
              <p className="text-xl font-bold">+12.5%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna izquierda: Filtros y Generador */}
        <div className="space-y-6">
          <ReportFilters
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
            onLimpiarFiltros={handleLimpiarFiltros}
            tipoReporteSeleccionado={tipoReporte}
          />
          
          <ReportGenerator
            tipoReporte={tipoReporte}
            onTipoReporteChange={setTipoReporte}
            formato={formato}
            onFormatoChange={setFormato}
            filtros={filtros}
            onGenerar={handleGenerarReporte}
          />
        </div>

        {/* Columna central y derecha: Vista previa */}
        <div className="lg:col-span-2">
          <ReportPreview
            tipoReporte={tipoReporte}
            datos={datosReporte}
            cargando={cargandoPreview}
          />
        </div>
      </div>

      {/* Historial de reportes */}
      <ReportHistory
        reportes={historialReportes}
        onDescargar={handleDescargarReporte}
        onEliminar={handleEliminarReporte}
      />
    </div>
  );
};