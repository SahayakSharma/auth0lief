import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DocumentData, Timestamp } from "firebase/firestore"
export default function ActiveStaff({ data }: { data: DocumentData[] }) {

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    function hoursAndMinutesBetween(ts1: Timestamp, ts2: Timestamp): string {
        const date1 = ts1.toDate();
        const date2 = ts2.toDate();

        const diffMs = Math.abs(date2.getTime() - date1.getTime());

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours} Hr, ${minutes} Min`;
    }

    return (
        <Table className="my-20">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">S.No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead>{`Check In Date & Time`}</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Active Hours</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data.map((d, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index}</TableCell>
                            <TableCell>{d.user_details?.name}</TableCell>
                            <TableCell>{d.user_details?.email}</TableCell>
                            <TableCell>{formatDate(d.clock_in_time)}</TableCell>
                            <TableCell>{
                                d.clock_out_time ?
                                    <div className="flex gap-2 items-center">
                                        <div className="w-[15px] h-[15px] rounded-full bg-red-500"></div>
                                        <p>Clocked Out</p>
                                    </div>
                                    :
                                    <div className="flex gap-2 items-center">
                                        <div className="w-[15px] h-[15px] rounded-full bg-green-500"></div>
                                        <p>Active</p>
                                    </div>
                            }</TableCell>
                            <TableCell className="text-right">{
                                d.clock_out_time ? hoursAndMinutesBetween(d.clock_in_time, d.clock_out_time) : hoursAndMinutesBetween(d.clock_in_time, Timestamp.fromDate(new Date()))
                            }</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}