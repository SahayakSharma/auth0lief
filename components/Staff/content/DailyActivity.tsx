'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { FirestoreConfig } from "@/config/firestoreConfig"
import { collection, DocumentData, getDocs, query, Timestamp, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import ClockOut from "./ClockOut"
import ShiftOver from "./ShiftOver"
import LocationList from "./LocationList"
import { useUser } from "@auth0/nextjs-auth0"

type ILastRec={
    lastClockedIn:Date|null,
    lastClockedOut:Date|null,
    lastActivity:DocumentData
}
type IStatus={
    clockedIn:boolean,
    clockedOut:boolean,
}

export default function DailyActivity(){
    const [loading,setLoading]=useState<boolean>(true)
    const {user}=useUser();
    const [status,setStatus]=useState<IStatus>({
        clockedIn:false,
        clockedOut:false
    })

    const [lastRec,setLastRec]=useState<ILastRec>({
        lastClockedIn:null,
        lastClockedOut:null,
        lastActivity:{}
    })

    async function setClockedInNow(){
        setStatus(prev=>({...prev,clockedIn:true}))
        
        const now=new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const instace=FirestoreConfig.getInstance()
        const snap=await getDocs(query(collection(instace.getDb(),'Activities'),where('userId','==',user?.sub),where('clock_in_time','>=',Timestamp.fromDate(last24h))))
        if(snap.docs.length > 0){
            setLastRec(prev=>({...prev,lastClockedIn:new Date(),lastActivity:{id:snap.docs[0].id,...snap.docs[0].data()}}))
        }
    }

    function setClockedOutNow(){
        setStatus(prev=>({...prev,clockedOut:true}))
        setLastRec(prev=>({...prev,lastClockedIn:new Date(),lastActivity:{...lastRec.lastActivity,clock_out_time:new Date()}}))

    }
    async function getPresentDayStatus() {
        const instace=FirestoreConfig.getInstance()
        const now=new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        try{
            const snap=await getDocs(query(collection(instace.getDb(),'Activities'),where('userId','==',user?.sub),where('clock_in_time','>=',Timestamp.fromDate(last24h))))
            if(snap.docs.length==0){
                setLoading(false)
                return;
            }
            setStatus(prev=>({...prev,clockedIn:true}))
            let doc=snap.docs[0].data();
            doc={...doc,id:snap.docs[0].id}
            const timestamp=doc.clock_in_time;
            setLastRec(prev=>({...prev,lastClockedIn:new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000),lastActivity:doc}))
            if(doc.clock_out_time==null){
                setLoading(false)
                return;
            }
            const clockOut=doc.clock_out_time;
            setStatus(prev=>({...prev,clockedOut:true}))
            setLastRec(prev=>({...prev,lastClockedOut:new Date(clockOut.seconds * 1000 + (clockOut.nanoseconds || 0) / 1000000)}))
            setLoading(false)
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getPresentDayStatus();
    },[])
    return(
        loading ? <Loader/> : 
        <main>
            {
                !status.clockedIn && <LocationList setClockedInNow={setClockedInNow}/>
            }
            {
                status.clockedIn && !status.clockedOut && <ClockOut activity={lastRec.lastActivity} setClockedOutNow={setClockedOutNow}/>
            }
            {
                status.clockedIn && status.clockedOut && <ShiftOver activity={lastRec.lastActivity}/>
            }
        </main>
    )
}


function Loader(){
    return(
        <main className="w-full">
            <Skeleton className="w-[70%] mx-auto h-[50px] bg-[#ececec]"/>
        </main>
    )
}