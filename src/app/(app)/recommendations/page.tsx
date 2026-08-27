import { aiRecommendations, transactions } from "@/data/mockData";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { createSalesInsight } from "@/lib/sales-insights";

export default function RecommendationsPage() {
  const salesInsight = createSalesInsight(transactions);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">AI Recommendations</h1>
        <p className="text-muted text-sm mt-1">Rekomendasi bisnis berdasarkan kondisi dan prediksi bisnis Anda.</p>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">Semua</button>
        <button className="px-4 py-2 rounded-full border border-gray-200 bg-surface text-foreground text-sm font-medium hover:bg-gray-50">High</button>
        <button className="px-4 py-2 rounded-full border border-gray-200 bg-surface text-foreground text-sm font-medium hover:bg-gray-50">Medium</button>
        <button className="px-4 py-2 rounded-full border border-gray-200 bg-surface text-foreground text-sm font-medium hover:bg-gray-50">Low</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <RecommendationCard
          priority={salesInsight.priority}
          title={salesInsight.title}
          description={salesInsight.description}
          actionText={salesInsight.action}
        />
        {aiRecommendations.map((rec) => (
          <RecommendationCard 
            key={rec.id}
            priority={rec.priority as any}
            title={rec.title}
            description={rec.description}
            actionText={rec.action}
          />
        ))}
      </div>
    </div>
  )
}
