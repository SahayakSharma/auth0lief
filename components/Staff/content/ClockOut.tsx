import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FirestoreConfig } from "@/config/firestoreConfig";
import { doc, DocumentData, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";

export default function ClockOut({ activity, setClockedOutNow }: { activity: DocumentData, setClockedOutNow: () => void }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [note,setNote]=useState<string>('')
    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        }
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }
    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        if (timestamp.seconds) {
            const temp = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleDateString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).split(',')
            return temp[temp.length - 1]
        }
        const temp = new Date(timestamp).toLocaleDateString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).split(',')
        return temp[temp.length - 1]
    }

    async function clockOut() {
        const instance = FirestoreConfig.getInstance()
        setLoading(true)
        try {
            await updateDoc(doc(instance.getDb(), 'Activities', activity.id), {
                clock_out_time: serverTimestamp()
            })
            setClockedOutNow()
            setLoading(false)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-[700px] mx-auto">
            <CardContent>
                {
                    loading ?
                        <div className="flex items-center justify-center h-[200px] bg-white">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                                <p className="text-lg font-medium text-gray-600">Getting the work done</p>
                            </div>
                        </div>
                        :
                        <div>
                            <p className="font-bold text-2xl text-center">Current Shift</p>
                            <p className="font-light text-center text-[15px]">Your current shift is in progress. Click below to end your shift.</p>
                            <div className="flex justify-around py-10">
                                <div className="bg-[#f3f3f3] py-2 px-5 rounded-md">
                                    <Label className="text-[15px] font-medium">Clock In Date</Label>
                                    <Label className="text-[13px] font-light">{formatDate(activity?.clock_in_time)}</Label>
                                </div>
                                <div className="bg-[#f3f3f3] py-2 px-5 rounded-md">
                                    <Label className="text-[15px] font-medium">Clock In Time</Label>
                                    <Label className="text-[13px] font-light">{formatTime(activity?.clock_in_time)}</Label>
                                </div>
                            </div>
                            <Label>Additional Note</Label>
                            <Input value={note} onChange={(e)=>setNote(e.target.value)}/>
                            <div className="px-15">
                                <Button className="w-full" onClick={clockOut}>Clock Out Now</Button>
                            </div>
                        </div>
                }


            </CardContent>
        </Card>
    )
}