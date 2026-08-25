import { aiForecast } from "@/data/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";

export default function ForecastPage() {
  const columns = [
    { key: "name", header: "Produk" },
    { key: "predicted", header: "Prediksi 7 Hari (Unit)" },
    { 
      key: "confidence", 
      header: "Tingkat Keyakinan",
      render: (item: any) => `${item.confidence}%`
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">AI Sales Forecast</h1>
        <p className="text-muted text-sm mt-1">Prediksi penjualan berdasarkan histori transaksi bisnis Anda.</p>
      </div>

      <Card className="bg-primary text-white border-0">
        <CardContent className="p-8">
          <h2 className="text-3xl font-bold mb-2">📈 {aiForecast.summary.message}</h2>
          <p className="text-primary-foreground/80 text-lg">
            Penjualan diperkirakan meningkat <span className="font-bold text-white">{aiForecast.summary.prediction}</span> dalam 7 hari ke depan.
          </p>
          <div className="mt-6 inline-flex gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <p className="text-xs text-white/60 uppercase">Confidence Level</p>
              <p className="font-bold">{aiForecast.summary.confidence}</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <p className="text-xs text-white/60 uppercase">Model</p>
              <p className="font-bold">{aiForecast.summary.model}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prediksi per Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={aiForecast.productForecasts} columns={columns} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan 7 Hari ke Depan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiForecast.trend.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <span className="font-medium text-muted">{t.day}</span>
                  <span className="font-bold">{t.predicted} unit</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
