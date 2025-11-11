import React from 'react';
import { Calendar, User, PawPrint } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import type { TipoReporte, FiltrosReporte } from '../../interfaces/reports.interface';
import { mockDoctoresParaFiltros, mockEspeciesParaFiltros } from '../../data/mock-reports';

interface ReportFiltersProps {
  filtros: FiltrosReporte;
  onFiltrosChange: (filtros: Partial<FiltrosReporte>) => void;
  onLimpiarFiltros: () => void;
  tipoReporteSeleccionado: TipoReporte;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filtros,
  onFiltrosChange,
  onLimpiarFiltros,
  tipoReporteSeleccionado
}) => {
  
  const handleFechaChange = (campo: 'fechaInicio' | 'fechaFin', valor: string) => {
    onFiltrosChange({ [campo]: valor });
  };

  const handleDoctorChange = (valor: string) => {
    onFiltrosChange({ 
      doctorId: valor === '' ? undefined : parseInt(valor) 
    });
  };

  const handleEspecieChange = (valor: string) => {
    onFiltrosChange({ 
      especie: valor === '' ? undefined : valor 
    });
  };

  const mostrarFiltroDoctores = ['CLINICO', 'FINANCIERO'].includes(tipoReporteSeleccionado);
  const mostrarFiltroEspecies = tipoReporteSeleccionado === 'CLINICO';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Filtros de Reporte
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio" className="text-sm font-medium">
              Fecha Inicio
            </Label>
            <Input
              id="fechaInicio"
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => handleFechaChange('fechaInicio', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaFin" className="text-sm font-medium">
              Fecha Fin
            </Label>
            <Input
              id="fechaFin"
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => handleFechaChange('fechaFin', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Filtro de Doctor */}
        {mostrarFiltroDoctores && (
          <div className="space-y-2">
            <Label htmlFor="doctor" className="text-sm font-medium flex items-center gap-1">
              <User className="w-4 h-4" />
              Doctor (Opcional)
            </Label>
            <NativeSelect
              id="doctor"
              value={filtros.doctorId?.toString() || ''}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full"
            >
              <option value="">Todos los doctores</option>
              {mockDoctoresParaFiltros.map((doctor) => (
                <option key={doctor.id} value={doctor.id.toString()}>
                  Dr. {doctor.nombre} {doctor.apellido}
                </option>
              ))}
            </NativeSelect>
          </div>
        )}

        {/* Filtro de Especie */}
        {mostrarFiltroEspecies && (
          <div className="space-y-2">
            <Label htmlFor="especie" className="text-sm font-medium flex items-center gap-1">
              <PawPrint className="w-4 h-4" />
              Especie (Opcional)
            </Label>
            <NativeSelect
              id="especie"
              value={filtros.especie || ''}
              onChange={(e) => handleEspecieChange(e.target.value)}
              className="w-full"
            >
              <option value="">Todas las especies</option>
              {mockEspeciesParaFiltros.map((especie) => (
                <option key={especie.id} value={especie.descripcion}>
                  {especie.descripcion}
                </option>
              ))}
            </NativeSelect>
          </div>
        )}

        {/* Opción incluir detalles */}
        <div className="flex items-center space-x-2">
          <input
            id="incluirDetalles"
            type="checkbox"
            checked={filtros.incluirDetalles || false}
            onChange={(e) => onFiltrosChange({ incluirDetalles: e.target.checked })}
            className="rounded border-gray-300"
          />
          <Label htmlFor="incluirDetalles" className="text-sm">
            Incluir detalles extendidos
          </Label>
        </div>

        {/* Botón limpiar */}
        <Button 
          variant="outline" 
          onClick={onLimpiarFiltros}
          className="w-full"
        >
          Limpiar Filtros
        </Button>

        {/* Información de filtros aplicados */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Filtros activos:</strong>
          <br />
          • Período: {filtros.fechaInicio} al {filtros.fechaFin}
          {filtros.doctorId && (
            <>
              <br />• Doctor: Dr. {mockDoctoresParaFiltros.find(d => d.id === filtros.doctorId)?.nombre}
            </>
          )}
          {filtros.especie && (
            <>
              <br />• Especie: {filtros.especie}
            </>
          )}
          {filtros.incluirDetalles && (
            <>
              <br />• Detalles extendidos: Sí
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};