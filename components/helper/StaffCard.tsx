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
import Image from "next/image"
import { Label } from "../ui/label"
import { useState } from "react"

export default function StaffCard({ staffDetail }: { staffDetail: DocumentData }) {
    const [isActive,setIsActive]=useState<boolean>(false)
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
        <Card className="cursor-pointer hover:border-black border-2 hover:-translate-y-2 hover:shadow-xl transition-transform duration-500" onMouseEnter={()=>setIsActive(true)} onMouseLeave={()=>setIsActive(false)}>
            <CardHeader>
            </CardHeader>
            <CardContent>
                <Image src={staffDetail?.picture} alt="image here" width={100} height={100} className={`rounded-full mx-auto ${isActive && 'border-2 border-black'}`} />
                <p className="text-center font-medium text-[20px] py-5">{staffDetail?.full_name}</p>
                <div className="py-3">
                    <Label className="font-medium">Joined On</Label>
                    <Label className="font-light py-2">{formatDate(staffDetail?.created_at)}</Label>
                </div>
                <div className="py-3">
                    <Label className="font-medium">Email</Label>
                    <Label className="font-light py-2">{staffDetail?.email}</Label>
                </div>
                <div className="py-3">
                    <Label className="font-medium">Last Clocked In</Label>
                    <Label className="font-light py-2">{staffDetail.last_clocked_in ? formatDate(staffDetail?.created_at) : 'Not clocked in yet'}</Label>
                </div>
                <div className="mx-auto border-[1px] border-black rounded-sm px-7 py-1 text-center text-[12px] my-5 hover:bg-black hover:text-white w-fit">
                    <p>View Profile</p>
                </div>
            </CardContent>
        </Card>
    )
}