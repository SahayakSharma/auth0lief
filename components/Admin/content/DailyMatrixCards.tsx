"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn, LogOut, Clock, Activity } from "lucide-react";

export default function DailyMatrixCards({
  clockIn,
  clockOut,
  minutes,
}: {
  clockIn: number;
  clockOut: number;
  minutes: number;
}) {
  const stats = [
    {
      title: "Total Clock-Ins",
      value: clockIn,
      icon: <LogIn className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
    {
      title: "Total Clock-Outs",
      value: clockOut,
      icon: <LogOut className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
    {
      title: "Total Time Clocked In",
      value: `${Math.floor(minutes / 60)} Hr ${Math.floor(
        minutes % 60
      )} Min`,
      icon: <Clock className="h-6 w-6 text-[#b4b4b4]" />,
      color: "black",
    },
    {
      title: "Currently Active",
      value: clockIn - clockOut,
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
