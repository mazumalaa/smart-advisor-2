import { salesAnalytics } from "@/data/mockData";
import { SimpleLineChart, SimpleBarChart } from "@/components/charts/base-charts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">Analitik Penjualan</h1>
        <p className="text-muted text-sm mt-1">Insight mendalam mengenai performa bisnis Anda.</p>
      </div>

      <AIInsightCard summary={salesAnalytics.aiSummary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Pendapatan (30 Hari)</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={salesAnalytics.trendData} dataKey="revenue" seriesName="Pendapatan" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penjualan Berdasarkan Hari</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={salesAnalytics.trendData} xKey="day" yKey="revenue" seriesName="Pendapatan" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
