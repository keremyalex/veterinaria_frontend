import { useQuery } from "@apollo/client/react";
import { 
  Users, 
  Calendar, 
  TrendingUp,
  Dog,
  Stethoscope,
  Shield,
  Activity,
  Clock
} from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";
import { MetricCard } from "@/vet/components/dashboard/MetricCard";
import { SimpleChart } from "@/vet/components/dashboard/SimpleChart";
import { AlertsPanel } from "@/vet/components/dashboard/AlertsPanel";
import { 
  GET_DASHBOARD_RESUMEN,
  GET_MASCOTAS_POR_ESPECIE,
  GET_CITAS_POR_MES,
  GET_DOCTOR_PERFORMANCE,
  GET_VACUNACION_ESTADISTICAS,
  GET_ALERTAS_VACUNACION
} from "@/graphql/queries/kpi.queries";
import type { 
  DashboardResumen, 
  MascotasPorEspecie,
  CitasPorMes,
  DoctorPerformance,
  VacunacionEstadisticas,
  AlertaVacunacion
} from "@/vet/interfaces/kpi.interface";
import {
  mockDashboardResumen,
  mockMascotasPorEspecie,
  mockCitasPorMes,
  mockDoctorPerformance,
  mockVacunacionEstadisticas,
  mockAlertasVacunacion
} from "@/vet/data/mock-kpi";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();

  // Queries para cargar datos del dashboard
  const { data: resumenData, loading: resumenLoading } = useQuery<{ dashboardResumen: DashboardResumen }>(GET_DASHBOARD_RESUMEN, {
    errorPolicy: "all"
  });

  const { data: especiesData, loading: especiesLoading } = useQuery<{ estadisticasMascotasPorEspecie: MascotasPorEspecie[] }>(GET_MASCOTAS_POR_ESPECIE, {
    errorPolicy: "all"
  });

  const { data: citasData, loading: citasLoading } = useQuery<{ citasPorMes: CitasPorMes[] }>(GET_CITAS_POR_MES, {
    variables: { anio: currentYear },
    errorPolicy: "all"
  });

  const { data: doctoresData, loading: doctoresLoading } = useQuery<{ doctorPerformance: DoctorPerformance[] }>(GET_DOCTOR_PERFORMANCE, {
    variables: { anio: currentYear },
    errorPolicy: "all"
  });

  const { data: vacunacionData, loading: vacunacionLoading } = useQuery<{ vacunacionEstadisticas: VacunacionEstadisticas }>(GET_VACUNACION_ESTADISTICAS, {
    errorPolicy: "all"
  });

  const { data: alertasData, loading: alertasLoading } = useQuery<{ alertasVacunacion: AlertaVacunacion[] }>(GET_ALERTAS_VACUNACION, {
    variables: { diasLimite: 30 },
    errorPolicy: "all"
  });

  if (resumenLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner />
      </div>
    );
  }

  const resumen = resumenData?.dashboardResumen || mockDashboardResumen;
  const especies = especiesData?.estadisticasMascotasPorEspecie || mockMascotasPorEspecie;
  const citas = citasData?.citasPorMes || mockCitasPorMes;
  const doctores = doctoresData?.doctorPerformance || mockDoctorPerformance;
  const vacunacion = vacunacionData?.vacunacionEstadisticas || mockVacunacionEstadisticas;
  const alertas = alertasData?.alertasVacunacion || mockAlertasVacunacion;

  // Preparar datos para gráficos
  const especiesChartData = especies.map((especie, index) => ({
    label: especie.especie,
    value: especie.totalMascotas,
    color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'][index % 5]
  }));

  // Mapear nombres de meses en inglés a español abreviado
  const monthMap: { [key: string]: string } = {
    'January': 'Ene',
    'February': 'Feb', 
    'March': 'Mar',
    'April': 'Abr',
    'May': 'May',
    'June': 'Jun',
    'July': 'Jul',
    'August': 'Ago',
    'September': 'Sep',
    'October': 'Oct',
    'November': 'Nov',
    'December': 'Dic'
  };

  const citasChartData = citas.slice(-6).map(cita => ({
    label: monthMap[cita.mes] || cita.mes.substring(0, 3),
    value: cita.totalCitas,
    color: 'bg-blue-500'
  }));

  const doctoresChartData = doctores.slice(0, 5).map((doctor, index) => ({
    label: doctor.doctorNombre, // Mostrar nombre completo
    value: doctor.totalCitas,
    color: ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'][index % 5]
  }));

  // 🐛 DEBUG: Verificar datos de doctores
  console.log("👨‍⚕️ Debug Doctores:", {
    doctoresOriginal: doctores,
    doctoresChartData
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de la clínica veterinaria
        </p>
      </div>

      {/* KPI Cards principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Mascotas"
          value={resumen?.totalMascotas || 0}
          subtitle="Mascotas registradas"
          icon={<Dog className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="Citas Hoy"
          value={resumen?.citasHoy || 0}
          subtitle="Agenda de hoy"
          icon={<Calendar className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Total Clientes"
          value={resumen?.totalClientes || 0}
          subtitle="Clientes activos"
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        <MetricCard
          title="Ingresos del Mes"
          value={`$${(resumen?.ingresosMes || 0).toLocaleString()}`}
          subtitle="Ingresos totales"
          icon={<TrendingUp className="h-6 w-6" />}
          color="orange"
          trend={resumen?.crecimientoMensual ? {
            value: resumen.crecimientoMensual,
            isPositive: resumen.crecimientoMensual > 0
          } : undefined}
        />
      </div>

      {/* Segunda fila de KPIs - Vacunación */}
      {vacunacion && (
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Vacunaciones Total"
            value={vacunacion.totalVacunaciones}
            subtitle="Vacunas aplicadas"
            icon={<Shield className="h-6 w-6" />}
            color="green"
          />
          <MetricCard
            title="Próximas a Vencer"
            value={vacunacion.vacunacionesProximas}
            subtitle="En 30 días"
            icon={<Clock className="h-6 w-6" />}
            color="orange"
          />
          <MetricCard
            title="Vencidas"
            value={vacunacion.vacunacionesVencidas}
            subtitle="Requieren atención"
            icon={<Activity className="h-6 w-6" />}
            color="red"
          />
          <MetricCard
            title="Citas Totales"
            value={resumen?.totalCitas || 0}
            subtitle="Todas las citas"
            icon={<Stethoscope className="h-6 w-6" />}
            color="blue"
          />
        </div>
      )}

      {/* Gráficos y Alertas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Gráfico de Mascotas por Especie */}
        {!especiesLoading && especies.length > 0 && (
          <SimpleChart
            title="Mascotas por Especie"
            description="Distribución de mascotas registradas"
            data={especiesChartData}
            type="pie"
          />
        )}

        {/* Gráfico de Citas por Mes */}
        {!citasLoading && citasChartData.length > 0 && (
          <SimpleChart
            title="Citas por Mes"
            description="Últimos 6 meses"
            data={citasChartData}
            type="line"
          />
        )}

        {/* Panel de Alertas */}
        {!alertasLoading && (
          <AlertsPanel alertas={alertas} />
        )}
      </div>

      {/* Gráfico de Performance de Doctores */}
      {!doctoresLoading && doctores.length > 0 && (
        <div className="grid gap-6">
          <SimpleChart
            title="Performance de Doctores"
            description="Citas atendidas por doctor este mes"
            data={doctoresChartData}
            type="bar"
          />
        </div>
      )}

      {/* Resumen de Vacunación */}
      {vacunacion && vacunacion.vacunasMasAplicadas.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Vacunas Más Aplicadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vacunacion.vacunasMasAplicadas.slice(0, 4).map((vacuna, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{vacuna}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado de Carga */}
      {(resumenLoading || especiesLoading || citasLoading || doctoresLoading || vacunacionLoading || alertasLoading) && (
        <div className="flex items-center justify-center py-8">
          <Spinner />
          <span className="ml-2 text-gray-600">Cargando datos del dashboard...</span>
        </div>
      )}
    </div>
  );
}
