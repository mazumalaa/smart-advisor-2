import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

interface AIInsightCardProps {
  summary: string;
  onViewDetails?: () => void;
}

export function AIInsightCard({ summary, onViewDetails }: AIInsightCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-white p-2 rounded-full shadow-sm border border-blue-100 shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              ✨ AI Business Insight
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {summary}
            </p>
            {onViewDetails && (
              <Button onClick={onViewDetails} className="mt-2 text-xs font-semibold px-4 py-2" size="sm">
                Lihat Analisis Lengkap
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
