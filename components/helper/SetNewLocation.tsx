'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react"
import { FirestoreConfig } from "@/config/firestoreConfig"
import { addDoc, collection, DocumentData, serverTimestamp } from "firebase/firestore"
export default function SetNewLocation({addToLocation}:{addToLocation:(newLocation:DocumentData)=>void}) {

    const [newLocation,setNewLocation]=useState({
        state:'',
        city:'',
        lat:0,
        long:0,
        address:''
    })
    const [isDialogOpen,setIsDialogOpen]=useState<boolean>(false)
    async function registerNewAddress(){
        const instance=FirestoreConfig.getInstance();
        if(newLocation.city=='' || newLocation.state=='' || newLocation.lat==0 || newLocation.long==0 || newLocation.address==''){
            alert('incomplete information provided')
            return;
        }
        try{
            const payload={
                ...newLocation,
                created_at:serverTimestamp(),
                updated_at:serverTimestamp()
            }
            await addDoc(collection(instance.getDb(),'Locations'),payload)
            addToLocation({
                ...payload,
                created_at:new Date(),
                updated_at:new Date()
            })
            setIsDialogOpen(false)
        }
        catch(err){
            if(err instanceof Error){
                console.log(err.message)
            }
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <div className="px-4 py-3 rounded-md bg-black text-white text-center font-medium cursor-pointer" onClick={()=>setIsDialogOpen(true)}>
                    Register New Location
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Register New Location</DialogTitle>
                    <DialogDescription className="text-center">
                        Add new location for the staff to clock in and clock out.
                    </DialogDescription>
                    <Label>State</Label>
                    <Input onChange={(e)=>setNewLocation(prev=>({...prev,state:e.target.value}))}/>
                    <Label>City</Label>
                    <Input onChange={(e)=>setNewLocation(prev=>({...prev,city:e.target.value}))}/>
                    <Label>Full Address</Label>
                    <Input onChange={(e)=>setNewLocation(prev=>({...prev,address:e.target.value}))}/>
                    <div className="w-full flex gap-5">
                        <div className="w-[50%] flex flex-col gap-2">
                            <Label>Latitude</Label>
                            <Input type="number" onChange={(e)=>setNewLocation(prev=>({...prev,lat:Number(e.target.value)}))}/>
                        </div>
                        <div className="w-[50%] flex flex-col gap-2">
                            <Label>Longitude</Label>
                            <Input type="number" onChange={(e)=>setNewLocation(prev=>({...prev,long:Number(e.target.value)}))}/>
                        </div>
                    </div>
                    <div className="px-4 py-3 rounded-md bg-black text-white text-center font-medium cursor-pointer mt-5" onClick={registerNewAddress}>
                        Register Location
                    </div>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}