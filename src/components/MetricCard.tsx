import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export default function MetricCard({ title, value, change, icon: Icon, trend = "neutral" }: MetricCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600", 
    neutral: "text-slate-600"
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/60 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-5 w-5 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        {change && (
          <p className={`text-xs ${trendColors[trend]} mt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
