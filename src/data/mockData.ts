// Mock Data for UMKM Smart Advisor Prototype

export const profileData = {
  fullName: "Andi Pratama",
  email: "andi@kopisenja.com",
  phone: "+628123456789",
  address: "Jl. Merdeka No. 12, Bandung, Jawa Barat",
  profilePhoto: "https://api.dicebear.com/7.x/notionists/svg?seed=Andi",
};

export const businessData = {
  businessName: "Kopi Senja",
  ownerName: "Andi Pratama",
  businessType: "Coffee Shop",
  businessAddress: "Jl. Merdeka No. 12, Bandung, Jawa Barat",
  businessPhone: "+628123456789",
  businessEmail: "hello@kopisenja.com",
  logo: "/images/logo.jpg",
};

export const notifications = [
  {
    id: "N001",
    title: "Stok Rendah",
    description: "Kopi Susu tersisa 12 unit. Segera lakukan restock.",
    category: "inventory",
    createdAt: "2026-08-27T09:00:00",
    isRead: false,
    priority: "high",
  },
  {
    id: "N002",
    title: "Update Penjualan",
    description: "Pendapatan naik 18% dibanding hari sebelumnya.",
    category: "sales",
    createdAt: "2026-08-27T08:30:00",
    isRead: true,
    priority: "medium",
  },
  {
    id: "N003",
    title: "Pembayaran diterima",
    description: "Invoice #INV-1024 telah dibayar oleh pelanggan.",
    category: "payment",
    createdAt: "2026-08-26T16:45:00",
    isRead: false,
    priority: "high",
  },
  {
    id: "N004",
    title: "Rekomendasi stok",
    description: "Prediksi permintaan produk meningkat pada akhir pekan.",
    category: "recommendation",
    createdAt: "2026-08-26T14:00:00",
    isRead: true,
    priority: "low",
  },
];

export const businessProfile = {
  name: "Kopi Senja",
  owner: "Andi Pratama",
  type: "Coffee Shop",
};

export const products = [
  { id: "P001", name: "Kopi Susu", category: "Minuman", price: 20000, stock: 12, minStock: 20, status: "Low Stock" },
  { id: "P002", name: "Americano", category: "Minuman", price: 15000, stock: 45, minStock: 15, status: "Available" },
  { id: "P003", name: "Cappuccino", category: "Minuman", price: 22000, stock: 28, minStock: 15, status: "Available" },
  { id: "P004", name: "Matcha Latte", category: "Minuman", price: 23000, stock: 19, minStock: 15, status: "Available" },
  { id: "P005", name: "Croissant", category: "Makanan", price: 20000, stock: 8, minStock: 15, status: "Low Stock" },
  { id: "P006", name: "Donat", category: "Makanan", price: 12000, stock: 32, minStock: 10, status: "Available" },
];

export const productCategories = [
  "Makanan",
  "Minuman",
  "Pakaian dan Fashion",
  "Kecantikan dan Perawatan",
  "Rumah Tangga",
  "Elektronik",
  "Mainan",
  "Jasa",
  "Produk Digital",
  "Lainnya",
];

export interface Transaction {
  id: string;
  product: string;
  time: string;
  date: string;
  productCount: number;
  total: number;
  payment: string;
  status: string;
}

export const transactions: Transaction[] = [
  { id: "TRX-00124", product: "Kopi Susu", time: "08:15", date: "23 Aug 2026", productCount: 3, total: 75000, payment: "QRIS", status: "Selesai" },
  { id: "TRX-00125", product: "Kopi Susu", time: "09:40", date: "23 Aug 2026", productCount: 1, total: 20000, payment: "Cash", status: "Selesai" },
  { id: "TRX-00126", product: "Americano", time: "11:20", date: "23 Aug 2026", productCount: 5, total: 105000, payment: "QRIS", status: "Selesai" },
  { id: "TRX-00127", product: "Croissant", time: "14:05", date: "24 Aug 2026", productCount: 2, total: 40000, payment: "Cash", status: "Selesai" },
  { id: "TRX-00128", product: "Kopi Susu", time: "16:30", date: "24 Aug 2026", productCount: 4, total: 85000, payment: "QRIS", status: "Selesai" },
  { id: "TRX-00129", product: "Kopi Susu", time: "19:15", date: "25 Aug 2026", productCount: 3, total: 65000, payment: "QRIS", status: "Selesai" },
];

