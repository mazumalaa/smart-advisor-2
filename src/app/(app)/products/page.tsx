"use client"
import { useState } from "react";
import { products as initialProducts } from "@/data/mockData";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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
    setIsAddModalOpen(false);
    // Reset form
    setNewProduct({ name: "", category: "Minuman", price: "", stock: "", minStock: "" });
    alert("Produk berhasil ditambahkan!");
  };

  const columns = [
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
      render: () => (
        <Button variant="ghost" size="sm" className="text-primary font-semibold">Edit</Button>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <Input 
                type="number" 
                placeholder="20000"
                value={newProduct.price}
                onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <select 
                className="flex h-10 w-full rounded-md border border-gray-200 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newProduct.category}
                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="Minuman">Minuman</option>
                <option value="Makanan">Makanan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
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
    </div>
  )
}
