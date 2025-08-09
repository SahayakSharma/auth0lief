import { DocumentData } from "firebase/firestore";
import { Clock } from "lucide-react";

export default function ShiftOver({activity}:{activity:DocumentData}){

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        if (timestamp.seconds) {
            const temp = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleDateString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }).split(',')
            return temp[temp.length - 1]
        }
        const temp = new Date(timestamp).toLocaleDateString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }).split(',')
        return temp[temp.length - 1]
    }

    return(
        <main className="py-10">
            <Clock size={100} className="mx-auto text-[#bebebe]"/>
            <p className="text-center py-5 font-light">You have already completed a shift in the last 24 hours. You can start the next shift at {formatTime(activity.clock_in_time)}.</p>
        </main>
    )
}