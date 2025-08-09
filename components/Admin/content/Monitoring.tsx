'use client'
import { FirestoreConfig } from "@/config/firestoreConfig";
import MonitoringCards from "./MonitoringCards";
import { useEffect, useState } from "react";
import { collection, DocumentData, getDocs, query, Timestamp, where } from "firebase/firestore";
import { useUser } from "@auth0/nextjs-auth0";
import WeeklyCheckInChart from "./WeeklyCheckInChart";
import ClockInPerLocationChart from "./ClockInPerLocationChart";

type IData = {
    staff: DocumentData[],
    locations: DocumentData[],
    activities: DocumentData[],
    minutesClockedIn: number
}
export default function Monitoring() {
    const instance = FirestoreConfig.getInstance();
    const [data, setData] = useState<IData>({
        staff: [],
        locations: [],
        activities: [],
        minutesClockedIn: 0
    })
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useUser();
    const last7d = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    function minutesBetween(ts1: Timestamp, ts2: Timestamp): number {
        const date1 = ts1.toDate();
        const date2 = ts2.toDate();

        const diffMs = Math.abs(date2.getTime() - date1.getTime());

        const hours = Math.floor(diffMs / (1000 * 60));

        return hours;
    }

    async function getData() {
        if (!user?.sub) return;
        setLoading(true)
        try {
            const staffQuery = query(collection(instance.getDb(), 'Users'))
            const locationQuery = query(collection(instance.getDb(), 'Locations'))
            const activityQuery = query(collection(instance.getDb(), 'Activities'), where('clock_in_time', '>=', Timestamp.fromDate(last7d)))
            const [staffSnap, locationSnap, activitySnap] = await Promise.all([
                getDocs(staffQuery),
                getDocs(locationQuery),
                getDocs(activityQuery)
            ])
            setData({ staff: [], locations: [], activities: [], minutesClockedIn: 0 })
            console.log(staffSnap.docs.length, locationSnap.docs.length, activitySnap.docs.length)
            staffSnap.docs.filter(doc => doc.id != user?.sub);
            staffSnap.forEach(doc => {
                setData(prev => ({ ...prev, staff: [...prev.staff, { id: doc.id, ...doc.data() }] }))
            })
            locationSnap.forEach(doc => {
                setData(prev => ({ ...prev, locations: [...prev.locations, { id: doc.id, ...doc.data() }] }))
            })
            activitySnap.forEach(doc => {
                setData(prev => ({ ...prev, activities: [...prev.activities, { id: doc.id, ...doc.data() }] }))
                if (doc.data().clock_out_time) {
                    const minutes = minutesBetween(doc.data().clock_in_time, doc.data().clock_out_time);
                    setData(prev => ({ ...prev, minutesClockedIn: prev.minutesClockedIn + minutes }))
                }
                else {
                    const minutes = minutesBetween(doc.data().clock_in_time, Timestamp.fromDate(new Date()));
                    if(minutes < 24*60){
                        setData(prev => ({ ...prev, minutesClockedIn: prev.minutesClockedIn + minutes }))
                    }
                    else{
                        setData(prev => ({ ...prev, minutesClockedIn: prev.minutesClockedIn + 24*60 }))
                    }
                }
            })
            setLoading(false)
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getData();
    }, [])
    return (
        loading ? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    <p className="text-lg font-medium text-gray-600">
                        Loading your data...
                    </p>
                </div>
            </div>
        ) : (
            <main className="min-h-screen space-y-8">
                <div className=" mx-auto text-center">
                    <h1 className="text-3xl font-bold ">
                        Staff Activity Monitoring
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Overview of staff activity, check-ins, and location performance for the last 7 days.
                    </p>
                </div>

                <div className=" mx-auto">
                    <MonitoringCards
                        totalStaff={data.staff.length}
                        clockIns={data.activities.length}
                        minutes={data.minutesClockedIn}
                        numberOfLocations={data.locations.length}
                    />
                </div>

                <div className=" mx-auto  rounded-xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold  mb-4">
                        Weekly Clock-Ins
                    </h2>
                    <WeeklyCheckInChart activities={data.activities} />
                </div>

                <div className=" mx-auto rounded-xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold  mb-4">
                        Clock-Ins by Location
                    </h2>
                    <ClockInPerLocationChart
                        activities={data.activities}
                        locations={data.locations}
                    />
                </div>
            </main>
        )
    );


}