"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, LogOut, Clock, Activity } from "lucide-react";

export default function MonitoringCards({
  totalStaff,
  clockIns,
  minutes,
  numberOfLocations
}: {
  totalStaff: number;
  clockIns: number;
  minutes: number;
  numberOfLocations:number
}) {
  const stats = [
    {
      title: "Total Staff Till Date",
      value: totalStaff,
      icon: <LogIn className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
    {
      title: "1 Week Clock Ins",
      value: clockIns,
      icon: <LogOut className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
    {
      title: "1 Week Clock In Time",
      value: `${Math.floor(minutes / 60)} Hr ${Math.floor(
        minutes % 60
      )} Min`,
      icon: <Clock className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
    {
      title: "Total Locations Registered",
      value: numberOfLocations,
      icon: <Activity className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
  ];

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`hover:shadow-lg transition-shadow duration-300 border-t-4 ${stat.color}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
