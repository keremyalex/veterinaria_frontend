import React from 'react';
import { BarChart3, Package, AlertTriangle, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVentasStats, mockStockAlerts, getLowStockProducts } from '../data/mock-ventas';

export const VentasDashboardPage: React.FC = () => {
  const stats = mockVentasStats;
  const stockAlerts = mockStockAlerts;
  const lowStockProducts = getLowStockProducts();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas</h1>
        </div>
        <p className="text-gray-600">
          Resumen del inventario y estadísticas de ventas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              En {stats.totalCategories} categorías
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total en stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Productos con stock crítico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marcas Activas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMarks}</div>
            <p className="text-xs text-muted-foreground">
              Proveedores registrados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Top */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Productos Destacados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas de Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockAlerts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No hay alertas de stock pendientes
                </div>
              ) : (
                stockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{alert.product?.name}</p>
                        <p className="text-xs text-gray-500">
                          Stock actual: {alert.currentStock} / Mínimo: {alert.minStock}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={alert.severity === 'CRITICAL' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {alert.severity === 'CRITICAL' ? 'Crítico' : 'Bajo'}
                    </Badge>
                  </div>
                ))
              )}

              {lowStockProducts.length > stockAlerts.length && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">
                    +{lowStockProducts.length - stockAlerts.length} productos más con stock bajo
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categorías Top */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Categorías Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map((category, index) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Activa
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Package className="w-4 h-4 mr-2" />
                Gestionar Productos
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Reportes de Inventario
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Revisar Alertas
              </Button>

              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Configurar Precios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};