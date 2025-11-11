import React, { useState, useEffect } from 'react';
import { X, Save, Package, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import type { Product, Category, Mark, ProductFormData } from '../../interfaces/ventas.interface';

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  product?: Product | null;
  categories: Category[];
  marks: Mark[];
  loading?: boolean;
}

export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({
  open,
  onClose,
  onSave,
  product = null,
  categories,
  marks,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    imageUrl: '',
    stock: 0,
    price: 0,
    categoryId: '',
    markId: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        stock: product.stock,
        price: product.price,
        categoryId: product.categoryId,
        markId: product.markId
      });
    } else {
      // Reset form para nuevo producto
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        stock: 0,
        price: 0,
        categoryId: categories.length > 0 ? categories[0].id : '',
        markId: marks.length > 0 ? marks[0].id : ''
      });
    }
    setErrors({});
  }, [product, open, categories, marks]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Debe seleccionar una categoría';
    }

    if (!formData.markId) {
      newErrors.markId = 'Debe seleccionar una marca';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo que se está editando
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre del producto *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Royal Canin Adult Medium"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del producto..."
                className="w-full min-h-20 px-3 py-2 border border-gray-300 rounded-md resize-vertical"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="imageUrl" className="text-sm font-medium">
                URL de Imagen
              </Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <Button type="button" variant="outline" size="sm" className="px-3">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium">
                Precio *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stock" className="text-sm font-medium">
                Stock Inicial *
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
                className={errors.stock ? 'border-red-500' : ''}
              />
              {errors.stock && (
                <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Categoría y Marca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoryId" className="text-sm font-medium">
                Categoría *
              </Label>
              <NativeSelect
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className={errors.categoryId ? 'border-red-500' : ''}
              >
                <option value="">Seleccionar categoría...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </NativeSelect>
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="markId" className="text-sm font-medium">
                Marca *
              </Label>
              <NativeSelect
                id="markId"
                value={formData.markId}
                onChange={(e) => handleInputChange('markId', e.target.value)}
                className={errors.markId ? 'border-red-500' : ''}
              >
                <option value="">Seleccionar marca...</option>
                {marks.map((mark) => (
                  <option key={mark.id} value={mark.id}>
                    {mark.name}
                  </option>
                ))}
              </NativeSelect>
              {errors.markId && (
                <p className="text-sm text-red-600 mt-1">{errors.markId}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 flex-1"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear Producto')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};