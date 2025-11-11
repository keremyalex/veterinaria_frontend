// Interfaces para el módulo de ventas basadas en el schema GraphQL

// Entidades principales
export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  stock: number;
  price: number;
  categoryId: string;
  category?: Category;
  markId: string;
  mark?: Mark;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productByCategoryId?: Product[];
}

export interface Mark {
  id: string;
  name: string;
  description?: string;
}

// Inputs para mutations
export interface AddProductInput {
  name: string;
  description?: string;
  imageUrl?: string;
  stock: number;
  price: number;
  categoryId: string;
  markId: string;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  stock?: number;
  price?: number;
  categoryId?: string;
  markId?: string;
}

export interface AddCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name: string;
  description?: string;
}

export interface DeleteCategoryInput {
  id: string;
}

export interface AddMarkInput {
  name: string;
  description?: string;
}

export interface UpdateMarkInput {
  id: string;
  name: string;
  description?: string;
}

export interface DeleteMarkInput {
  id: string;
}

// Payloads de respuesta
export interface AddProductPayload {
  product?: Product;
}

export interface AddCategoryPayload {
  category?: Category;
}

export interface UpdateCategoryPayload {
  category?: Category;
  errors?: UpdateCategoryError[];
}

export interface DeleteCategoryPayload {
  category?: Category;
  errors?: DeleteCategoryError[];
}

export interface AddMarkPayload {
  mark?: Mark;
}

export interface UpdateMarkPayload {
  mark?: Mark;
  errors?: UpdateMarkError[];
}

export interface DeleteMarkPayload {
  mark?: Mark;
  errors?: DeleteMarkError[];
}

// Errors
export interface Error {
  message: string;
}

export interface NotFoundError extends Error {
  message: string;
}

export type UpdateCategoryError = NotFoundError;
export type DeleteCategoryError = NotFoundError;
export type UpdateMarkError = NotFoundError;
export type DeleteMarkError = NotFoundError;

// Filtros y búsquedas
export interface ProductFilters {
  categoryId?: string;
  markId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface CategoryFilters {
  search?: string;
}

export interface MarkFilters {
  search?: string;
}

// Para la UI
export interface ProductFormData {
  name: string;
  description: string;
  imageUrl: string;
  stock: number;
  price: number;
  categoryId: string;
  markId: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface MarkFormData {
  name: string;
  description: string;
}

// Para estadísticas de ventas
export interface VentaStats {
  totalProducts: number;
  totalCategories: number;
  totalMarks: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  topSellingProducts: Product[];
  topCategories: Category[];
  topMarks: Mark[];
}

// Para gestión de inventario
export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  type: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  quantity: number;
  reason: string;
  date: string;
  userId?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  product?: Product;
  currentStock: number;
  minStock: number;
  severity: 'LOW' | 'CRITICAL';
  dateCreated: string;
}