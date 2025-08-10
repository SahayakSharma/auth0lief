import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FirestoreConfig } from "@/config/firestoreConfig"
import { deleteDoc, doc, DocumentData } from "firebase/firestore"
import { MapPin, Trash } from "lucide-react"
import { useState } from "react"


export default function DeleteLocation({ id, location,removeLocation }: { id: string, location: DocumentData,removeLocation:(id:string)=>void }) {
    const [isOpen,setIsOpen]=useState<boolean>(false)


    async function deleteLocation() {
        const instance=FirestoreConfig.getInstance()
        try{
            await deleteDoc(doc(instance.getDb(),'Locations',id))
            setIsOpen(false)
            removeLocation(id)
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Trash className="text-[#a7a7a7] cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="w-[600px]">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this location.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-5 items-center">
                    <div className="w-[50px] h-[50px] bg-black rounded-md flex items-center justify-center">
                        <MapPin color="white"/>
                    </div>
                    <div className="flex flex-col gap-0">
                        <p className="text-[20px] font-bold">{location?.city}</p>
                        <p className="text-[15px] font-normal">{location?.state}</p>
                    </div>
                </div>
                <div className="flex items-center px-5 py-2 rounded-md">
                    <div className="flex flex-col w-[50%]">
                        <p className="text-[15px] font-medium">Latitude</p>
                        <p className="text-[13px] font-light">{location?.lat}</p>
                    </div>
                    <div className="flex flex-col w-[50%]">
                        <p className="text-[15px] font-medium">Longitude</p>
                        <p className="text-[13px] font-light">{location?.long}</p>
                    </div>
                </div>
                <div className="flex gap-5">
                    <p className="w-[50%] text-center font-bold border-2 rounded-md py-2 hover:border-white hover:bg-black hover:text-white cursor-pointer" onClick={()=>setIsOpen(false)}>Cancel</p>
                    <p className="w-[50%] text-center font-bold border-2 rounded-md py-2 hover:border-white hover:bg-black hover:text-white cursor-pointer" onClick={deleteLocation}>Delete</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}