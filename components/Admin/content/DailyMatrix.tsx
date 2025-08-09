'use client'

import { FirestoreConfig } from "@/config/firestoreConfig";
import { collection, DocumentData, getDocs, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import ActiveStaff from "./ActiveStaffTable";
import DailyMatrixCards from "./DailyMatrixCards";

export default function DailyMatrix() {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<DocumentData[]>([])
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const [cardData, setCardData] = useState({
        clockOut: 0,
        hours: 0
    })
    
    function minutesBetween(ts1: Timestamp, ts2: Timestamp): number {
        const date1 = ts1.toDate();
        const date2 = ts2.toDate();

        const diffMs = Math.abs(date2.getTime() - date1.getTime());

        const hours = Math.floor(diffMs / (1000 * 60));

        return hours;
    }

    async function getActiveStaff() {
        const instance = FirestoreConfig.getInstance();

        try {
            const snap = await getDocs(query(collection(instance.getDb(), 'Activities'), where('clock_in_time', '>=', last24h)))
            setData([])
            setCardData({clockOut:0,hours:0})
            snap.forEach(doc => {
                setData(prev => ([...prev, { id: doc.id, ...doc.data() }]));
                if (doc.data().clock_out_time) {
                    const hours = minutesBetween(doc.data().clock_in_time, doc.data().clock_out_time);
                    setCardData(prev => ({ ...prev, clockOut: prev.clockOut + 1, hours: prev.hours + hours }))
                }
                else {
                    const hours = minutesBetween(doc.data().clock_in_time, Timestamp.fromDate(new Date()));
                    setCardData(prev => ({ ...prev, hours: prev.hours + hours }))
                }
            })
            setLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getActiveStaff()
    }, [])
    return (
        loading ?
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    <p className="text-lg font-medium text-gray-600">Loading your data...</p>
                </div>
            </div>
            :
            <main>
                <p className="font-bold text-4xl text-center pt-10 pb-5">Daily Staff Matrix</p>
                <div className="flex gap-1 justify-center font-light pb-20">
                    <p>{`Below shown is the data of staff members that have clocked-in within the last 24 hours (starting from`} </p>
                    <p>{` ${last24h.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })})`}</p>
                </div>
                <DailyMatrixCards clockIn={data.length} clockOut={cardData.clockOut} minutes={cardData.hours} />
                <ActiveStaff data={data} />
            </main>
    )
}