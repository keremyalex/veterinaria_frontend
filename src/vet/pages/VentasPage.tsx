import { ShoppingCart, Package, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const VentasPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Módulo de Ventas</h1>
          <p className="text-muted-foreground">
            Gestión de productos, servicios y facturación
          </p>
        </div>
      </div>

      {/* Coming Soon Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Próximamente</div>
            <p className="text-xs text-muted-foreground">
              Gestión de inventario y productos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servicios</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Próximamente</div>
            <p className="text-xs text-muted-foreground">
              Catálogo de servicios veterinarios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturación</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Próximamente</div>
            <p className="text-xs text-muted-foreground">
              Generación de facturas y reportes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Próximamente</div>
            <p className="text-xs text-muted-foreground">
              Análisis de ventas y estadísticas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Desarrollo</CardTitle>
          <CardDescription>
            Módulos de ventas en planificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Gestión de Productos</h3>
                <p className="text-sm text-muted-foreground">
                  Inventario, categorías, precios y stock
                </p>
              </div>
              <div className="text-sm text-orange-600 font-medium">
                En planificación
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Catálogo de Servicios</h3>
                <p className="text-sm text-muted-foreground">
                  Servicios veterinarios, precios y duración
                </p>
              </div>
              <div className="text-sm text-orange-600 font-medium">
                En planificación
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Sistema de Facturación</h3>
                <p className="text-sm text-muted-foreground">
                  Generación de facturas, pagos y contabilidad
                </p>
              </div>
              <div className="text-sm text-orange-600 font-medium">
                En planificación
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Reportes y Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Análisis de ventas, tendencias y estadísticas
                </p>
              </div>
              <div className="text-sm text-orange-600 font-medium">
                En planificación
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Próximos pasos</h3>
            <p className="text-blue-800 text-sm">
              Este módulo será desarrollado próximamente e incluirá funcionalidades 
              completas para gestión de ventas, inventario, facturación y reportes 
              específicos para clínicas veterinarias.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};