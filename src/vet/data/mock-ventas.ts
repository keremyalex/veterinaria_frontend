import type { Product, Category, Mark, VentaStats, StockAlert, StockMovement } from '../interfaces/ventas.interface';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "cat-001",
    name: "Alimento para Perros",
    description: "Alimentos secos y húmedos para perros de todas las edades"
  },
  {
    id: "cat-002", 
    name: "Alimento para Gatos",
    description: "Alimentos especializados para gatos adultos y cachorros"
  },
  {
    id: "cat-003",
    name: "Medicamentos",
    description: "Medicamentos veterinarios y suplementos"
  },
  {
    id: "cat-004",
    name: "Juguetes",
    description: "Juguetes para mascotas de diferentes tamaños"
  },
  {
    id: "cat-005",
    name: "Accesorios",
    description: "Collares, correas, camas y otros accesorios"
  },
  {
    id: "cat-006",
    name: "Higiene",
    description: "Productos de aseo y cuidado personal para mascotas"
  }
];

// Mock Marks
export const mockMarks: Mark[] = [
  {
    id: "mark-001",
    name: "Royal Canin",
    description: "Marca premium de alimentos para mascotas"
  },
  {
    id: "mark-002",
    name: "Hill's",
    description: "Alimentos terapéuticos y de alta calidad"
  },
  {
    id: "mark-003",
    name: "Purina",
    description: "Marca líder en nutrición para mascotas"
  },
  {
    id: "mark-004",
    name: "Bayer",
    description: "Productos farmacéuticos veterinarios"
  },
  {
    id: "mark-005",
    name: "Kong",
    description: "Juguetes resistentes y duraderos"
  },
  {
    id: "mark-006",
    name: "FURminator",
    description: "Herramientas profesionales de aseo"
  },
  {
    id: "mark-007",
    name: "Flexi",
    description: "Correas y accesorios de paseo"
  },
  {
    id: "mark-008",
    name: "Virbac",
    description: "Salud animal y productos veterinarios"
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Royal Canin Adult Medium",
    description: "Alimento seco para perros adultos de raza mediana (10-25kg)",
    imageUrl: "/images/products/royal-canin-medium.jpg",
    stock: 45,
    price: 89.99,
    categoryId: "cat-001",
    markId: "mark-001",
    category: mockCategories[0],
    mark: mockMarks[0]
  },
  {
    id: "prod-002", 
    name: "Hill's Prescription Diet k/d",
    description: "Alimento terapéutico para cuidado renal en perros",
    imageUrl: "/images/products/hills-kd.jpg",
    stock: 12,
    price: 156.50,
    categoryId: "cat-001",
    markId: "mark-002",
    category: mockCategories[0],
    mark: mockMarks[1]
  },
  {
    id: "prod-003",
    name: "Whiskas Adult Pollo",
    description: "Alimento húmedo para gatos adultos sabor pollo",
    imageUrl: "/images/products/whiskas-pollo.jpg", 
    stock: 78,
    price: 12.99,
    categoryId: "cat-002",
    markId: "mark-003",
    category: mockCategories[1],
    mark: mockMarks[2]
  },
  {
    id: "prod-004",
    name: "Bravecto Antipulgas",
    description: "Comprimido antipulgas de acción prolongada para perros",
    imageUrl: "/images/products/bravecto.jpg",
    stock: 25,
    price: 89.00,
    categoryId: "cat-003", 
    markId: "mark-004",
    category: mockCategories[2],
    mark: mockMarks[3]
  },
  {
    id: "prod-005",
    name: "Kong Classic Rojo",
    description: "Juguete resistente para perros medianos y grandes",
    imageUrl: "/images/products/kong-red.jpg",
    stock: 33,
    price: 24.99,
    categoryId: "cat-004",
    markId: "mark-005", 
    category: mockCategories[3],
    mark: mockMarks[4]
  },
  {
    id: "prod-006",
    name: "FURminator Cepillo Grande",
    description: "Cepillo profesional para perros de pelo largo",
    imageUrl: "/images/products/furminator-large.jpg",
    stock: 8,
    price: 45.99,
    categoryId: "cat-006",
    markId: "mark-006",
    category: mockCategories[5],
    mark: mockMarks[5]
  },
  {
    id: "prod-007",
    name: "Collar Ajustable Mediano", 
    description: "Collar de nylon ajustable para perros medianos",
    imageUrl: "/images/products/collar-medium.jpg",
    stock: 56,
    price: 18.99,
    categoryId: "cat-005",
    markId: "mark-007",
    category: mockCategories[4],
    mark: mockMarks[6]
  },
  {
    id: "prod-008",
    name: "Virbac Dental Chew",
    description: "Snacks dentales para higiene oral canina",
    imageUrl: "/images/products/dental-chew.jpg",
    stock: 42,
    price: 32.50,
    categoryId: "cat-006",
    markId: "mark-008",
    category: mockCategories[5],
    mark: mockMarks[7]
  },
  {
    id: "prod-009",
    name: "Royal Canin Kitten",
    description: "Alimento para gatitos de 4 meses a 1 año",
    imageUrl: "/images/products/royal-canin-kitten.jpg", 
    stock: 2,
    price: 67.99,
    categoryId: "cat-002",
    markId: "mark-001",
    category: mockCategories[1],
    mark: mockMarks[0]
  },
  {
    id: "prod-010",
    name: "Hill's Science Diet Senior",
    description: "Alimento para perros senior de 7 años en adelante",
    imageUrl: "/images/products/hills-senior.jpg",
    stock: 19,
    price: 94.99,
    categoryId: "cat-001", 
    markId: "mark-002",
    category: mockCategories[0],
    mark: mockMarks[1]
  }
];

