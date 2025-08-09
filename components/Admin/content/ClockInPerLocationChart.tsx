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

// Utility to create consistent location key
function getLocationKey(address?: string, city?: string, state?: string) {
    return [address, city, state].filter(Boolean).join(", ");
}

// Generate chart data ensuring all saved locations appear
function generateLocationChartData(activities: DocumentData[], savedLocations: DocumentData[]) {
    const locationMap: Record<string, number> = {};

    // Count clock-ins from activities
    activities.forEach(act => {
        const key = getLocationKey(
            act.clock_in_address,
            act.clock_in_city,
            act.clock_in_state
        );
        locationMap[key] = (locationMap[key] || 0) + 1;
    });

    // Ensure all saved locations are included with at least 0
    savedLocations.forEach(loc => {
        const key = getLocationKey(
            loc.address,
            loc.city,
            loc.state
        );
        if (!locationMap.hasOwnProperty(key)) {
            locationMap[key] = 0;
        }
    });

    // Convert to chart format
    return Object.keys(locationMap).map(location => ({
        location,
        clockIns: locationMap[location]
    }));
}

const chartConfig = {
    clockIns: {
        label: "Clock Ins",
        color: "#141414" 
    }
} satisfies ChartConfig;

export default function ClockInPerLocationChart({
    activities,
    locations 
}: {
    activities: DocumentData[];
    locations: DocumentData[];
}) {
    const [chartData, setChartData] = useState<{ location: string; clockIns: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const result = generateLocationChartData(activities, locations);
        setChartData(result);
        setLoading(false);
    }, [activities, locations]);

    if (loading) return null;

    return (
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="location"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    interval={0}
                    tickFormatter={(value) => value.split(",")[0]} // only first part of address
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
