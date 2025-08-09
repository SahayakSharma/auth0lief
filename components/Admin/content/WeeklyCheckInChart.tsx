import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent
} from "@/components/ui/chart";

type IChartData = {
    date: string;
    clockIns: number;
}[];

const chartConfig = {
    clockIns: {
        label: "Clock In",
        color: "#141414"
    }
} satisfies ChartConfig;

export default function WeeklyCheckInChart({ activities }: { activities: DocumentData[] }) {
    const [chartData, setChartData] = useState<IChartData>([]);
    const [loading, setLoading] = useState<boolean>(true);

    function generateChartData() {
        setLoading(true);
        const daysMap: Record<string, number> = {};

        activities.forEach(act => {
            const dateStr = act.clock_in_time
                .toDate()
                .toLocaleDateString("en-US", { month: "short", day: "numeric" });
            daysMap[dateStr] = (daysMap[dateStr] || 0) + 1;
        });

        const result: IChartData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            result.push({
                date: dateStr,
                clockIns: daysMap[dateStr] || 0
            });
        }

        setChartData(result);
        setLoading(false);
    }

    useEffect(() => {
        generateChartData();
    }, [activities]);

    if (loading) return null;

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date" 
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                    dataKey="clockIns"
                    fill={chartConfig.clockIns.color}
                    radius={4}
                />
            </BarChart>
        </ChartContainer>
    );
}