// Mock Stock Alerts
export const mockStockAlerts: StockAlert[] = [
  {
    id: "alert-001",
    productId: "prod-006",
    product: mockProducts.find(p => p.id === "prod-006"),
    currentStock: 8,
    minStock: 15,
    severity: "LOW",
    dateCreated: new Date().toISOString()
  },
  {
    id: "alert-002", 
    productId: "prod-009",
    product: mockProducts.find(p => p.id === "prod-009"),
    currentStock: 2,
    minStock: 10,
    severity: "CRITICAL",
    dateCreated: new Date().toISOString()
  }
];

// Mock Stock Movements
export const mockStockMovements: StockMovement[] = [
  {
    id: "mov-001",
    productId: "prod-001",
    product: mockProducts.find(p => p.id === "prod-001"),
    type: "ENTRADA",
    quantity: 20,
    reason: "Compra a proveedor",
    date: "2024-11-10T09:30:00Z",
    userId: "user-001"
  },
  {
    id: "mov-002",
    productId: "prod-003", 
    product: mockProducts.find(p => p.id === "prod-003"),
    type: "SALIDA",
    quantity: -5,
    reason: "Venta a cliente",
    date: "2024-11-10T14:15:00Z",
    userId: "user-002"
  },
  {
    id: "mov-003",
    productId: "prod-009",
    product: mockProducts.find(p => p.id === "prod-009"),
    type: "AJUSTE",
    quantity: -3,
    reason: "Productos dañados",
    date: "2024-11-09T16:45:00Z",
    userId: "user-001"
  }
];

// Mock Ventas Stats
export const mockVentasStats: VentaStats = {
  totalProducts: mockProducts.length,
  totalCategories: mockCategories.length,
  totalMarks: mockMarks.length,
  lowStockProducts: mockStockAlerts.length,
  totalInventoryValue: mockProducts.reduce((total, product) => total + (product.price * product.stock), 0),
  topSellingProducts: mockProducts.slice(0, 5),
  topCategories: mockCategories.slice(0, 3),
  topMarks: mockMarks.slice(0, 3)
};

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(category => category.id === id);
};

export const getMarkById = (id: string): Mark | undefined => {
  return mockMarks.find(mark => mark.id === id);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter(product => product.categoryId === categoryId);
};

export const getProductsByMark = (markId: string): Product[] => {
  return mockProducts.filter(product => product.markId === markId);
};

export const getLowStockProducts = (minStock: number = 10): Product[] => {
  return mockProducts.filter(product => product.stock <= minStock);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description?.toLowerCase().includes(lowercaseQuery) ||
    product.category?.name.toLowerCase().includes(lowercaseQuery) ||
    product.mark?.name.toLowerCase().includes(lowercaseQuery)
  );
};