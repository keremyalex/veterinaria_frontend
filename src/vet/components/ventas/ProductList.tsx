import React, { useState } from 'react';
import { Search, Plus, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Product, ProductFilters } from '../../interfaces/ventas.interface';

interface ProductListProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  loading = false
}) => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    inStock: false
  });

  // Filtrar productos según los criterios
  const filteredProducts = products.filter(product => {
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.mark?.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStock = !filters.inStock || product.stock > 0;

    return matchesSearch && matchesStock;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-800', text: 'Sin stock' };
    if (stock <= 10) return { color: 'bg-yellow-100 text-yellow-800', text: 'Stock bajo' };
    return { color: 'bg-green-100 text-green-800', text: 'En stock' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar productos, categorías, marcas..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={filters.inStock}
              onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="inStock" className="text-sm font-medium">
              Solo en stock
            </label>
          </div>
        </div>

        <Button onClick={onAddProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Producto
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Productos</p>
                <p className="text-xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <p className="text-xl font-bold">
                  {products.filter(p => p.stock <= 10 && p.stock > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Sin Stock</p>
                <p className="text-xl font-bold">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Productos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filters.search ? 'No se encontraron productos que coincidan con tu búsqueda.' : 'No hay productos disponibles.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category?.name}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {product.mark?.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <Badge className={`${stockStatus.color} w-fit`}>
                          {stockStatus.text}
                        </Badge>
                        <span className="text-sm text-gray-600 mt-1">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditProduct(product)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDeleteProduct(product.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};