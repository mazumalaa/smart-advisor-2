"use client"
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { productCategories, products as initialProducts } from "@/data/mockData";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [savedProduct, setSavedProduct] = useState<any>(null);
  const [activeQrProduct, setActiveQrProduct] = useState<any>(null);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Minuman",
    price: "",
    stock: "",
    minStock: "",
  });

  const handleSaveProduct = () => {
    const p = {
      id: `P${Math.floor(Math.random() * 1000)}`,
      name: newProduct.name || "Produk Baru",
      category: newProduct.category,
      price: parseInt(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      minStock: parseInt(newProduct.minStock) || 0,
      status: parseInt(newProduct.stock) <= parseInt(newProduct.minStock) ? "Low Stock" : "Available"
    };
    setProducts([p, ...products]);
    setSavedProduct(p);
    setIsAddModalOpen(false);
    setIsQRModalOpen(true);
    setCategorySearch("");
    // Reset form
    setNewProduct({ name: "", category: "Minuman", price: "", stock: "", minStock: "" });
    setFeedback("Produk berhasil ditambahkan.");
  };

  const columns = [
    { key: "id", header: "ID Produk" },
    { key: "name", header: "Produk" },
    { key: "category", header: "Kategori" },
    { 
      key: "price", 
      header: "Harga",
      render: (item: any) => `Rp ${item.price.toLocaleString('id-ID')}`
    },
    { key: "stock", header: "Stok" },
    { 
      key: "status", 
      header: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "Low Stock" ? "warning" : "success"}>
          {item.status}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "Aksi",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setActiveQrProduct(item); setIsQRModalOpen(true); }} className="text-primary font-semibold">
            <QrCode className="h-4 w-4 mr-2" /> View QR
          </Button>
          <Button variant="ghost" size="sm" className="text-primary font-semibold">Edit</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-muted text-sm mt-1">Kelola data produk Anda di sini.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <Input placeholder="Cari produk..." className="pl-10" />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
      </div>

      {feedback && <p className="text-sm text-success" role="status">{feedback}</p>}

      <DataTable data={products} columns={columns} />

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Tambah Produk Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveProduct}>Simpan Produk</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <Input 
              placeholder="e.g. Kopi Vanilla" 
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <Input 
                type="number" 
                placeholder="20000"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
              />
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <Input
                placeholder="Cari kategori..."
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                aria-label="Cari kategori"
              />
              <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200" role="listbox" aria-label="Daftar kategori">
                <div className="flex flex-col">
                  {productCategories
                    .filter(category => category.toLowerCase().includes(categorySearch.toLowerCase()))
                    .map(category => (
                      <button
                        key={category}
                        type="button"
                        role="option"
                        aria-selected={newProduct.category === category}
                        onClick={() => setNewProduct({...newProduct, category})}
                        className={`w-full px-4 py-3 text-sm font-medium text-left transition-colors border-b last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${newProduct.category === category ? "bg-primary/10 text-primary border-primary" : "hover:bg-gray-50 border-gray-200"}`}
                      >
                        {category}
                      </button>
                    ))}
                </div>
                {!productCategories.some(category => category.toLowerCase().includes(categorySearch.toLowerCase())) && (
                  <p className="px-2 py-3 text-center text-sm text-muted">Kategori tidak ditemukan.</p>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">Terpilih: {newProduct.category}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stok Saat Ini</label>
              <Input 
                type="number" 
                placeholder="50"
                value={newProduct.stock}
                onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stok Minimum</label>
              <Input 
                type="number" 
                placeholder="10"
                value={newProduct.minStock}
                onChange={e => setNewProduct({...newProduct, minStock: e.target.value})} 
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isQRModalOpen} 
        onClose={() => { setIsQRModalOpen(false); setActiveQrProduct(null); }} 
        title={savedProduct ? "Produk Berhasil Ditambahkan" : "QR Code Produk"}
        footer={
          <Button onClick={() => { setIsQRModalOpen(false); setActiveQrProduct(null); }}>Tutup</Button>
        }
      >
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
              { (savedProduct || activeQrProduct) && (
                <QRCodeCanvas
                  value={JSON.stringify({
                    id: (savedProduct || activeQrProduct).id,
                    name: (savedProduct || activeQrProduct).name,
                  })}
                  size={200}
                />
              )}
            
          </div>
          <div className="w-full space-y-2 text-center">
            <h3 className="font-semibold text-lg">{(savedProduct || activeQrProduct)?.name}</h3>
            <p className="text-sm text-muted">ID: {(savedProduct || activeQrProduct)?.id}</p>
            <p className="text-sm text-muted">Kategori: {(savedProduct || activeQrProduct)?.category}</p>
            <p className="text-sm font-medium">Harga: Rp {(savedProduct || activeQrProduct)?.price.toLocaleString('id-ID')}</p>
            <p className="text-sm text-muted">Stok: {(savedProduct || activeQrProduct)?.stock} unit</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
