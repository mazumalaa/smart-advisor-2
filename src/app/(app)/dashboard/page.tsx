import { businessProfile, salesAnalytics } from "@/data/mockData";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { SimpleLineChart } from "@/components/charts/base-charts";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Selamat datang kembali, {businessProfile.owner.split(' ')[0]} 👋</h1>
          <p className="text-muted mt-1">Berikut ringkasan performa {businessProfile.name}.</p>
        </div>
        <div className="w-32">
          <Select defaultValue="30">
            <option value="7">7 Hari</option>
            <option value="30">30 Hari</option>
            <option value="90">3 Bulan</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Pendapatan" value={`Rp ${(salesAnalytics.revenue / 1000000).toFixed(2)}M`} growth={salesAnalytics.revenueGrowth} subtitle="vs bulan lalu" />
        <MetricCard title="Total Transaksi" value={salesAnalytics.totalTransactions} growth={salesAnalytics.transactionGrowth} subtitle="vs bulan lalu" />
        <MetricCard title="Produk Terjual" value={salesAnalytics.productsSold} growth={salesAnalytics.productsGrowth} subtitle="vs bulan lalu" />
        <MetricCard title="Rata-rata Transaksi" value={`Rp ${(salesAnalytics.aov / 1000).toFixed(1)}k`} growth={salesAnalytics.aovGrowth} subtitle="vs bulan lalu" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performa Penjualan</CardTitle>
            <p className="text-sm text-muted">30 hari terakhir</p>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={salesAnalytics.trendData} dataKey="revenue" seriesName="Pendapatan" />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <AIInsightCard summary={salesAnalytics.aiSummary} />
          
          <Card>
            <CardHeader>
              <CardTitle>Produk Teratas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesAnalytics.productPerformance.slice(0, 3).map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div>
                      <p className="font-medium">{idx + 1}. {prod.name}</p>
                      <p className="text-sm text-muted">{prod.sold} terjual</p>
                    </div>
                    <p className="font-semibold text-primary">Rp {(prod.revenue / 1000000).toFixed(2)}M</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
