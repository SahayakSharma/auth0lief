import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FirestoreConfig } from "@/config/firestoreConfig"
import { collection, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function StaffStatus({ id }: { id: string }) {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<DocumentData[]>([])
    const instance = FirestoreConfig.getInstance();

     const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleDateString('en-US', {
                year:'2-digit',
                month: 'short',
                day: 'numeric',
            })
        }
        return new Date(timestamp).toLocaleDateString('en-US', {
            year:'2-digit',
            month: 'short',
            day: 'numeric',
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

    async function getData() {
        try {
            const snap = await getDocs(query(collection(instance.getDb(), 'Activities'), where('userId', '==', id), orderBy('clock_in_time', 'desc')))
            setData([])
            snap.forEach(doc => {
                setData(prev => ([...prev, { id: doc.id, ...doc.data() }]));
            })
            setLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getData();
        
    }, [])

    return (
        <Dialog>
            <DialogTrigger><p>View Check In Stats</p></DialogTrigger>
            <DialogContent className="w-[1100px] max-h-[700px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle className="text-center">Staff Record</DialogTitle>
                </DialogHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">S.No.</TableHead>
                            <TableHead>Check In Date</TableHead>
                            <TableHead>Check In Time</TableHead>
                            <TableHead>Check Out Date</TableHead>
                            <TableHead>Check Out Time</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>City</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.map((d, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index+1}</TableCell>
                                    <TableCell>{formatDate(d.clock_in_time)}</TableCell>
                                    <TableCell>{formatTime(d.clock_in_time)}</TableCell>
                                    <TableCell>{formatDate(d.clock_out_time)}</TableCell>
                                    <TableCell>{formatTime(d.clock_out_time)}</TableCell>
                                    <TableCell className="">{d.clock_in_address}</TableCell>
                                    <TableCell className="">{d.clock_in_city}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )
}