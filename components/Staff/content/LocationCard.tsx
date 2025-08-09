import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DocumentData } from "firebase/firestore"
import { Calendar, Clock, MapPin, MapPinHouse, MousePointer2, Navigation, Trash } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import ClockIn from "./ClockIn"
export default function LocationCard({ location,setClockedInNow }: { location: DocumentData,setClockedInNow:()=>void }) {
    const [isHover, setIsHover] = useState<boolean>(false)

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        }
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <Card onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className={`rounded-xl hover:shadow-2xl border-2 ${isHover && 'border-black'} hover:-translate-y-2 transition-transform duration-500`}>
            <CardContent >
                <div className="flex items-center gap-5 border-b-[1px] border-[#dddddd] pb-5">
                    <div className="bg-black rounded-sm w-[50px] h-[50px] flex items-center justify-center"><MapPin size={20} color="white" /></div>
                    <div className="flex flex-col gap-0">
                        <p className="font-bold text-[20px]">{location?.city}</p>
                        <p className="font-normal text-[15px]">{location?.state} {`(${location?.perimeter} Km)`}</p>
                    </div>
                </div>
                <div className="mt-5 p-5 bg-[#f5f5f5] rounded-md flex gap-5 items-center">
                    <div className="flex gap-5 items-center">
                        <MapPinHouse className="text-[#a7a7a7]" />
                        <div className="flex flex-col">
                            <p className="text-[15px] font-medium">Full Address</p>
                            <p className="text-[13px] font-light">{location?.address}</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                    <div className="flex gap-5 items-center">
                        <Calendar className="text-[#a7a7a7]" />
                        <div className="flex flex-col">
                            <p className="text-[15px] font-medium">Registered</p>
                            <p className="text-[13px] font-light">{formatDate(location?.created_at)}</p>
                        </div>
                    </div>
                    {
                        formatDate(location?.created_at) == formatDate(new Date()) && <Badge variant="outline" className="">Today</Badge>
                    }
                </div>
                <div className="p-5 flex items-center justify-between">
                    <div className="flex gap-5 items-center">
                        <Clock className="text-[#a7a7a7]" />
                        <div className="flex flex-col">
                            <p className="text-[15px] font-medium">Last Updated</p>
                            <p className="text-[13px] font-light">{formatDate(location?.updated_at)}</p>
                        </div>
                    </div>
                    {
                        formatDate(location?.updated_at) == formatDate(new Date()) && <Badge variant="outline" className="">Today</Badge>
                    }
                </div>
                <div className="flex items-center px-5 py-2 rounded-md bg-[#f2f2f2]">
                    <div className="flex flex-col w-[50%]">
                        <p className="text-[15px] font-medium">Latitude</p>
                        <p className="text-[13px] font-light">{location?.lat}</p>
                    </div>
                    <div className="flex flex-col w-[50%]">
                        <p className="text-[15px] font-medium">Longitude</p>
                        <p className="text-[13px] font-light">{location?.long}</p>
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <ClockIn registeredLocation={location} setClockedInNow={setClockedInNow}/>
                </div>
            </CardContent>
        </Card>
    )
}