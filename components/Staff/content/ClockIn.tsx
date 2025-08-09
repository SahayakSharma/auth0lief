
import { Button } from "@/components/ui/button";
import {getDistance} from 'geolib'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { addDoc, collection, doc, DocumentData, serverTimestamp, updateDoc } from "firebase/firestore";
import { Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { FirestoreConfig } from "@/config/firestoreConfig";
import { useUser } from "@auth0/nextjs-auth0";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ClockIn({ registeredLocation,setClockedInNow }: { registeredLocation: DocumentData,setClockedInNow:()=>void }) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<GeolocationPositionError | null>(null)
    const [location, setLocation] = useState({
        lat: 0,
        long: 0
    })
    const [note,setNote]=useState<string>('')
    const {user}=useUser();
    function getCurrentLocation() {
        setLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                });
                setErrorMsg(null)
            },
            (err) => {
                setErrorMsg(err);
            }
        );
        setLoading(false)
    }

    async function confirmCheckIn(){
        setLoading(true)
        if(location.lat==0 || location.long==0){
            toast("Location invalid")
            setIsOpen(false)
            return;
        }
        if(!user?.sub) return;
        const check=checkIsInRange();
        if(!check){
            setIsOpen(false)
            toast("You are not within a valid location")
            return;
        }
        const instance=FirestoreConfig.getInstance()
        try{
            const payload={
                userId:user?.sub,
                clock_in_time:serverTimestamp(),
                clock_in_location:registeredLocation.id,
                clock_in_city:registeredLocation.city,
                clock_in_state:registeredLocation.state,
                clock_in_address:registeredLocation.address,
                additional_text:note,
                user_details:user
            }
            await addDoc(collection(instance.getDb(),'Activities'),payload)
            await updateDoc(doc(instance.getDb(),'Users',user?.sub),{
                last_clocked_in:serverTimestamp()
            })
            setClockedInNow()
            setLoading(false)
        }
        catch(err){
            if(err instanceof Error)toast(err.message);
        }
        finally{
            setIsOpen(false)
        }

    }
    
    function checkIsInRange():boolean{
        const distance=getDistance({latitude:location.lat,longitude:location.long},{latitude:registeredLocation.lat,longitude:registeredLocation.long});
        const threshold=registeredLocation.perimeter*1000;
        if(distance <= threshold){
            return true
        }
        return false
    }


    useEffect(() => {
        if ("geolocation" in navigator) {
            getCurrentLocation();
        }
        else {
            setErrorMsg(new GeolocationPositionError())
        }
        setLoading(false)
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div className="px-5 py-2 rounded-md text-center hover:text-white hover:bg-black border-2 cursor-pointer mt-7 flex gap-3 items-center">
                    <Clock size={20} />
                    <p>Clock In</p>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle className="text-center">Clock in</DialogTitle>
                {
                    loading ?
                        <div className="flex items-center justify-center h-[200px] bg-white">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                                <p className="text-lg font-medium text-gray-600">Getting the work done</p>
                            </div>
                        </div> :
                        <div>
                            {
                                errorMsg && <div className="flex flex-col">
                                    <p className="text-red-600 text-[15px]">{errorMsg.message}</p>
                                    {
                                        errorMsg.code === 1 ? <p className="text-[12px]">Allow permission to proceed</p> : <p className="underline text-[12px] cursor-pointer" onClick={() => getCurrentLocation()}>Click to Retry</p>
                                    }
                                </div>
                            }
                            <div className="flex gap-5 items-center py-5">
                                <div className="w-[50px] h-[50px] bg-black rounded-md flex items-center justify-center"><MapPin color="white" /></div>
                                <div>
                                    <span className="">
                                        <p className="text-[20px] font-bold">{registeredLocation.city}</p>
                                        <p className="text-[15px] font-normal">{registeredLocation.state}{`, ${registeredLocation.address}`}</p>
                                    </span>
                                </div>
                            </div>
                            <Label>Additional Note</Label>
                            <Input value={note} onChange={(e)=>setNote(e.target.value)}/>
                            <Button onClick={confirmCheckIn} disabled={errorMsg != null} className="w-full">Confirm Check In</Button>
                        </div>
                }
            </DialogContent>
        </Dialog>
    )
}