export const salesAnalytics = {
  revenue: 18450000,
  revenueGrowth: 12.8,
  totalTransactions: 426,
  transactionGrowth: 8.4,
  productsSold: 1284,
  productsGrowth: 15.2,
  aov: 43309,
  aovGrowth: 4.1,

  trendData: [
    { day: "Sen", revenue: 450000 },
    { day: "Sel", revenue: 520000 },
    { day: "Rab", revenue: 480000 },
    { day: "Kam", revenue: 610000 },
    { day: "Jum", revenue: 850000 },
    { day: "Sab", revenue: 1200000 },
    { day: "Min", revenue: 950000 },
  ],

  productPerformance: [
    { name: "Kopi Susu", sold: 428, revenue: 8560000 },
    { name: "Americano", sold: 286, revenue: 4290000 },
    { name: "Croissant", sold: 174, revenue: 3480000 },
    { name: "Matcha Latte", sold: 142, revenue: 3124000 },
  ],

  aiSummary: "Bisnis menunjukkan pertumbuhan positif sebesar 12.8% dalam 30 hari terakhir. Penjualan tertinggi terjadi pada hari Sabtu."
};

export const aiForecast = {
  summary: {
    message: "Penjualan Diperkirakan Meningkat",
    prediction: "14.6%",
    confidence: "92%",
    model: "Sales Forecast Model v1"
  },
  trend: [
    { day: "Senin", predicted: 18, actual: 15 },
    { day: "Selasa", predicted: 21, actual: 18 },
    { day: "Rabu", predicted: 24, actual: 20 },
    { day: "Kamis", predicted: 22, actual: 21 },
    { day: "Jumat", predicted: 29, actual: 25 },
    { day: "Sabtu", predicted: 36, actual: 30 },
    { day: "Minggu", predicted: 31, actual: null }, // Marker for prediction only
  ],
  productForecasts: [
    { name: "Kopi Susu", predicted: 185, confidence: 91 },
    { name: "Americano", predicted: 120, confidence: 86 },
    { name: "Croissant", predicted: 78, confidence: 82 },
  ]
};

export const aiRecommendations = [
  {
    id: 1,
    priority: "HIGH",
    title: "Restock Kopi Susu Segera",
    description: "Permintaan Kopi Susu diprediksi meningkat 18% akhir pekan ini. Stok saat ini (12) akan habis dalam 2 hari.",
    action: "Tambah 25 Unit",
  },
  {
    id: 2,
    priority: "MEDIUM",
    title: "Promosi Croissant",
    description: "Penjualan Croissant melambat minggu ini. Buat bundling 'Kopi Susu + Croissant' untuk meningkatkan AOV.",
    action: "Buat Promosi",
  },
  {
    id: 3,
    priority: "LOW",
    title: "Analisis Kinerja produk",
    description: "penjualan donat pada jam 10:00-12:00 cenderung rendah, disarankan untuk menyesuaikan strategi pemasaran.",
    action: "Lihat Detail",
  }
];

export const inventorySummary = {
  totalProducts: 24,
  lowStock: 4,
  outOfStock: 1,
  needsRestock: 5,
};

export const inventoryHistory = [
  { id: 1, type: "Sale", product: "Kopi Susu", qty: -3, date: "25 Aug 2026, 14:30" },
  { id: 2, type: "Restock", product: "Croissant", qty: 20, date: "25 Aug 2026, 08:00" },
  { id: 3, type: "Sale", product: "Americano", qty: -1, date: "24 Aug 2026, 19:15" },
  { id: 4, type: "Adjustment", product: "Donat", qty: -2, date: "24 Aug 2026, 18:00" },
];
