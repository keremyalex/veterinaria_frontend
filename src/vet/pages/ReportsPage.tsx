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
      const extension = getFileExtension(formatoReporte);
      const urlDescarga = `/reports/${idReporte}.${extension}`;
      
      // Agregar al historial
      const nuevoReporte: EstadoReporte = {
        id: idReporte,
        tipo: tipo,
        formato: formatoReporte,
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

  const generateMockFileContent = (reporte: EstadoReporte, formatoArchivo: FormatoReporte) => {
    const fecha = new Date().toLocaleString('es-ES');
    const datos = datosReporte || {};
    
    switch (formatoArchivo) {
      case 'PDF':
        // Para PDF, generamos un contenido que simule ser un PDF
        return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Reporte ${reporte.tipo} - ${fecha}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000179 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
274
%%EOF`;

      case 'EXCEL':
        // Para Excel, generamos contenido CSV que Excel puede abrir
        return `Reporte ${reporte.tipo} - ${fecha}\n\nResumen:\nTipo,${reporte.tipo}\nFecha,${fecha}\nID,${reporte.id}\n\n` +
               `Datos:\n${Object.entries(datos).map(([key, value]) => `${key},${value}`).join('\n')}`;

      case 'CSV':
        return `Tipo,Fecha,ID,Valor\n${reporte.tipo},${fecha},${reporte.id},Datos del reporte\n` +
               `${Object.entries(datos).map(([key, value]) => `${key},${value},,`).join('\n')}`;

      case 'JSON':
        return JSON.stringify({
          reporte: {
            id: reporte.id,
            tipo: reporte.tipo,
            fechaGeneracion: fecha,
            datos: datos
          }
        }, null, 2);

      default:
        return `Reporte ${reporte.tipo}\nGenerado: ${fecha}\nID: ${reporte.id}`;
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getMimeType = (formato: FormatoReporte): string => {
    switch (formato) {
      case 'PDF':
        return 'application/pdf';
      case 'EXCEL':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'CSV':
        return 'text/csv';
      case 'JSON':
        return 'application/json';
      default:
        return 'text/plain';
    }
  };

  const getFileExtension = (formato: FormatoReporte): string => {
    switch (formato) {
      case 'PDF':
        return 'pdf';
      case 'EXCEL':
        return 'xlsx';
      case 'CSV':
        return 'csv';
      case 'JSON':
        return 'json';
      default:
        return 'txt';
    }
  };

  const handleDescargarReporte = (reporte: EstadoReporte) => {
    if (reporte.urlDescarga) {
      // Usar el formato almacenado en lugar de extraerlo de la URL
      const formatoArchivo = reporte.formato;
      
      // Generar contenido del archivo
      const contenido = generateMockFileContent(reporte, formatoArchivo);
      
      // Generar nombre del archivo
      const fileExtension = getFileExtension(formatoArchivo);
      const filename = `${reporte.id}-${reporte.tipo.toLowerCase()}.${fileExtension}`;
      
      // Obtener tipo MIME
      const mimeType = getMimeType(formatoArchivo);
      
      // Descargar archivo
      downloadFile(contenido, filename, mimeType);
      
      console.log(`Descargando reporte: ${reporte.id} en formato ${formatoArchivo}`);
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