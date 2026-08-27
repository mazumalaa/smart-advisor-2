"use client"
import { useState } from "react";
import { products, transactions as initialTransactions } from "@/data/mockData";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Modal } from "@/components/ui/modal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [newTrx, setNewTrx] = useState({
    product: products[0].name,
    productCount: "",
    total: "",
    payment: "QRIS",
  });

  const handleSaveTransaction = () => {
    const trx = {
      id: `TRX-${Math.floor(Math.random() * 100000)}`,
      product: newTrx.product,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      productCount: parseInt(newTrx.productCount) || 1,
      total: parseInt(newTrx.total) || 0,
      payment: newTrx.payment,
      status: "Selesai"
    };
    setTransactions([trx, ...transactions]);
    setIsAddModalOpen(false);
    setNewTrx({ product: products[0].name, productCount: "", total: "", payment: "QRIS" });
    setFeedback("Transaksi berhasil ditambahkan.");
  };
  const columns = [
    { key: "id", header: "ID Transaksi" },
    { key: "time", header: "Waktu", render: (item: any) => item.time || "-" },
    { key: "date", header: "Tanggal" },
    { key: "productCount", header: "Jumlah Produk", render: (item: any) => `${item.productCount} item` },
    { 
      key: "total", 
      header: "Total",
      render: (item: any) => `Rp ${item.total.toLocaleString('id-ID')}`
    },
    { key: "payment", header: "Pembayaran" },
    { 
      key: "status", 
      header: "Status",
      render: (item: any) => <Badge variant="success">{item.status}</Badge>
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-muted text-sm mt-1">Pantau semua penjualan Anda.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Transaksi Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard title="Penjualan Hari Ini" value="Rp 1.240.000" />
        <MetricCard title="Transaksi Hari Ini" value={38} />
        <MetricCard title="Produk Terjual" value={96} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <Input placeholder="Cari transaksi (ID, tanggal)..." className="pl-10" />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
      </div>

      {feedback && <p className="text-sm text-success" role="status">{feedback}</p>}

      <DataTable data={transactions} columns={columns} />

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Catat Transaksi Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveTransaction}>Simpan Transaksi</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Produk</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-200 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={newTrx.product}
                onChange={e => setNewTrx({...newTrx, product: e.target.value})}
              >
                {products.map(product => <option key={product.id} value={product.name}>{product.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Item</label>
              <Input 
                type="number" 
                placeholder="2"
                value={newTrx.productCount}
                onChange={e => setNewTrx({...newTrx, productCount: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Harga (Rp)</label>
              <Input 
                type="number" 
                placeholder="50000"
                value={newTrx.total}
                onChange={e => setNewTrx({...newTrx, total: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
            <select 
              className="flex h-10 w-full rounded-md border border-gray-200 bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={newTrx.payment}
              onChange={e => setNewTrx({...newTrx, payment: e.target.value})}
            >
              <option value="QRIS">QRIS</option>
              <option value="Cash">Cash</option>
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Kartu Debit">Kartu Debit</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
