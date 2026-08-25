"use client"
import { inventorySummary, inventoryHistory, products } from "@/data/mockData";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  const columns = [
    { key: "name", header: "Produk" },
    { key: "stock", header: "Stok Saat Ini", render: (item: any) => <span className="font-bold">{item.stock}</span> },
    { key: "minStock", header: "Stok Minimum", render: (item: any) => <span className="text-muted">{item.minStock}</span> },
    { 
      key: "status", 
      header: "Status",
      render: (item: any) => (
        <Badge variant={item.status === "Low Stock" ? "warning" : "success"}>
          {item.status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">Inventori</h1>
        <p className="text-muted text-sm mt-1">Pantau dan kelola stok produk Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Produk" value={inventorySummary.totalProducts} />
        <MetricCard title="Stok Rendah" value={inventorySummary.lowStock} className="border-warning/50 bg-orange-50/30" />
        <MetricCard title="Stok Habis" value={inventorySummary.outOfStock} className="border-critical/50 bg-red-50/30" />
        <MetricCard title="Perlu Restock" value={inventorySummary.needsRestock} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <DataTable data={products} columns={columns} />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Histori Inventori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {inventoryHistory.map((history) => (
                  <div key={history.id} className="flex gap-4 relative">
                    <div className="absolute left-[5px] top-6 bottom-[-1.5rem] w-px bg-gray-200 last:hidden"></div>
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 ${history.qty > 0 ? 'bg-success' : 'bg-primary'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{history.type}: {history.product}</p>
                      <p className="text-xs text-muted">{history.date}</p>
                      <p className={`text-sm font-bold mt-1 ${history.qty > 0 ? 'text-success' : 'text-foreground'}`}>
                        {history.qty > 0 ? '+' : ''}{history.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
