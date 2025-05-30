import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  growth: number;
  history: Array<{ value: number }>;
  icon: React.ReactNode;
  chartColor: string;
};

export function StatCard({
  title,
  value,
  description,
  growth,
  history,
  icon,
  chartColor,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-0">
        <div>
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {title}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <h3 className="text-3xl font-bold tracking-tight">
              {value}
            </h3>
            <span
              className={`flex items-center text-xs font-medium ${growth >= 0 ? "text-emerald-500" : "text-rose-500"}`}
            >
              {growth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {growth >= 0 ? "+" : ""}
              {growth}%
            </span>
          </div>
        </div>
        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative pt-2 pb-4">
        <p className="text-muted-foreground text-xs">
          {description}
        </p>
        <div className="mt-2 h-[40px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                fill={chartColor}
                fillOpacity={0.2}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 