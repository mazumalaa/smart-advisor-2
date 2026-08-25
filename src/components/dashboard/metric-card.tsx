import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string;
  value: string | number;
  growth?: number;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ title, value, growth, subtitle, className }: MetricCardProps) {
  const isPositive = growth ? growth > 0 : false;
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted">{title}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <h2 className="text-3xl font-bold">{value}</h2>
          {growth !== undefined && (
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isPositive ? "+" : ""}{growth}%
            </span>
          )}
        </div>
        {subtitle && <p className="mt-2 text-xs text-muted">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
