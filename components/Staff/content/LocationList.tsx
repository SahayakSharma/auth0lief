import { FirestoreConfig } from "@/config/firestoreConfig"
import { collection, DocumentData, getDocs, query } from "firebase/firestore"
import { useEffect, useState } from "react";
import LocationCard from "./LocationCard";

export default function LocationList({setClockedInNow}:{setClockedInNow:()=>void}) {
    const [locations, setLocations] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    async function getLocations() {
        const instance = FirestoreConfig.getInstance()
        try {
            const snap = await getDocs(query(collection(instance.getDb(), 'Locations')));
            setLocations([])
            snap.forEach(doc => {
                setLocations(prev => ([...prev, { id: doc.id, ...doc.data() }]));
            })
            setLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getLocations()
    }, [])
    return (
        loading ? <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-lg font-medium text-gray-600">Loading locations...</p>
            </div>
        </div> :
            <main>
                <p className="py-5 text-center font-light">You have not clocked in in last 24 hrs. Clock in now to start your shift</p>
                <div className="grid grid-cols-4 py-10 gap-6">
                    {
                        locations.map((location, index) => (
                            <LocationCard location={location} key={index} setClockedInNow={setClockedInNow}/>
                        ))
                    }
                </div>
            </main>
    )
}