import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";

type ResourceChartProps = {
  data: Array<{
    type: string;
    count: number;
  }>;
};

export function ResourceChart({ data }: ResourceChartProps) {
  const chartData = data.map((item, index) => ({
    type: item.type,
    count: item.count,
    fill: `var(--chart-${index + 1})`,
  }));

  const chartConfig = {
    count: {
      label: "Count",
    },
    attachment: {
      label: "Attachment",
      color: "var(--chart-1)",
    },
    quiz: {
      label: "Quiz",
      color: "var(--chart-2)",
    },
    rich_text: {
      label: "Rich Text",
      color: "var(--chart-3)",
    },
    external: {
      label: "External",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Types</CardTitle>
        <CardDescription>
          Types of resources created over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="type"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="type" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
